from fastapi import APIRouter, Depends, HTTPException, Header
from services.firebase_service import verify_token

router = APIRouter(prefix="/auth", tags=["auth"])


def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = authorization[7:]
    try:
        return verify_token(token)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.get("/me")
def me(user: dict = Depends(get_current_user)):
    return {
        "uid": user["uid"],
        "email": user.get("email"),
        "name": user.get("name"),
        "picture": user.get("picture"),
    }


@router.post("/verify")
def verify(user: dict = Depends(get_current_user)):
    return {
        "valid": True,
        "uid": user["uid"],
        "email": user.get("email"),
    }
