import json
import logging
import os
import asyncio
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from google.api_core import exceptions

# Cấu hình logging
logger = logging.getLogger(__name__)

class GeminiError(Exception):
    """Base exception cho Gemini Service"""
    def __init__(self, message: str, code: str):
        self.message = message
        self.code = code
        super().__init__(self.message)

class GeminiParseError(GeminiError):
    """Lỗi khi không thể parse JSON từ AI"""
    pass

class GeminiService:
    def __init__(self, api_key: str, model_name: str = "gemini-2.0-flash"):
        if api_key:
            genai.configure(api_key=api_key)
        self.model_name = model_name
        self.system_prompt = self._load_system_prompt()

    def _load_system_prompt(self) -> str:
        """Load prompt từ file hệ thống"""
        try:
            # Đường dẫn tương đối từ thư mục backend
            path = os.path.join(os.path.dirname(__file__), "..", "system_prompt.txt")
            with open(path, "r", encoding="utf-8") as f:
                return f.read().strip()
        except FileNotFoundError:
            logger.error("Không tìm thấy file system_prompt.txt")
            return "Bạn là trợ lý tài chính. Trả về JSON."

    def build_messages(self, history: List[Dict[str, str]], new_message: str) -> List[Dict[str, Any]]:
        """
        Xây dựng danh sách message với cơ chế Sliding Window (20 lượt).
        Format: [{'role': 'user/model', 'parts': [...]}]
        """
        # Giữ tối đa 20 lượt
        window_history = history[-20:] if len(history) > 20 else history
        
        formatted_messages = []
        for turn in window_history:
            role = "user" if turn["role"] == "user" else "model"
            # History từ client thường có dạng {role, content}
            content = turn.get("content") or turn.get("parts", "")
            formatted_messages.append({"role": role, "parts": [content]})
            
        # Thêm tin nhắn mới
        formatted_messages.append({"role": "user", "parts": [new_message]})
        return formatted_messages

    async def call_gemini(self, messages: List[Dict[str, Any]], is_retry: bool = False) -> Dict[str, Any]:
        """ Gọi Gemini API với logic retry và xử lý lỗi """
        try:
            model_with_instr = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=self.system_prompt
            )
            
            # Sử dụng generate_content_async cho stateless request
            response = await model_with_instr.generate_content_async(
                contents=messages,
                generation_config=genai.types.GenerationConfig(
                    response_mime_type="application/json",
                )
            )

            if not response.text:
                raise GeminiError("AI trả về nội dung rỗng", "EMPTY_RESPONSE")

            try:
                # Loại bỏ markdown nếu AI lỡ tay thêm vào
                clean_json = response.text.strip().replace("```json", "").replace("```", "")
                return json.loads(clean_json)
            
            except json.JSONDecodeError as e:
                if not is_retry:
                    logger.warning("Parse JSON lỗi, đang thử lại lần 1...")
                    # Thêm yêu cầu sửa lỗi vào cuối danh sách tin nhắn
                    retry_messages = messages + [{"role": "user", "parts": ["Hãy trả lại đúng format JSON như đã yêu cầu"]}]
                    return await self.call_gemini(retry_messages, is_retry=True)
                
                logger.error(f"Thất bại khi parse JSON sau retry: {str(e)}")
                raise GeminiParseError("Không thể đọc được dữ liệu từ AI. Vui lòng thử lại.", "PARSE_FAILED")

        except exceptions.DeadlineExceeded:
            raise GeminiError("Kết nối tới AI quá lâu, vui lòng thử lại.", "TIMEOUT")
        except exceptions.ResourceExceeded:
            raise GeminiError("Hệ thống AI đang quá tải (Quota exceeded).", "QUOTA_FULL")
        except exceptions.ServiceUnavailable:
            raise GeminiError("Dịch vụ AI đang bảo trì hoặc gặp sự cố mạng.", "NETWORK_ERROR")
        except Exception as e:
            if isinstance(e, GeminiError):
                raise e
            logger.exception("Lỗi không xác định tại GeminiService")
            raise GeminiError(f"Lỗi hệ thống AI: {str(e)}", "INTERNAL_ERROR")

    async def simple_chat(self, prompt: str) -> str:
        """Gọi Gemini cho các phản hồi text thuần túy (không JSON)"""
        try:
            model = genai.GenerativeModel(self.model_name)
            response = await model.generate_content_async(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Lỗi simple_chat: {e}")
            return "Tui xem báo cáo xong rồi nhưng đang hơi bí từ, bạn xem tạm con số nhé!"

# Khởi tạo singleton service (API KEY sẽ được nạp từ env khi chạy)
gemini_service = GeminiService(api_key=os.getenv("GEMINI_API_KEY", ""))
