# BÁO CÁO ĐỒ ÁN LAB 2: API & FIREBASE
**Môn học**: Thực tập Phát triển Phần mềm
**Sinh viên thực hiện**: Nguyễn Đức Duy
**MSSV**: 24120294

---

## 1. Giới thiệu Dự án
Dự án **D-Expense AI** là một ứng dụng quản lý tài chính cá nhân thế hệ mới, kết hợp sức mạnh của điện toán đám mây (Firebase) và Trí tuệ nhân tạo (Gemini AI). Ứng dụng không chỉ dừng lại ở việc ghi chép thủ công mà còn cho phép người dùng tương tác bằng ngôn ngữ tự nhiên để quản lý ví tiền một cách thông minh và thú vị.

## 2. Danh sách chức năng đã thực hiện
Dựa trên yêu cầu của Lab 2, dự án đã hoàn thành các hạng mục sau:

### Kỹ thuật Backend (FastAPI)
- [x] Xây dựng kiến trúc RESTful API tách biệt hoàn toàn với Frontend.
- [x] Cấu hình CORS cho phép giao tiếp an toàn giữa các domain.
- [x] Triển khai các Endpoint bắt buộc: `/` (Root) và `/health` (Kiểm tra trạng thái).
- [x] Tích hợp Middleware xử lý lỗi tập trung.

### Lưu trữ & Bảo mật (Firebase)
- [x] **Firebase Authentication**: Hệ thống đăng nhập bằng Email/Password và Google Sign-In.
- [x] **Cloud Firestore**: Lưu trữ dữ liệu giao dịch dưới dạng NoSQL, hỗ trợ truy vấn theo thời gian thực.
- [x] **Phân quyền dữ liệu**: Đảm bảo mỗi người dùng chỉ có thể truy cập và chỉnh sửa dữ liệu của chính mình thông qua UID.

### Trí tuệ nhân tạo (Gemini 2.5 Flash)
- [x] Tích hợp Model **Gemini 2.5 Flash** mới nhất thông qua Google Generative AI SDK.
- [x] **Prompt Engineering**: Thiết lập tính cách "GenZ" độc đáo cho AI, giúp tăng tính tương tác và trải nghiệm người dùng.
- [x] **Structured Data Extraction**: AI có khả năng bóc tách số tiền, danh mục và nội dung từ câu nói của người dùng để lưu vào cơ sở dữ liệu.

## 3. Kiến trúc hệ thống & Luồng dữ liệu
Ứng dụng được thiết kế theo mô hình 3 lớp:
1.  **Presentation Layer (React)**: Giao diện người dùng sử dụng Context API để quản lý trạng thái toàn cục.
2.  **Logic Layer (FastAPI)**: Xử lý các nghiệp vụ phức tạp, validate dữ liệu và điều phối các dịch vụ bên thứ ba.
3.  **Data Layer (Firebase/Gemini)**: Nơi lưu trữ dữ liệu bền vững và xử lý trí tuệ nhân tạo.

**Luồng dữ liệu đặc biệt (AI Sync)**:
Khi người dùng nhắn tin -> Backend gửi đến Gemini -> Gemini trả về JSON -> Backend lưu vào Firestore -> Frontend nhận tín hiệu và tự động cập nhật biểu đồ (Charts) mà không cần tải lại trang.

## 4. Các công nghệ sử dụng
- **Frontend**: React.js, Vite, Recharts (Biểu đồ), Lucide Icons.
- **Backend**: Python 3.9, FastAPI, Pydantic.
- **Dịch vụ Cloud**: Google Firebase, Google AI Studio.
- **Môi trường**: Quản lý biến môi trường qua `.env` để bảo mật tuyệt đối API Key.

## 5. Kết luận & Hướng phát triển
Dự án đã đáp ứng 100% yêu cầu của đề bài Lab 2 và bổ sung thêm các tính năng nâng cao về trải nghiệm người dùng (UX). 
- **Hướng phát triển**: Tích hợp tính năng xuất báo cáo PDF, dự báo chi tiêu bằng AI dựa trên dữ liệu lịch sử và hỗ trợ đa tiền tệ.

---
*Người thực hiện xác nhận nội dung báo cáo là trung thực và phản ánh đúng mã nguồn đã nộp.*
