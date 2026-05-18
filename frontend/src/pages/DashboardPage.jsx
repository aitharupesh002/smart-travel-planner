import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function DashboardPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('travel_history') || '[]');
    setHistory(data);
  }, []);

  const totalSpent = history.reduce((acc, curr) => acc + curr.total_cost, 0);
  const totalSaved = history.reduce((acc, curr) => acc + curr.savings, 0);

  const comparisonData = [
    { name: 'Flight', cost: 8000 },
    { name: 'Train', cost: 2000 },
    { name: 'Bus', cost: 2500 },
    { name: 'Mixed', cost: 1800 },
  ];

  const pieData = history.length > 0 ? [
    { name: 'Transport', value: history[history.length-1].total_cost - history[history.length-1].stay_cost },
    { name: 'Stay', value: history[history.length-1].stay_cost },
  ] : [
    { name: 'Transport', value: 1500 },
    { name: 'Stay', value: 500 },
  ];
  
  const COLORS = ['#3b82f6', '#8b5cf6'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Travel Analytics</h1>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 rounded-2xl border border-blue-500/30">
          <h3 className="text-slate-400 mb-2">Total Trips Planned</h3>
          <div className="text-4xl font-bold text-white">{history.length}</div>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-purple-500/30">
          <h3 className="text-slate-400 mb-2">Total Estimated Cost</h3>
          <div className="text-4xl font-bold text-white">₹{totalSpent}</div>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/30">
          <h3 className="text-slate-400 mb-2">Total Savings</h3>
          <div className="text-4xl font-bold text-emerald-400">₹{totalSaved}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-6">Transport Cost Comparison (₹)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px'}} />
                <Bar dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-6">Latest Trip Expense Split</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px'}} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
