import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";

const fmt = (n) => {
  try {
    return new Intl.NumberFormat("vi-VN").format(n || 0) + " ₫";
  } catch (e) {
    return (n || 0) + " ₫";
  }
};

export default function SummaryStats({ expenses = [], loading }) {
  const { t } = useAppContext();

  const { inc, exp, bal } = useMemo(() => {
    let i = 0, e = 0;
    if (Array.isArray(expenses)) {
      expenses.forEach(x => {
        const a = Number(x.amount) || 0;
        if (x.type === 'income') i += a;
        else e += a;
      });
    }
    return { inc: i, exp: e, bal: i - e };
  }, [expenses]);

  if (loading && (!expenses || expenses.length === 0)) {
    return (
      <div className="summary-grid">
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton" style={{ height: 130, borderRadius: 28 }} />
        ))}
      </div>
    );
  }

  return (
    <div className="summary-grid">
      <div className="stat-card" style={{ borderLeft: '5px solid var(--income)', background: 'linear-gradient(135deg, var(--surface), rgba(16, 185, 129, 0.05))' }}>
        <div className="stat-label" style={{ color: 'var(--income)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
          {t('income')}
        </div>
        <div className="stat-value" style={{ color: 'var(--text)', fontSize: '1.8rem', fontWeight: 800 }}>{fmt(inc)}</div>
      </div>
      
      <div className="stat-card" style={{ borderLeft: '5px solid var(--coral)', background: 'linear-gradient(135deg, var(--surface), rgba(244, 63, 94, 0.05))' }}>
        <div className="stat-label" style={{ color: 'var(--coral)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
          {t('expense')}
        </div>
        <div className="stat-value" style={{ color: 'var(--text)', fontSize: '1.8rem', fontWeight: 800 }}>{fmt(exp)}</div>
      </div>
      
      <div className="stat-card" style={{ borderLeft: '5px solid var(--indigo)', background: 'linear-gradient(135deg, var(--surface), rgba(99, 102, 241, 0.05))' }}>
        <div className="stat-label" style={{ color: 'var(--indigo)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
          {t('balance')}
        </div>
        <div className="stat-value" style={{ color: 'var(--text)', fontSize: '1.8rem', fontWeight: 800 }}>{fmt(bal)}</div>
      </div>
    </div>
  );
}
