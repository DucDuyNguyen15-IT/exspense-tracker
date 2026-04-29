# D-Expense AI: Intelligent Personal Finance Tracker

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Database-Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-4285F4?style=flat-square&logo=google-gemini&logoColor=white)](https://aistudio.google.com/)

**D-Expense AI** is a sophisticated personal finance management system integrated with advanced Artificial Intelligence. Built as part of **Lab 2: API & Firebase**, this project demonstrates a seamless integration between a modern web frontend, a high-performance Python backend, and Google's cutting-edge LLM technology.

---

## 🏛️ System Architecture

The application follows a **Decoupled Client-Server Architecture**, ensuring scalability and clear separation of concerns.

```mermaid
graph TD
    User((User)) -->|Interacts| FE[React Frontend]
    FE -->|API Requests| BE[FastAPI Backend]
    
    subgraph "Cloud Services"
        BE -->|Authenticate| Auth[Firebase Auth]
        BE -->|CRUD Operations| DB[(Cloud Firestore)]
        BE -->|Natural Language| AI[Gemini 2.5 Flash]
    end
    
    FE -->|Direct Sync| DB
```

---

## ✨ Key Features

### 1. 🤖 Intelligent AI Assistant
- **Engine**: Powered by **Gemini 2.5 Flash**.
- **Capabilities**: Automatically parses natural language (e.g., "Lunch 50k") into structured financial data.
- **Personality**: Features a unique, witty "GenZ" persona that provides humorous financial advice and "sarcastic" reminders.

### 2. 📊 Smart Financial Dashboard
- **Real-time Sync**: AI-processed transactions reflect immediately on the dashboard.
- **Monthly Management**: Robust filtering by Month/Year to track spending habits over time.
- **Data Visualization**: Interactive charts for categorical expense distribution.

### 3. 🔒 Secure Authentication
- **Provider**: Firebase Authentication.
- **Security**: Stateless session management with secure backend validation.

### 4. 🎨 Premium UI/UX
- **Theme**: High-contrast Dark Mode with Glassmorphism effects.
- **Interactions**: Custom branded modals and smooth micro-animations.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Context API, Vanilla CSS |
| **Backend** | Python 3.9+, FastAPI, Pydantic, Uvicorn |
| **Database** | Google Cloud Firestore (NoSQL) |
| **Authentication** | Firebase Auth (Google & Email/Password) |
| **Artificial Intelligence** | Google Generative AI (Gemini 2.5 Flash) |

---

## 📂 Project Structure

```text
expense-tracker/
├── backend/                # FastAPI Application
│   ├── routers/            # API Endpoints (Auth, Expenses, Chat)
│   ├── services/           # Business Logic (Firestore, Gemini)
│   ├── schemas/            # Pydantic Data Models
│   ├── main.py             # Entry Point & Health Checks
│   └── .env                # Environment Variables (Secrets)
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # UI Components (Custom Modal, Charts)
│   │   ├── context/        # State Management (AppContext)
│   │   ├── services/       # API Integration (Axios/AuthFetch)
│   │   └── pages/          # Dashboard & Authentication Pages
│   └── .env                # Frontend Config
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- Firebase Project & Google AI Studio Key

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
# Create .env with GEMINI_API_KEY and GOOGLE_APPLICATION_CREDENTIALS
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Create .env with Firebase Config
npm run dev
```

---

## 📡 API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root health check & API info |
| `GET` | `/health` | Server status check |
| `POST` | `/chat/` | Send message to AI Assistant |
| `GET` | `/expenses/` | List transactions with Month/Year filter |
| `POST` | `/expenses/` | Create new manual transaction |
| `GET` | `/expenses/summary` | Get financial report summary |

---

## 📋 Lab 2 Requirements Compliance

| Requirement | Status | Implementation |
| :--- | :--- | :--- |
| Separate FE & BE | ✅ Done | React & FastAPI running on different ports/origins |
| FastAPI Framework | ✅ Done | Core backend engine |
| Health Checks (`/`, `/health`) | ✅ Done | Implemented in `main.py` |
| Firebase Integration | ✅ Done | Firestore for data, Auth for security |
| AI Integration | ✅ Done | Gemini 2.5 Flash for smart data entry |
| GitHub Repository | ✅ Done | Properly initialized with `.gitignore` |

---

## 👨‍💻 Author
**Nguyễn Đức Duy** - Student ID: 24120294
*University of Science - VNUHCM*
