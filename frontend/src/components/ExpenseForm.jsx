import { useState } from "react";

const INCOME_CATS = ["Lương", "Thưởng", "Đầu tư", "Bán hàng", "Khác"];
const EXPENSE_CATS = [
  "Ăn uống",
  "Di chuyển",
  "Mua sắm",
  "Giải trí",
  "Hóa đơn",
  "Tiện ích",
  "Sức khỏe",
  "Giáo dục",
  "Y tế",
  "Khác",
];

const today = () => new Date().toISOString().slice(0, 10);

export default function ExpenseForm({ onSubmit }) {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    customCategory: "", // Thêm trường danh mục tuỳ chỉnh
    description: "",
    type: "expense",
    date: today(),
  });
  const [loading, setLoading] = useState(false);

  const cats = form.type === "income" ? INCOME_CATS : EXPENSE_CATS;

  const set = (k, v) =>
    setForm((f) => ({
      ...f,
      [k]: v,
      ...(k === "type" ? { category: "" } : {}),
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category)
      return alert("Vui lòng nhập số tiền và chọn danh mục!");
    if (parseFloat(form.amount) <= 0)
      return alert("Số tiền giao dịch phải lớn hơn 0!");
    
    setLoading(true);
    try {
      // Xác định danh mục cuối cùng
      let finalCategory = form.category;
      if (form.category === "Khác" && form.customCategory.trim() !== "") {
        finalCategory = form.customCategory.trim();
      }

      await onSubmit({ 
        amount: parseFloat(form.amount),
        category: finalCategory,
        description: form.description || "",
        type: form.type,
        date: form.date
      });
      setForm({
        amount: "",
        category: "",
        customCategory: "",
        description: "",
        type: "expense",
        date: today(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="summary-card" data-reveal>
      <h3 style={{ marginBottom: "var(--space-4)", fontWeight: 700, fontSize: "1.125rem", fontFamily: "var(--font-display)" }}>
        Thêm giao dịch
      </h3>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        
        {/* Toggle Expense/Income */}
        <div style={{ display: "flex", background: "rgba(0,0,0,0.2)", borderRadius: "var(--radius-md)", padding: "2px" }}>
          {["expense", "income"].map((t) => (
            <div
              key={t}
              onClick={() => set("type", t)}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "8px 0",
                cursor: "pointer",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                fontWeight: 600,
                textTransform: "uppercase",
                fontFamily: "var(--font-display)",
                transition: "all var(--dur-fast)",
                background: form.type === t ? (t === "expense" ? "var(--color-expense)" : "var(--color-income)") : "transparent",
                color: form.type === t ? "#fff" : "var(--color-text-dim)",
                boxShadow: form.type === t ? (t === "expense" ? "0 4px 12px rgba(246,76,114,0.3)" : "0 4px 12px rgba(80,227,194,0.2)") : "none"
              }}
            >
              {t === "expense" ? "Chi tiêu" : "Thu nhập"}
            </div>
          ))}
        </div>

        {/* Số tiền */}
        <div>
          <label className="form-label">Số tiền (VNĐ)</label>
          <input
            type="number"
            className="form-input form-input--amount"
            value={form.amount}
            onChange={(e) => set("amount", e.target.value)}
            placeholder="0"
            min="1"
            required
            autoFocus
          />
        </div>

        {/* Danh mục */}
        <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <label className="form-label">Danh mục</label>
            <select
              className="form-input"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              required
            >
              <option value="" disabled>-- Chọn danh mục --</option>
              {cats.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          
          {/* Tuỳ chọn Điền Thêm nếu chọn Khác */}
          {form.category === "Khác" && (
            <div style={{ flex: 1, animation: 'slideUp 0.3s ease-out' }}>
              <label className="form-label">Nhập tên danh mục</label>
              <input
                type="text"
                className="form-input"
                value={form.customCategory}
                onChange={(e) => set("customCategory", e.target.value)}
                placeholder="Nhập tên..."
                required
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Mô tả */}
        <div>
          <label className="form-label">Mô tả giao dịch (Tùy chọn)</label>
          <input
            type="text"
            className="form-input"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Ví dụ: Ăn trưa..."
          />
        </div>

        {/* Ngày */}
        <div>
          <label className="form-label">Ngày</label>
          <input
            type="date"
            className="form-input"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{
            marginTop: "var(--space-2)",
            opacity: loading ? 0.7 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%"
          }}
        >
          {loading ? (
            <span className="skeleton" style={{ width: 16, height: 16, borderRadius: "50%", display: "inline-block" }}></span>
          ) : (
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
          )}
          {loading ? "Đang lưu..." : "Thêm giao dịch"}
        </button>
      </form>
    </div>
  );
}
