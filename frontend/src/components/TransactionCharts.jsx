import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { useAppContext } from '../context/AppContext';

const COLORS = [
  '#22d3ee', '#3b82f6', '#8b5cf6', '#d946ef', 
  '#f43f5e', '#fb923c', '#facc15', '#4ade80',
  '#2dd4bf', '#0ea5e9'
];

export default function TransactionCharts({ transactions }) {
  const { t } = useAppContext();
  const [activeTab, setActiveTab] = useState('comparison'); // 'comparison' or 'distribution'
  const [distType, setDistType] = useState('expense'); // 'income' or 'expense'

  // Prepare Expense Data
  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      const amount = parseFloat(curr.amount) || 0;
      const existing = acc.find(item => item.name === curr.category);
      if (existing) {
        existing.value += amount;
      } else {
        acc.push({ name: curr.category, value: amount });
      }
      return acc;
    }, []);

  // Prepare Income Data
  const incomeData = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => {
      const amount = parseFloat(curr.amount) || 0;
      const existing = acc.find(item => item.name === curr.category);
      if (existing) {
        existing.value += amount;
      } else {
        acc.push({ name: curr.category, value: amount });
      }
      return acc;
    }, []);

  const totalExpense = expenseData.reduce((sum, item) => sum + item.value, 0);
  const totalIncome = incomeData.reduce((sum, item) => sum + item.value, 0);

  const comparisonData = [
    { name: t('income'), amount: totalIncome, fill: 'var(--income)' },
    { name: t('expense'), amount: totalExpense, fill: 'var(--expense)' }
  ];

  const currentDistData = distType === 'expense' ? expenseData : incomeData;
  const currentTotal = distType === 'expense' ? totalExpense : totalIncome;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{payload[0].name || payload[0].payload.name}</p>
          <p className="tooltip-value">{payload[0].value.toLocaleString()} ₫</p>
        </div>
      );
    }
    return null;
  };

  const renderComparison = () => (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--muted)', fontSize: 12, fontWeight: 600 }}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Bar 
            dataKey="amount" 
            radius={[10, 10, 0, 0]} 
            barSize={60}
          >
            {comparisonData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderDistribution = () => (
    <div className="chart-wrapper">
      <div className="dist-toggle">
        <button 
          className={`toggle-sub-btn ${distType === 'expense' ? 'active expense' : ''}`}
          onClick={() => setDistType('expense')}
        >
          {t('expense')}
        </button>
        <button 
          className={`toggle-sub-btn ${distType === 'income' ? 'active income' : ''}`}
          onClick={() => setDistType('income')}
        >
          {t('income')}
        </button>
      </div>

      {currentDistData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={currentDistData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1000}
            >
              {currentDistData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.2))' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span className="legend-text">{value}</span>}
            />
            <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="chart-center-label">
              {t('total')}
            </text>
            <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle" className="chart-center-value">
              {currentTotal > 1000000 
                ? (currentTotal / 1000000).toFixed(1) + 'M' 
                : (currentTotal / 1000).toFixed(0) + 'K'}
            </text>
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="empty-chart">
          <p>{t('no_data_chart')}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="chart-container glass animate-fade-in">
      <div className="chart-tabs">
        <button 
          className={`tab-btn ${activeTab === 'comparison' ? 'active' : ''}`}
          onClick={() => setActiveTab('comparison')}
        >
          {t('total_comparison')}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'distribution' ? 'active' : ''}`}
          onClick={() => setActiveTab('distribution')}
        >
          {t('category')}
        </button>
      </div>
      
      {transactions.length > 0 ? (
        activeTab === 'comparison' ? renderComparison() : renderDistribution()
      ) : (
        <div className="empty-chart" style={{ height: 320 }}>
          <p>{t('no_data_chart')}</p>
        </div>
      )}

      <style jsx="true">{`
        .chart-container {
          padding: 1.5rem;
          border-radius: 28px;
          background: var(--surface);
          border: 1px solid var(--border);
        }
        .chart-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 0.5rem;
        }
        .tab-btn {
          background: none;
          border: none;
          color: var(--muted);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          padding: 0.5rem 0.2rem;
          position: relative;
          transition: all 0.3s;
        }
        .tab-btn.active {
          color: var(--indigo);
        }
        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -0.6rem;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--indigo);
          border-radius: 3px;
        }
        .dist-toggle {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .toggle-sub-btn {
          padding: 0.4rem 1rem;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--surface2);
          color: var(--muted);
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }
        .toggle-sub-btn.active.expense {
          background: var(--expense);
          color: white;
          border-color: var(--expense);
        }
        .toggle-sub-btn.active.income {
          background: var(--income);
          color: white;
          border-color: var(--income);
        }
        .chart-wrapper {
          min-height: 320px;
        }
        .chart-tooltip {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(12px);
          padding: 12px 16px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        }
        .tooltip-label {
          color: #94a3b8;
          font-size: 12px;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .tooltip-value {
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          margin: 4px 0 0 0;
        }
        .legend-text {
          color: var(--text);
          font-size: 13px;
          font-weight: 500;
        }
        .chart-center-label {
          fill: #94a3b8;
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
        }
        .chart-center-value {
          fill: var(--text);
          font-size: 24px;
          font-weight: 800;
        }
        .empty-chart {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
