# 📑 Tài liệu Tham chiếu Kiến trúc Chatbot D-Expense AI

## 1. Sơ đồ Luồng xử lý (Data Flow)

```text
[Người dùng] --- (Tin nhắn) ---> [Frontend React]
                                     |
                                     v
[Backend FastAPI] <--- (Msg + History) --- [API /ai/chat]
      |
      +--- [Firestore] (Lấy Ngân sách & Tổng chi tiêu)
      |
      +--- [Gemini 2.0 Flash] (Gửi Prompt: Persona + Context + Msg)
      |           |
      |           v
      +--- (Nhận JSON: Intent, Data, Persona_Message)
      |
[Frontend React] <--- (JSON Response) --- [Trả về]
      |
      +--- (Hiện Chat Bubble & Confirm Card)
      |
[Người dùng] --- (Bấm "Chốt đơn") ---> [API /expenses/ (POST)]
                                          |
                                          v
                                    [Lưu Firestore]
```

## 2. Danh sách API Endpoints

| Endpoint | Method | Mô tả |
| :--- | :--- | :--- |
| `/ai/chat` | `POST` | Nhận tin nhắn, gọi Gemini và trả về kết quả trích xuất + câu cà khịa. |
| `/expenses/` | `POST` | Lưu giao dịch chính thức sau khi người dùng xác nhận từ chatbot. |
| `/expenses/summary` | `GET` | Lấy bối cảnh chi tiêu để AI biết đường mà "khịa". |

## 3. Schema Bảng Database (Firestore) tối thiểu

### Collection: `expenses` (Giao dịch)
- `user_id`: string (ID chủ sở hữu)
- `amount`: number (Số tiền)
- `type`: string ("income" | "expense")
- `category`: string (Danh mục)
- `description`: string (Ghi chú)
- `date`: string (YYYY-MM-DD)
- `created_at`: timestamp

### Collection: `chat_history` (Lịch sử chat - Tùy chọn lưu lâu dài)
- `user_id`: string
- `messages`: array of {role, content, timestamp}

## 4. Phân định Trách nhiệm (Responsibility Matrix)

### Gemini 2.0 Flash (The Brain)
- **NLP**: Hiểu ngôn ngữ tự nhiên, tiếng lóng Gen Z.
- **Extraction**: Trích xuất số tiền, ngày tháng, danh mục từ câu nói.
- **Persona**: Tạo ra các câu phản hồi "mỏ hỗn" dựa trên bối cảnh tài chính.
- **Intent**: Nhận diện người dùng muốn ghi chép, hỏi tiền hay chỉ đang tâm sự.

### Backend Code (The Guard & Executor)
- **Auth**: Xác thực User, đảm bảo không ai chat hộ ai.
- **Data Enrichment**: Truy vấn số dư thực tế để nhúng vào Prompt cho AI.
- **Validation**: Đảm bảo dữ liệu AI trả về đúng format JSON và hợp lệ trước khi gửi cho Frontend.
- **Persistence**: Thực hiện ghi dữ liệu vào Firestore khi có lệnh xác nhận cuối cùng.
