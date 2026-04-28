import { useState, useEffect, useCallback, useRef } from "react";
import { logout } from "../firebase";
import {
  fetchExpenses,
  fetchSummary,
  createExpense,
  deleteExpense,
} from "../services/api";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import SummaryStats from "../components/SummaryStats";

export default function Dashboard({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Toast state: { msg, type }
  const [toast, setToast] = useState(null);
  
  // Month selector state
  const currentDate = new Date();
  const [month, setMonth] = useState({ m: currentDate.getMonth() + 1, y: currentDate.getFullYear() });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => {
      // Small delay to allow CSS animation to finish before removing from DOM
      // (Simplified approach, in real app might need animationend event)
      setToast(null);
    }, 3000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [exp, sum] = await Promise.all([fetchExpenses(), fetchSummary()]);
      setExpenses(exp);
      setSummary(sum);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Scroll reveal - Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((el) => {
        if (el.isIntersecting) {
          el.target.classList.add('visible');
          observer.unobserve(el.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    const elements = document.querySelectorAll('[data-reveal]');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [loading, expenses]); // re-run observer when data changes

  const handleCreate = async (data) => {
    try {
      await createExpense(data);
      showToast("Đã thêm giao dịch thành công!", "success");
      await loadData();
    } catch (e) {
      showToast("Lỗi khi thêm giao dịch: " + e.message, "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      showToast("Đã xóa giao dịch!", "success");
      await loadData();
    } catch (e) {
      showToast("Lỗi khi xóa giao dịch: " + e.message, "error");
    }
  };

  // Month navigation
  const prevMonth = () => setMonth(prev => prev.m === 1 ? { m: 12, y: prev.y - 1 } : { m: prev.m - 1, y: prev.y });
  const nextMonth = () => setMonth(prev => prev.m === 12 ? { m: 1, y: prev.y + 1 } : { m: prev.m + 1, y: prev.y });

  // Filter expenses by selected month
  // Note: currently doing this on the frontend as the API doesn't support query params yet
  const filteredExpenses = expenses.filter(e => {
    if (!e.date) return false;
    const dateObj = new Date(e.date);
    return (dateObj.getMonth() + 1) === month.m && dateObj.getFullYear() === month.y;
  });

  return (
    <div className="app-shell" data-reveal>
      <div className="main-area">
        <header className="topbar">
          <div className="logo">D-Expense</div>
          
          {/* Month selector ở giữa */}
          <div className="month-selector">
            <button className="month-btn" onClick={prevMonth}>‹</button>
            <span className="month-label">
              Tháng {month.m}/{month.y}
            </span>
            <button className="month-btn" onClick={nextMonth}>›</button>
          </div>

          <div className="user-area">
            {user.photoURL && (
              <img src={user.photoURL} className="avatar" alt={user.displayName || "Avatar"} />
            )}
            <span className="username">{user.displayName || user.email}</span>
            <button className="btn-secondary" onClick={logout} style={{ padding: "6px 12px", fontSize: "12px", border: "none" }}>
              Đăng xuất
            </button>
          </div>
        </header>

        <main className="content">
          <SummaryStats summary={summary} loading={loading} currentMonth={month} expenses={filteredExpenses} />

          <div className="dashboard-grid">
            <ExpenseList
              expenses={filteredExpenses}
              loading={loading}
              onDelete={handleDelete}
            />
            <ExpenseForm onSubmit={handleCreate} />
          </div>
        </main>
      </div>

      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <span className="toast-icon">
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : '⚠'}
            </span>
            <span className="toast-msg">{toast.msg}</span>
            <button className="toast-close" onClick={() => setToast(null)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}
