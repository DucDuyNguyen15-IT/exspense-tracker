from pydantic import BaseModel, Field
from typing import Literal, Optional


class ExpenseCreate(BaseModel):
    amount: float = Field(..., gt=0, description="Must be positive")
    category: str = Field(..., min_length=1)
    description: str = ""
    type: Literal["income", "expense"]
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")


class ExpenseResponse(BaseModel):
    id: str
    amount: float
    category: str
    description: str
    type: str
    date: str
    user_id: str
    created_at: str
