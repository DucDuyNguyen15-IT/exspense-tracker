from typing import Optional
from datetime import datetime, timezone
from services.firebase_service import get_db
from schemas.expense import ExpenseCreate, ExpenseResponse


COLLECTION = "expenses"


def _doc_to_response(doc_id: str, data: dict) -> ExpenseResponse:
    return ExpenseResponse(
        id=doc_id,
        amount=data["amount"],
        category=data["category"],
        description=data["description"],
        type=data["type"],
        date=data["date"],
        user_id=data["user_id"],
        created_at=data["created_at"],
    )


def create_expense(uid: str, payload: ExpenseCreate) -> ExpenseResponse:
    db = get_db()
    doc_data = {
        **payload.model_dump(),
        "user_id": uid,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    _, doc_ref = db.collection(COLLECTION).add(doc_data)
    return _doc_to_response(doc_ref.id, doc_data)


def get_expenses(uid: str, month: Optional[int] = None, year: Optional[int] = None) -> list[ExpenseResponse]:
    print(f"DEBUG: Starting get_expenses for UID: {uid}")
    db = get_db()
    # Simplified query syntax for maximum compatibility
    docs = db.collection(COLLECTION).where("user_id", "==", uid).stream()
    
    expenses = []
    try:
        for d in docs:
            expenses.append(_doc_to_response(d.id, d.to_dict()))
    except Exception as e:
        print(f"DEBUG: Error streaming docs: {e}")
        raise e
        
    print(f"DEBUG: Found {len(expenses)} total expenses")
    
    if month and year:
        prefix = f"{year}-{month:02d}"
        expenses = [e for e in expenses if e.date.startswith(prefix)]
        print(f"DEBUG: Filtered by {prefix}. Remaining: {len(expenses)}")
    
    expenses.sort(key=lambda x: x.date, reverse=True)
    return expenses


def delete_expense(uid: str, expense_id: str) -> bool:
    db = get_db()
    doc_ref = db.collection(COLLECTION).document(expense_id)
    doc = doc_ref.get()
    if not doc.exists:
        return False
    if doc.to_dict().get("user_id") != uid:
        raise PermissionError("Not your expense")
    doc_ref.delete()
    return True


def get_summary(uid: str, month: Optional[int] = None, year: Optional[int] = None) -> dict:
    expenses = get_expenses(uid, month=month, year=year)
    total_income = sum(e.amount for e in expenses if e.type == "income")
    total_expense = sum(e.amount for e in expenses if e.type == "expense")

    # Category breakdown (expense only)
    categories: dict[str, float] = {}
    for e in expenses:
        if e.type == "expense":
            categories[e.category] = categories.get(e.category, 0) + e.amount

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": total_income - total_expense,
        "expense_by_category": categories,
        "transaction_count": len(expenses),
    }
