import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import CustomSelect from "./CustomSelect";

const INCOME_CATS = ["Lương", "Thưởng", "Đầu tư", "Bán hàng", "Khác"];
const EXPENSE_CATS = ["Ăn uống", "Di chuyển", "Mua sắm", "Giải trí", "Hóa đơn", "Sức khỏe", "Giáo dục", "Khác"];

export default function ExpenseForm({ onSubmit }) {
  const { t, theme } = useAppContext();
  const [form, setForm] = useState({ amount: "", category: "", description: "", type: "expense", date: new Date().toISOString().slice(0, 10) });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) return;
    onSubmit({ ...form, amount: Number(form.amount) });
    setForm({ ...form, amount: "", category: "", description: "" });
  };

  const cats = form.type === 'income' ? INCOME_CATS : EXPENSE_CATS;

  return (
    <div className="stat-card">
      <h3 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>{t('add_transaction')}</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Sliding Toggle */}
        <div className="type-toggle-container">
          <div className={`type-slider ${form.type === 'income' ? 'income-active' : ''}`}></div>
          <button 
            type="button" 
            className={`type-btn ${form.type === 'expense' ? 'active' : ''}`}
            onClick={() => setForm({...form, type: 'expense', category: ''})}
          >
            {t('expense')}
          </button>
          <button 
            type="button" 
            className={`type-btn ${form.type === 'income' ? 'active' : ''}`}
            onClick={() => setForm({...form, type: 'income', category: ''})}
          >
            {t('income')}
          </button>
        </div>

        <input className="auth-input" type="number" placeholder={t('amount')} value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required min="1000" step="1000" />
        
        <CustomSelect 
          value={form.category} 
          onChange={(val) => setForm({...form, category: val})} 
          options={cats} 
          placeholder={t('category')} 
        />

        <input className="auth-input" type="text" placeholder={t('description')} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        
        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>{t('save')}</button>
      </form>
    </div>
  );
}
