import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { sendChatMessage, fetchExpenses, fetchSummary } from "../services/api";

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
    confirm_delete: "Bạn có chắc chắn muốn xóa?",
    expense_distribution: "Phân bổ chi tiêu",
    income_distribution: "Phân bổ thu nhập",
    no_data_chart: "Chưa có dữ liệu giao dịch",
    total_comparison: "So sánh thu nhập & chi tiêu",
    total: "Tổng",
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
    confirm_delete: "Are you sure you want to delete?",
    expense_distribution: "Expense Distribution",
    income_distribution: "Income Distribution",
    no_data_chart: "No transaction data available",
    total_comparison: "Income vs Expense Comparison",
    total: "Total",
  },
};

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [language, setLanguage] = useState(localStorage.getItem("language") || "vi");
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [highlightId, setHighlightId] = useState(null);
  const [month, setMonth] = useState({ m: new Date().getMonth() + 1, y: new Date().getFullYear() });
  const abortControllerRef = useRef(null);

  const [messages, setMessages] = useState([
    { id: "init", role: "model", content: "Chào chủ nhân! Hôm nay bạn đã tiêu gì chưa? Hay muốn tui tính xem còn bao nhiêu tiền để ăn mì tôm?", timestamp: Date.now() }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);
  
  // Custom Modal State
  const [modal, setModal] = useState({ 
    isOpen: false, 
    type: "alert", // 'alert' hoặc 'confirm'
    title: "", 
    message: "", 
    onConfirm: null 
  });

  const showAlert = (title, message) => {
    setModal({ isOpen: true, type: "alert", title, message, onConfirm: null });
  };

  const showConfirm = (title, message, onConfirm) => {
    setModal({ isOpen: true, type: "confirm", title, message, onConfirm });
  };

  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const toggleTheme = useCallback(() => setTheme((prev) => (prev === "dark" ? "light" : "dark")), []);
  const toggleLanguage = useCallback(() => setLanguage((prev) => (prev === "vi" ? "en" : "vi")), []);
  const t = useCallback((key) => translations[language][key] || key, [language]);

  // Dùng Ref để lưu giá trị expenses hiện tại cho việc so sánh highlight mà không gây loop
  const expensesRef = useRef([]);
  useEffect(() => {
    expensesRef.current = expenses;
  }, [expenses]);

  const loadData = useCallback(async (m = month.m, y = month.y) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsDataLoading(true);
    try {
      const [expData, sumData] = await Promise.all([
        fetchExpenses(m, y, { signal: controller.signal }),
        fetchSummary(m, y, { signal: controller.signal })
      ]);
      
      // So sánh với ref thay vì state trực tiếp để tránh dependency loop
      if (expData?.length > 0 && expensesRef.current.length > 0 && expData[0].id !== expensesRef.current[0]?.id) {
        setHighlightId(expData[0].id);
        setTimeout(() => setHighlightId(null), 3000);
      }
      setExpenses(expData || []);
      setSummary(sumData);
    } catch (err) {
      if (err.name !== 'AbortError') console.warn("Sync failed", err);
    } finally {
      setIsDataLoading(false);
    }
  }, [month.m, month.y]); // CHỈ phụ thuộc vào month

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: `u-${Date.now()}`, role: "user", content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsChatLoading(true);
    setMessages(prev => [...prev, { id: "loading", role: "model", content: null, isLoading: true }]);

    try {
      const res = await sendChatMessage(text);
      const modelMsg = { id: `m-${Date.now()}`, role: "model", content: res.reply, intent: res.intent, timestamp: Date.now() };
      setMessages(prev => prev.filter(m => m.id !== "loading").concat(modelMsg));
      if (["ADD_EXPENSE", "ADD_INCOME", "SET_BUDGET"].includes(res.intent)) loadData();
    } catch (error) {
      const errMsg = { id: `err-${Date.now()}`, role: "model", content: error.message, isError: true, timestamp: Date.now() };
      setMessages(prev => prev.filter(m => m.id !== "loading").concat(errMsg));
      setChatError(error.message);
    } finally {
      setIsChatLoading(false);
    }
  }, [loadData]);

  const clearChat = useCallback(() => setMessages(prev => [prev[0]]), []);

  const value = useMemo(() => ({
    theme, toggleTheme, language, toggleLanguage, t,
    expenses, setExpenses, budgets, setBudgets, summary, setSummary,
    isDataLoading, loadData, highlightId, month, setMonth,
    messages, setMessages, isChatLoading, sendMessage, chatError, clearChat,
    modal, showAlert, showConfirm, closeModal
  }), [
    theme, toggleTheme, language, toggleLanguage, t, expenses, budgets, summary,
    isDataLoading, loadData, highlightId, month, messages, isChatLoading, sendMessage, chatError, clearChat,
    modal, showAlert, showConfirm, closeModal
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
// Alias cho tương thích ngược nếu cần
export const useChatContext = () => useContext(AppContext);
export const useTheme = () => useContext(AppContext);
export const useLanguage = () => useContext(AppContext);
export const useExpense = () => useContext(AppContext);
export const useChat = () => useContext(AppContext);
