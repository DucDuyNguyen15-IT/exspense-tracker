import os
import json
import firebase_admin
from firebase_admin import credentials, auth, firestore
from dotenv import load_dotenv

load_dotenv()

_app = None

def get_firebase_app():
    global _app
    if _app is not None:
        return _app

    cred_json = os.getenv("FIREBASE_CREDENTIALS_JSON")
    cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

    if cred_json:
        cred_dict = json.loads(cred_json)
        cred = credentials.Certificate(cred_dict)
    elif cred_path:
        cred = credentials.Certificate(cred_path)
    else:
        raise RuntimeError(
            "Set FIREBASE_CREDENTIALS_JSON or GOOGLE_APPLICATION_CREDENTIALS"
        )

    _app = firebase_admin.initialize_app(cred)
    return _app


def get_db():
    get_firebase_app()
    return firestore.client()


def verify_token(token: str) -> dict:
    """Verify a Firebase ID token and return the decoded payload."""
    get_firebase_app()
    try:
        decoded = auth.verify_id_token(token)
        return decoded
    except Exception as e:
        raise ValueError(f"Invalid token: {e}")
