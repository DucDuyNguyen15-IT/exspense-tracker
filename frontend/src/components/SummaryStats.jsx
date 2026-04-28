import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

// Cấu hình lại màu Chart để sáng rõ trên nền tối
const CHART_COLORS = [
  '#F64C72', // Coral (Chi tiêu / Chung)
  '#4ade80', // Mint (Thu nhập)
  '#60a5fa', // Bright Blue
  '#fbbf24', // Yellow Warning
  '#f87171', // Red Danger
  '#c4b8d4', // Muted bright
  '#99738E'  // Mauve
];

export default function SummaryStats({ loading, expenses }) {
  const { totalIncome, totalExpense, balance, pieData } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    const catMap = {};

    expenses.forEach(e => {
      if (e.type === 'income') {
        inc += e.amount;
      } else {
        exp += e.amount;
        catMap[e.category] = (catMap[e.category] || 0) + e.amount;
      }
    });

    const pData = Object.entries(catMap)
      .map(([name, value], i) => ({
        name,
        value,
        color: CHART_COLORS[i % CHART_COLORS.length]
      }))
      .sort((a, b) => b.value - a.value);

    // Calculate percentages for the legend
    pData.forEach(item => {
      item.pct = exp > 0 ? Math.round((item.value / exp) * 100) : 0;
    });

    return { totalIncome: inc, totalExpense: exp, balance: inc - exp, pieData: pData };
  }, [expenses]);

  const cards = [
    { label: "Thu nhập", value: totalIncome, type: "income", icon: "💰" },
    { label: "Chi tiêu", value: totalExpense, type: "expense", icon: "💸" },
    { label: "Số dư", value: balance, type: balance < 0 ? "danger" : "saving", icon: "🏦" },
  ];

  return (
    <>
      <div className="summary-grid">
        {cards.map((c, i) => (
          <div key={i} className={`summary-card card-${c.type}`} data-reveal>
            <div className="card-icon">{c.icon}</div>
            <div className="card-label">{c.label}</div>
            {loading ? (
              <div className="skeleton sk-title" style={{ width: "70%" }} />
            ) : (
              <div className={`card-amount ${c.value < 0 ? 'negative' : c.value > 0 && c.type !== 'expense' ? 'positive' : ''}`}>
                {fmt(Math.abs(c.value))}
              </div>
            )}
            {!loading && (
              <div className="card-change up">
                ↑ 0% so tháng trước
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="summary-card" data-reveal style={{ marginBottom: "var(--space-6)" }}>
        <div className="card-label" style={{ marginBottom: "1rem" }}>Chi tiêu theo danh mục</div>
        {loading ? (
           <div className="skeleton sk-card" style={{ height: 220 }} />
        ) : pieData.length === 0 ? (
          <div style={{ color: "var(--dim)", fontSize: "0.875rem", paddingTop: 12 }}>
            Chưa có giao dịch chi tiêu trong tháng này
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
            {/* Donut chart */}
            <div style={{ position: 'relative', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="65%"
                    outerRadius="85%"
                    stroke="#1e1e52"
                    strokeWidth={3}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => fmt(v)}
                    contentStyle={{
                      background: "rgba(30, 30, 82, 0.95)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      fontFamily: "var(--font-body)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
                    }}
                    itemStyle={{ color: "#ffffff", fontWeight: 600 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Số tổng ở giữa donut */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center', pointerEvents: 'none'
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)' }}>
                  {fmt(totalExpense).replace(' ₫', '')}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--dim)' }}>Tổng chi</div>
              </div>
            </div>

            {/* Legend chi tiết */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pieData.map(item => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: item.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, color: 'var(--muted)' }}>{item.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>
                    {fmt(item.value)}
                  </span>
                  <span style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 99,
                    background: item.color + '22', color: item.color, fontWeight: 600, minWidth: '45px', textAlign: 'center'
                  }}>
                    {item.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
