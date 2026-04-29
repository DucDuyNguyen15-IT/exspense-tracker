import logging
from fastapi import APIRouter, HTTPException, status, Depends, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, Any

# Import middleware và service
from routers.auth import get_current_user
from services.gemini_service import gemini_service, GeminiParseError, GeminiError
from services.firestore_service import firestore_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["chatbot"])

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)

class ChatResponse(BaseModel):
    reply: str
    intent: str
    data: Optional[Any] = None

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(
    req: ChatRequest, 
    background_tasks: BackgroundTasks,
    user: dict = Depends(get_current_user)
):
    user_id = user["uid"]
    message = req.message

    try:
        # BƯỚC 1: Lấy lịch sử và gọi Gemini lượt 1 để parse ý định (JSON Mode)
        history = await firestore_service.get_conversation_history(user_id, limit=10)
        messages = gemini_service.build_messages(history, message)
        ai_response = await gemini_service.call_gemini(messages)
        
        intent = ai_response.get("intent", "CHITCHAT")
        data = ai_response.get("data")
        final_reply = ai_response.get("reply", "Đã xong!")

        # BƯỚC 2: Xử lý theo Intent
        
        # 2.1. Nhóm lệnh Ghi (Write) -> Chạy Background để giảm Latency
        if intent in ["ADD_EXPENSE", "ADD_INCOME", "SET_BUDGET"]:
            # Giải thích: AI đã trả về câu 'reply' và 'data' đã parse xong.
            # Việc lưu vào DB có thể diễn ra sau khi user nhận được tin nhắn.
            background_tasks.add_task(firestore_service.process_and_save, user_id, ai_response)
        
        # 2.2. Nhóm lệnh Truy vấn (Read) -> Phải Await để lấy data cho AI lượt 2
        elif intent == "QUERY_REPORT":
            # Giải thích: Phải có con số thực tế mới build được câu trả lời chính xác.
            report_data = await firestore_service.process_and_save(user_id, ai_response)
            
            # Gọi Gemini lượt 2 (Simple Mode) để viết văn dựa trên report_data
            second_prompt = f"Dựa vào dữ liệu báo cáo sau, hãy viết một câu trả lời ngắn gọn, thân thiện bằng tiếng Việt: {report_data}"
            final_reply = await gemini_service.simple_chat(second_prompt)

        # BƯỚC 3: Luôn lưu lượt hội thoại vào background
        background_tasks.add_task(firestore_service.save_conversation_turn, user_id, message, final_reply)

        return ChatResponse(
            reply=final_reply,
            intent=intent,
            data=data
        )

    except GeminiParseError:
        raise HTTPException(status_code=422, detail="Tui hông hiểu lắm, nói lại cách khác đi!")
    except Exception as e:
        logger.exception(f"[CHAT] Critical Error: {e}")
        raise HTTPException(status_code=500, detail="Có lỗi xảy ra phía máy chủ.")
