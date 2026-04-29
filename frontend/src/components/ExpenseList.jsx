import { useAppContext } from "../context/AppContext";

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

export default function ExpenseList({ expenses, loading, onDelete }) {
  const { t, highlightId } = useAppContext();

  if (loading) return <div className="skeleton" style={{ height: 400, borderRadius: 24 }} />;

  return (
    <div className="stat-card">
      <h3 style={{ marginBottom: '1.5rem' }}>{t('history')}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {expenses.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--dim)', padding: '2rem' }}>{t('no_transactions')}</p>
        ) : (
          expenses.map(e => (
            <div 
              key={e.id} 
              className={highlightId === e.id ? "flash-highlight" : ""}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                padding: '1rem', 
                background: 'var(--surface2)', 
                borderRadius: '16px', 
                border: highlightId === e.id ? '1px solid var(--income)' : '1px solid var(--border)',
                transition: 'border-color 0.5s ease'
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: e.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)', color: e.type === 'income' ? 'var(--income)' : 'var(--coral)', display: 'grid', placeItems: 'center', fontSize: '1.25rem' }}>
                {e.type === 'income' ? '💰' : '💸'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{e.description || e.category}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--dim)' }}>{e.category}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, color: e.type === 'income' ? 'var(--income)' : 'var(--coral)' }}>
                  {e.type === 'income' ? '+' : '-'}{fmt(e.amount)}
                </div>
                <button onClick={() => onDelete(e.id)} style={{ background: 'none', border: 'none', color: 'var(--dim)', fontSize: '0.75rem', cursor: 'pointer', marginTop: '4px' }}>Xóa</button>
              </div>
            </div>
          ))
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flash {
          0% { background: var(--surface2); }
          20% { background: rgba(16, 185, 129, 0.15); transform: translateX(5px); }
          100% { background: var(--surface2); transform: translateX(0); }
        }
        .flash-highlight {
          animation: flash 2s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}} />
    </div>
  );
}
