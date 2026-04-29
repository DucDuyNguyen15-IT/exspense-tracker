import firebase_admin
from firebase_admin import credentials, firestore
import json
import os

# Path to service account key
key_path = "/Users/mac/Documents/TDTT/lab2/expense-tracker/backend/serviceAccountKey.json"

if not firebase_admin._apps:
    cred = credentials.Certificate(key_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()
docs = db.collection("expenses").stream()

print("Transactions in Firestore:")
for i, d in enumerate(docs):
    data = d.to_dict()
    if i == 0:
        print(f"Keys in first doc: {data.keys()}")
    print(f"ID: {d.id}, Date: {data.get('date')}, UserID: {data.get('user_id')}, Amount: {data.get('amount')}, Type: {data.get('type')}")
