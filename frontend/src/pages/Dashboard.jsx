import React, { useState, useEffect, useCallback } from "react";
import { logout } from "../firebase";
import { fetchExpenses, fetchSummary, createExpense, deleteExpense } from "../services/api";
import { useAppContext } from "../context/AppContext";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import SummaryStats from "../components/SummaryStats";

export default function Dashboard({ user }) {
  const { theme, toggleTheme, language, toggleLanguage, t } = useAppContext();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState({ m: new Date().getMonth() + 1, y: new Date().getFullYear() });

  const loadData = useCallback(async () => {
    try {
      const exp = await fetchExpenses(month.m, month.y);
      setExpenses(exp || []);
    } catch (e) {
      console.error("Dashboard Load Error:", e);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [loadData]);

  const handleCreate = async (data) => {
    try {
      await createExpense(data);
      loadData();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirm_delete'))) return;
    try {
      await deleteExpense(id);
      loadData();
    } catch (e) {
      alert(e.message);
    }
  };

  const prevMonth = () => setMonth(prev => prev.m === 1 ? { m: 12, y: prev.y - 1 } : { m: prev.m - 1, y: prev.y });
  const nextMonth = () => setMonth(prev => prev.m === 12 ? { m: 1, y: prev.y + 1 } : { m: prev.m + 1, y: prev.y });

  return (
    <div className="app-shell" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="main-area">
        <header className="topbar">
          <div className="logo" style={{ background: 'linear-gradient(to right, #6366f1, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800, fontSize: '1.6rem' }}>D-Expense</div>
          
          <div className="month-selector">
            <button className="month-btn" onClick={prevMonth}>‹</button>
            <span className="month-label" style={{ fontWeight: 700 }}>{t('month')} {month.m}/{month.y}</span>
            <button className="month-btn" onClick={nextMonth}>›</button>
          </div>

          <div className="user-area" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {/* Toggles Group */}
            <div style={{ display: 'flex', gap: '0.8rem', paddingRight: '1.5rem', borderRight: '1px solid var(--border)' }}>
              <div className={`switch-track ${theme === 'light' ? 'active' : ''}`} onClick={toggleTheme} style={{ transform: 'scale(0.9)' }}>
                <span className="switch-icon left">🌙</span>
                <span className="switch-icon right">☀️</span>
                <div className="switch-thumb"></div>
              </div>
              <div className={`switch-track ${language === 'en' ? 'active' : ''}`} onClick={toggleLanguage} style={{ transform: 'scale(0.9)' }}>
                <span className="switch-icon left">VI</span>
                <span className="switch-icon right">EN</span>
                <div className="switch-thumb"></div>
              </div>
            </div>

            {/* Profile Card */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>{user?.displayName || 'User'}</div>
                <button onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--coral)', fontSize: '11px', cursor: 'pointer', fontWeight: 600, padding: 0 }}>{t('logout')}</button>
              </div>
              {user && user.photoURL ? (
                <img src={user.photoURL} alt="User" style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid var(--indigo)', padding: '2px' }} />
              ) : (
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--surface2)', display: 'grid', placeItems: 'center', fontSize: '1.2rem', border: '2px solid var(--border)' }}>👤</div>
              )}
            </div>
          </div>
        </header>

        <main className="content">
          <SummaryStats expenses={expenses} loading={loading} />
          
          <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '2.5rem', marginTop: '1.5rem' }}>
            
            {/* Column 1: Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <ExpenseForm onSubmit={handleCreate} />
              
              <div className="stat-card" style={{ borderLeft: '4px solid var(--indigo)' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--indigo)', display: 'flex', alignItems: 'center', gap: '8px' }}>💡 {language === 'vi' ? 'Mẹo chi tiêu' : 'Spending Tip'}</h4>
                <p style={{ fontSize: '13px', color: 'var(--dim)', lineHeight: '1.6' }}>
                  {language === 'vi' 
                    ? 'Hãy luôn ghi lại các khoản chi tiêu nhỏ nhất để có cái nhìn tổng quan nhất về tài chính của bạn.' 
                    : 'Always record even the smallest expenses to get the most comprehensive view of your finances.'}
                </p>
              </div>
            </div>

            {/* Column 2: History & Trends */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div className="stat-card">
                <h3 style={{ marginBottom: '1.5rem' }}>📊 {t('trend')}</h3>
                <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface2)', borderRadius: '24px', color: 'var(--dim)', fontSize: '14px', border: '1px dashed var(--border)' }}>
                   {language === 'vi' ? 'Biểu đồ đang được chuẩn bị...' : 'Trend chart coming soon...'}
                </div>
              </div>
              
              <ExpenseList expenses={expenses} loading={loading} onDelete={handleDelete} />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
