from fastapi import APIRouter, Depends, HTTPException
from routers.auth import get_current_user
from schemas.expense import ExpenseCreate, ExpenseResponse
from services import expense_service

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.post("/", response_model=ExpenseResponse, status_code=201)
def create(payload: ExpenseCreate, user: dict = Depends(get_current_user)):
    return expense_service.create_expense(user["uid"], payload)


@router.get("/summary")
def summary(user: dict = Depends(get_current_user)):
    return expense_service.get_summary(user["uid"])


@router.get("/", response_model=list[ExpenseResponse])
def list_expenses(user: dict = Depends(get_current_user)):
    return expense_service.get_expenses(user["uid"])


@router.delete("/{expense_id}", status_code=204)
def delete(expense_id: str, user: dict = Depends(get_current_user)):
    try:
        found = expense_service.delete_expense(user["uid"], expense_id)
    except PermissionError:
        raise HTTPException(status_code=403, detail="Forbidden")
    if not found:
        raise HTTPException(status_code=404, detail="Not found")
