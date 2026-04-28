import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

export default function SummaryStats({ expenses, loading }) {
  const { t } = useAppContext();

  const { inc, exp, bal } = useMemo(() => {
    let i = 0, e = 0;
    (expenses || []).forEach(x => {
      const a = Number(x.amount) || 0;
      if (x.type === 'income') i += a;
      else e += a;
    });
    return { inc: i, exp: e, bal: i - e };
  }, [expenses]);

  if (loading && expenses.length === 0) {
    return (
      <div className="summary-grid">
        {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 24 }} />)}
      </div>
    );
  }

  return (
    <div className="summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
      <div className="stat-card" style={{ borderLeft: '4px solid var(--income)' }}>
        <div className="stat-label">{t('income')}</div>
        <div className="stat-value" style={{ color: 'var(--income)' }}>{fmt(inc)}</div>
      </div>
      <div className="stat-card" style={{ borderLeft: '4px solid var(--coral)' }}>
        <div className="stat-label">{t('expense')}</div>
        <div className="stat-value" style={{ color: 'var(--coral)' }}>{fmt(exp)}</div>
      </div>
      <div className="stat-card" style={{ borderLeft: '4px solid var(--indigo)' }}>
        <div className="stat-label">{t('balance')}</div>
        <div className="stat-value" style={{ color: 'var(--indigo)' }}>{fmt(bal)}</div>
      </div>
    </div>
  );
}
