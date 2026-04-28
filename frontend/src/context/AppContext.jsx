import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const translations = {
  vi: {
    login_title: "Đăng nhập",
    register_title: "Tạo tài khoản",
    welcome_title: "Chào bạn mới!",
    welcome_desc: "Nhập thông tin cá nhân và bắt đầu hành trình tiết kiệm cùng chúng tôi",
    back_title: "Mừng bạn trở lại!",
    back_desc: "Để giữ kết nối vui lòng đăng nhập với thông tin cá nhân của bạn",
    google_login: "Tiếp tục với Google",
    email: "Tên đăng nhập",
    password: "Mật khẩu",
    confirm_password: "Nhập lại mật khẩu",
    display_name: "Tên hiển thị",
    or: "Hoặc sử dụng tài khoản của bạn",
    sign_in_btn: "Đăng nhập",
    sign_up_btn: "Đăng ký",
    not_supported: "Tính năng này chưa được hỗ trợ!",
    income: "Thu nhập",
    expense: "Chi tiêu",
    balance: "Số dư",
    budget: "Ngân sách",
    history: "Lịch sử",
    add_transaction: "Thêm giao dịch",
    save: "Lưu",
    logout: "Đăng xuất",
    month: "Tháng",
    category: "Danh mục",
    description: "Ghi chú",
    amount: "Số tiền",
    no_transactions: "Chưa có giao dịch",
    savings_plan: "Kế hoạch tích lũy",
    savings_goals: "Mục tiêu",
    trend: "Xu hướng",
    confirm_delete: "Bạn có chắc chắn muốn xóa?"
  },
  en: {
    login_title: "Sign In",
    register_title: "Create Account",
    welcome_title: "Hello, Welcome!",
    welcome_desc: "Enter your personal details and start journey with us",
    back_title: "Welcome Back!",
    back_desc: "To keep connected with us please login with your personal info",
    google_login: "Continue with Google",
    email: "Username",
    password: "Password",
    confirm_password: "Confirm Password",
    display_name: "Display Name",
    or: "or use your account",
    sign_in_btn: "Sign In",
    sign_up_btn: "Sign Up",
    not_supported: "This feature is not supported yet!",
    income: "Income",
    expense: "Expense",
    balance: "Balance",
    budget: "Budget",
    history: "History",
    add_transaction: "Add Transaction",
    save: "Save",
    logout: "Logout",
    month: "Month",
    category: "Category",
    description: "Description",
    amount: "Amount",
    no_transactions: "No transactions",
    savings_plan: "Savings Plan",
    savings_goals: "Goals",
    trend: "Trend",
    confirm_delete: "Are you sure you want to delete?"
  }
};

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'vi');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleLanguage = () => setLanguage(prev => prev === 'vi' ? 'en' : 'vi');

  const t = (key) => translations[language][key] || key;

  return (
    <AppContext.Provider value={{ theme, toggleTheme, language, toggleLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
