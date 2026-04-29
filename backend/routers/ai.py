from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from routers.auth import get_current_user
from services.ai_service import ai_service
from services import expense_service

router = APIRouter(prefix="/ai", tags=["ai"])

class ChatMessage(BaseModel):
    content: str
    role: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage]

@router.post("/chat")
async def chat(req: ChatRequest, user: dict = Depends(get_current_user)):
    # 1. Get context (budget/summary)
    summary = expense_service.get_summary(user["uid"])
    budget_context = f"Tháng này tiêu {summary['total_expense']:,}đ, thu {summary['total_income']:,}đ."
    
    # 2. Call Gemini
    history_dicts = [{"role": m.role, "content": m.content} for m in req.history]
    response = await ai_service.get_response(req.message, history_dicts, budget_context)
    
    return response
