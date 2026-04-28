import { useState, useMemo } from "react";

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

const fmtDate = (s) =>
  new Date(s + "T00:00:00").toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const CATEGORY_COLORS = {
  'Ăn uống':   { bg: '#2F2FA2', light: 'rgba(47,47,162,0.15)',   icon: '🍜' },
  'Di chuyển': { bg: '#553D67', light: 'rgba(85,61,103,0.15)',    icon: '🏍️' },
  'Mua sắm':   { bg: '#F64C72', light: 'rgba(246,76,114,0.15)',  icon: '🛍️' },
  'Hóa đơn':   { bg: '#99738E', light: 'rgba(153,115,142,0.15)', icon: '⚡' },
  'Tiện ích':  { bg: '#99738E', light: 'rgba(153,115,142,0.15)', icon: '⚡' },
  'Giải trí':  { bg: '#242582', light: 'rgba(36,37,130,0.15)',   icon: '🎮' },
  'Sức khỏe':  { bg: '#4ade80', light: 'rgba(74,222,128,0.15)',  icon: '💊' },
  'Y tế':      { bg: '#4ade80', light: 'rgba(74,222,128,0.15)',  icon: '💊' },
  'Học tập':   { bg: '#60a5fa', light: 'rgba(96,165,250,0.15)',  icon: '📚' },
  'Lương':     { bg: '#4ade80', light: 'rgba(74,222,128,0.15)',  icon: '💰' },
  'Thưởng':    { bg: '#fbbf24', light: 'rgba(251,191,36,0.15)',  icon: '🎉' },
  'Đầu tư':    { bg: '#60a5fa', light: 'rgba(96,165,250,0.15)',  icon: '📈' },
  'Bán hàng':  { bg: '#F64C72', light: 'rgba(246,76,114,0.15)',  icon: '🤝' },
  'Khác':      { bg: '#6b7280', light: 'rgba(107,114,128,0.15)', icon: '📦' },
};

export default function ExpenseList({ expenses, loading, onDelete }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  const categories = useMemo(() => {
    return ['Tất cả', ...new Set(expenses.map(t => t.category))];
  }, [expenses]);

  const filtered = useMemo(() => {
    return expenses.filter(t =>
      (activeCategory === 'Tất cả' || t.category === activeCategory) &&
      (t.description || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [expenses, activeCategory, search]);

  if (loading) {
    return (
      <div className="summary-card" data-reveal>
        <div className="txn-list">
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', alignItems: 'center' }}>
              <div className="skeleton sk-avatar" style={{ borderRadius: 10 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton sk-text" style={{ width: '60%' }} />
                <div className="skeleton sk-text" style={{ width: '35%', height: 11 }} />
              </div>
              <div className="skeleton sk-text" style={{ width: 80 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="summary-card" data-reveal>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "var(--space-4)" }}>
        <h3 style={{ fontWeight: 700, fontSize: "1.125rem", fontFamily: "var(--font-display)", margin: 0 }}>
          Lịch sử giao dịch
          <span
            style={{
              marginLeft: "var(--space-2)",
              background: "var(--surface2)",
              color: "var(--dim)",
              fontSize: "0.75rem",
              padding: "2px 8px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border)"
            }}
          >
            {filtered.length}
          </span>
        </h3>
      </div>

      {/* Search bar */}
      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          placeholder="Tìm giao dịch..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filter pills */}
      <div className="filter-pills">
        {categories.map(cat => (
          <button
            key={cat}
            className={`pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <p>Không tìm thấy giao dịch nào.</p>
        </div>
      ) : (
        <div className="txn-list">
          {filtered.map((e, i) => {
            const ui = CATEGORY_COLORS[e.category] || CATEGORY_COLORS['Khác'];
            return (
              <div key={e.id} className="txn-item" style={{ animationDelay: `${i * 0.04}s`, animation: 'slideUp 0.4s forwards' }}>
                <div className="txn-icon" style={{ background: ui.light, color: ui.bg }}>
                  {ui.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="txn-name">{e.description || e.category}</div>
                  <div className="txn-meta">{e.category} • {fmtDate(e.date)}</div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div className={`txn-amount txn-amount--${e.type}`}>
                    {e.type === "income" ? "+" : "-"}{fmt(e.amount)}
                  </div>
                  <button className="txn-delete-btn" onClick={() => {
                    if (window.confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) {
                      onDelete(e.id);
                    }
                  }} title="Xóa">
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
