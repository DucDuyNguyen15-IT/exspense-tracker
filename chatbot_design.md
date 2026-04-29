# 🤖 Tài liệu Thiết kế Chatbot Quản lý Chi tiêu (D-Expense AI)

## 1. Tổng quan dự án (Purpose)
Chatbot AI được tích hợp trực tiếp vào ứng dụng D-Expense để giúp người dùng ghi chép giao dịch, truy vấn thống kê và quản lý ngân sách thông qua ngôn ngữ tự nhiên, thay thế việc nhập liệu thủ công khô khan.

## 2. Nhân vật & Phong cách (Persona)
- **Tên:** D-Assistant (Gen Z Version).
- **Phong cách:** Một người bạn Gen Z "mỏ hỗn sương sương", hài hước và đồng cảm.
- **Quy tắc cà khịa:** 
  - Chỉ cà khịa khi người dùng tiêu quá 80% ngân sách hoặc chi tiêu vào danh mục không thiết yếu.
  - Sử dụng slang Gen Z (ét ô ét, chằm Zn, sà lơ, bái phục...).
  - Luôn kết thúc bằng một lời động viên hoặc giải pháp để không gây khó chịu.

## 3. Kiến trúc kỹ thuật (Technical Approach)
**Backend AI Agent (Phương án 2):**
- **Backend (FastAPI):** Làm trung tâm điều phối. Nhận tin nhắn -> Truy vấn ngân sách thực tế -> Gửi kèm Context cho Gemini -> Trả về JSON cho Frontend.
- **Frontend (React):** Hiển thị tin nhắn và render "Confirm Card" để người dùng xác nhận dữ liệu trước khi lưu.
- **AI Core:** Gemini Flash API (nhanh, rẻ, hiệu quả).

## 4. Các Intent chính & Luồng xử lý
1. **RecordTransaction:** Trích xuất Amount, Category, Date, Description.
2. **QueryStats:** Chuyển đổi "tuần này", "tháng trước" thành range ngày để truy vấn.
3. **SetBudget:** Thiết lập hạn mức chi tiêu.
4. **Correction:** Xử lý việc sửa đổi thông tin ngay trong cuộc hội thoại.

## 5. Cấu trúc dữ liệu AI phản hồi (JSON)
AI luôn trả về định dạng chuẩn để Backend/Frontend xử lý:
```json
{
  "intent": "RECORD_EXPENSE",
  "data": { "amount": 50000, "category": "Ăn uống", "date": "2026-04-29" },
  "persona_message": "Lại trà sữa? Ví sắp phát tín hiệu cầu cứu (ét ô ét) rồi đó chủ nhân ơi!",
  "needs_confirmation": true
}
```

## 6. Nhật ký quyết định (Decision Log)
- **Nền tảng:** Web UI (Để tận dụng Auth và Rich UI).
- **Cơ chế:** Xác nhận trước khi thực hiện (An toàn dữ liệu).
- **Context:** Backend nạp dữ liệu ngân sách thực tế vào Prompt để AI cà khịa "đúng trọng tâm".
- **Multi-turn:** Giữ lịch sử 3-5 tin nhắn gần nhất.
