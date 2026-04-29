import os
import json
import google.generativeai as genai
from typing import List, Dict, Any, Optional
from datetime import datetime

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

SYSTEM_PROMPT = """
Bạn là một trợ lý tài chính Gen Z "mỏ hỗn sương sương" tên là D-Assistant.
Nhiệm vụ của bạn là trích xuất thông tin chi tiêu từ tin nhắn của người dùng và phản hồi bằng phong cách Gen Z.

QUY TẮC CÀ KHỊA:
1. Nếu người dùng tiêu tiền vào đồ ăn nhanh, trà sữa, hoặc vượt ngân sách, hãy cà khịa nhẹ nhàng (ví dụ: "Lại trà sữa? Ví đang ét ô ét kìa!").
2. Sử dụng slang Gen Z: chằm Zn, sà lơ, bái phục, hết cứu, sương sương, ét ô ét...
3. Luôn giữ thái độ đồng cảm ở cuối câu: "Thôi ghi nhận nhé, mai ăn mì tôm bù lại."

QUY TẮC TRÍCH XUẤT (JSON):
Bạn PHẢI trả về duy nhất một đối tượng JSON với cấu trúc sau:
{
  "intent": "RECORD_EXPENSE" | "QUERY_STATS" | "SET_BUDGET" | "TALK",
  "data": {
    "amount": float,
    "category": string,
    "description": string,
    "date": "YYYY-MM-DD",
    "type": "expense" | "income"
  },
  "persona_message": "Câu cà khịa của bạn ở đây",
  "needs_confirmation": boolean
}

BỐI CẢNH HIỆN TẠI:
- Ngày hôm nay: {today}
- Ngân sách còn lại: {budget_info}
"""

class AIService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    async def get_response(self, user_message: str, history: List[Dict[str, str]], budget_context: str = "Chưa thiết lập") -> Dict[str, Any]:
        today = datetime.now().strftime("%Y-%m-%d")
        
        prompt = SYSTEM_PROMPT.format(today=today, budget_info=budget_context)
        
        # Build chat session
        chat = self.model.start_chat(history=[
            {"role": "user" if m["role"] == "user" else "model", "parts": [m["content"]]} 
            for m in history
        ])
        
        response = await chat.send_message_async(user_message)
        
        try:
            # Extract JSON from response
            text = response.text
            # Simple JSON extractor if AI adds markdown blocks
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            
            return json.loads(text)
        except Exception as e:
            print(f"Error parsing Gemini response: {e}")
            return {
                "intent": "TALK",
                "data": None,
                "persona_message": "Tui hơi chóng mặt xíu, ông chủ nói lại rõ hơn được không? (Lỗi xử lý JSON)",
                "needs_confirmation": False
            }

ai_service = AIService()
