# Floww — Personal Expense Tracker

> Lab 2 — API & Firebase Studio · Tư Duy Tính Toán · HCMUS

Ứng dụng quản lý chi tiêu cá nhân với đăng nhập Google, lưu dữ liệu Firestore, biểu đồ donut và xác thực token ở phía server.

---

## 🔗 Video Demo

[📺 Xem video demo tại đây](LINK_VIDEO)

---

## 📦 Tech Stack

| Layer    | Công nghệ                        |
| -------- | -------------------------------- |
| Frontend | React 18 + Vite                  |
| Backend  | FastAPI + Uvicorn                |
| Auth     | Firebase Authentication (Google) |
| Database | Cloud Firestore                  |
| Charts   | Recharts                         |

---

## ⚙️ Cài đặt môi trường

### Yêu cầu

- Python 3.10+
- Node.js 18+
- Tài khoản Firebase + Project đã tạo

### Firebase setup

1. Vào [Firebase Console](https://console.firebase.google.com) → tạo project
2. Authentication → Enable Google provider
3. Firestore Database → Create database (test mode)
4. Project Settings → Service accounts → Generate new private key → lưu file JSON

---

## 🖥️ Chạy Backend

```bash
# Clone repo
git clone <REPO_URL>
cd expense-tracker

# Tạo virtual environment
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate

# Cài dependencies
pip install -r requirements.txt

# Cấu hình biến môi trường
cp backend/.env.example backend/.env
# Mở backend/.env và điền GOOGLE_APPLICATION_CREDENTIALS hoặc FIREBASE_CREDENTIALS_JSON

# Chạy server
uvicorn backend.main:app --reload --port 8000
```

Backend sẽ chạy tại: http://localhost:8000  
Docs (Swagger): http://localhost:8000/docs

---

## 🌐 Chạy Frontend

```bash
cd frontend

# Cài dependencies
npm install

# Cấu hình biến môi trường
cp .env.example .env
# Mở .env và điền thông tin Firebase từ Project Settings > General > Your apps

# Chạy dev server
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

---

## 🔌 API Endpoints

| Method | Endpoint            | Mô tả               |
| ------ | ------------------- | ------------------- |
| GET    | `/`                 | Root info           |
| GET    | `/health`           | Health check        |
| GET    | `/auth/me`          | User info từ token  |
| POST   | `/auth/verify`      | Xác thực token      |
| POST   | `/expenses/`        | Tạo giao dịch       |
| GET    | `/expenses/`        | Danh sách giao dịch |
| GET    | `/expenses/summary` | Tổng kết thu/chi    |
| DELETE | `/expenses/{id}`    | Xóa giao dịch       |

---

## 🏗️ Cấu trúc project

```
expense-tracker/
├── frontend/          # React 18 + Vite
├── backend/           # FastAPI
│   ├── routers/
│   ├── schemas/
│   └── services/
├── requirements.txt
├── .gitignore
└── README.md
```
