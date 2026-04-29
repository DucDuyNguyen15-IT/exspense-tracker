import asyncio
import logging
from datetime import datetime
from typing import List, Dict, Any, Union, Optional
from firebase_admin import firestore

# Sửa lại import chuẩn xác theo cấu trúc thư mục
from services.firebase_service import get_db
from services.date_parser import parse_date, DateParseError

logger = logging.getLogger(__name__)

class FirestoreService:
    def __init__(self):
        try:
            self.db = get_db()
        except Exception as e:
            logger.error(f"Lỗi khởi tạo Firestore: {e}")
            self.db = None

    async def process_and_save(self, user_id: str, gemini_response: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Hàm điều phối chính dựa trên intent từ Gemini."""
        intent = gemini_response.get("intent")
        data = gemini_response.get("data")
        
        if not intent or not data:
            return None

        try:
            if intent in ["ADD_EXPENSE", "ADD_INCOME"]:
                return await self._handle_transactions(user_id, intent, data)
            
            elif intent == "SET_BUDGET":
                return await self._handle_budget(user_id, data)
            
            elif intent == "QUERY_REPORT":
                return await self.get_report(user_id)
            
            return None
        except Exception as e:
            logger.error(f"Lỗi trong process_and_save: {e}")
            raise

    async def _handle_transactions(self, user_id: str, intent: str, data: Union[Dict, List]) -> Dict[str, Any]:
        """Xử lý ghi giao dịch và cập nhật tổng hợp tháng dùng Batch."""
        items = data if isinstance(data, list) else [data]
        
        def sync_save():
            batch = self.db.batch()
            total_amount = 0
            saved_count = 0
            
            for item in items:
                amount = item.get("amount")
                if not amount or amount <= 0: continue
                
                try:
                    dt = parse_date(item.get("date", "today"))
                except DateParseError:
                    dt = datetime.now()
                
                month_key = dt.strftime("%Y-%m")
                category = item.get("category", "other")
                
                # 1. Tạo Transaction Doc
                trans_ref = self.db.collection("users").document(user_id).collection("transactions").document()
                batch.set(trans_ref, {
                    "amount": amount,
                    "category": category,
                    "note": item.get("note", ""),
                    "date": dt.strftime("%Y-%m-%d"),
                    "type": "income" if intent == "ADD_INCOME" else "expense",
                    "created_at": firestore.SERVER_TIMESTAMP
                })

                # 2. Increment Monthly Summary
                summary_ref = self.db.collection("users").document(user_id).collection("monthly_summary").document(month_key)
                field_to_inc = "total_income" if intent == "ADD_INCOME" else "total_expense"
                batch.set(summary_ref, {
                    field_to_inc: firestore.Increment(amount),
                    f"categories.{category}": firestore.Increment(amount)
                }, merge=True)
                
                total_amount += amount
                saved_count += 1

            if saved_count > 0:
                batch.commit()
            return {"saved": saved_count, "total_amount": total_amount}

        return await asyncio.to_thread(sync_save)

    async def _handle_budget(self, user_id: str, data: Dict) -> Dict[str, Any]:
        """Thiết lập ngân sách."""
        amount = data.get("amount", 0)
        category = data.get("category", "other")
        if amount <= 0: return {"error": "Invalid amount"}

        def sync_upsert():
            month_key = datetime.now().strftime("%Y-%m")
            budget_id = f"{category}_{month_key}"
            budget_ref = self.db.collection("users").document(user_id).collection("budgets").document(budget_id)
            
            old_doc = budget_ref.get()
            previous = old_doc.to_dict().get("amount") if old_doc.exists else None
            
            budget_ref.set({
                "category": category,
                "amount": amount,
                "month": month_key,
                "updated_at": firestore.SERVER_TIMESTAMP
            }, merge=True)
            
            return {"category": category, "amount": amount, "previous": previous}

        return await asyncio.to_thread(sync_upsert)

    async def get_report(self, user_id: str) -> Dict[str, Any]:
        """Lấy dữ liệu báo cáo."""
        def sync_report():
            month_key = datetime.now().strftime("%Y-%m")
            summary_doc = self.db.collection("users").document(user_id).collection("monthly_summary").document(month_key).get()
            budgets_query = self.db.collection("users").document(user_id).collection("budgets").where("month", "==", month_key).stream()
            
            summary = summary_doc.to_dict() if summary_doc.exists else {}
            spent_map = summary.get("categories", {})
            
            budget_comparison = {}
            for b in budgets_query:
                b_data = b.to_dict()
                cat = b_data.get("category")
                budget_val = b_data.get("amount", 0)
                budget_comparison[cat] = {
                    "budget": budget_val,
                    "spent": spent_map.get(cat, 0)
                }

            return {
                "period": "tháng này",
                "total_expense": summary.get("total_expense", 0),
                "total_income": summary.get("total_income", 0),
                "balance": summary.get("total_income", 0) - summary.get("total_expense", 0),
                "by_category": spent_map,
                "budget_comparison": budget_comparison
            }

        return await asyncio.to_thread(sync_report)

    async def save_conversation_turn(self, user_id: str, user_msg: str, model_reply: str) -> None:
        """Lưu lượt hội thoại vào background."""
        def sync_save():
            conv_ref = self.db.collection("users").document(user_id).collection("conversations")
            batch = self.db.batch()
            batch.set(conv_ref.document(), {"role": "user", "content": user_msg, "created_at": firestore.SERVER_TIMESTAMP})
            batch.set(conv_ref.document(), {"role": "model", "content": model_reply, "created_at": firestore.SERVER_TIMESTAMP})
            batch.commit()
        await asyncio.to_thread(sync_save)

    async def get_conversation_history(self, user_id: str, limit: int = 20) -> List[Dict]:
        """Lấy lịch sử hội thoại."""
        def sync_get():
            docs = self.db.collection("users").document(user_id).collection("conversations") \
                          .order_by("created_at", direction=firestore.Query.DESCENDING).limit(limit).stream()
            return [{"role": d.to_dict()["role"], "content": d.to_dict()["content"]} for d in docs][::-1]
        return await asyncio.to_thread(sync_get)

firestore_service = FirestoreService()
