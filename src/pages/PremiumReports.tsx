import React, { useState } from 'react'
import { Star, FileText, Download, TrendingUp, BarChart2, Calendar } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import ChartCard from '../components/ui/ChartCard'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import { monthlyRevenueData } from '../data/mockData'

const yearlyData = [
  { year: '2021', revenue: 32000000, branches: 4 },
  { year: '2022', revenue: 48000000, branches: 6 },
  { year: '2023', revenue: 68000000, branches: 8 },
  { year: '2024', revenue: 86000000, branches: 10 },
  { year: '2025', revenue: 112000000, branches: 12 },
  { year: '2026 (F)', revenue: 145000000, branches: 15 },
]

const PremiumReports: React.FC = () => {
  const [tab, setTab] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly')
  const [downloading, setDownloading] = useState(false)

  const handleDownload = () => {
    setDownloading(true)
    setTimeout(() => {
      setDownloading(false)
      alert('PDF report downloaded! (In production, this generates a real PDF using jsPDF)')
    }, 2000)
  }

  const quarterlyData = [
    { quarter: 'Q1 2024', revenue: 14800000, profit: 4200000, growth: 18 },
    { quarter: 'Q2 2024', revenue: 16500000, profit: 4900000, growth: 22 },
    { quarter: 'Q3 2024', revenue: 19200000, profit: 6100000, growth: 28 },
    { quarter: 'Q4 2024', revenue: 35500000, profit: 12800000, growth: 45 },
  ]

  return (
    <div className="space-y-7">
      <PageHeader
        title="Premium Reports"
        subtitle="Deep analytics, multi-year forecasts, and downloadable PDF reports"
        icon={<Star className="w-6 h-6 text-amber-400" />}
        badge="Premium"
        badgeColor="amber"
        actions={
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60 shadow-lg shadow-amber-500/30"
          >
            <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
            {downloading ? 'Generating…' : 'Download PDF Report'}
          </button>
        }
      />

      {/* Tab Selector */}
      <div className="flex gap-2">
        {(['monthly', 'quarterly', 'yearly'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t
                ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg shadow-primary-500/30'
                : 'dark:bg-white/5 bg-slate-100 dark:text-slate-400 text-slate-600 dark:hover:bg-white/10 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Monthly View */}
      {tab === 'monthly' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { label: 'Total Revenue (FY)', value: '₹8.6Cr', change: '+24.8%', color: 'text-emerald-400' },
              { label: 'Total Profit (FY)', value: '₹2.4Cr', change: '+31.2%', color: 'text-primary-400' },
              { label: 'Avg Monthly Revenue', value: '₹71.7L', change: '+24.8%', color: 'text-amber-400' },
            ].map(m => (
              <div key={m.label} className="metric-card text-center">
                <p className="text-xs dark:text-slate-400 text-slate-500 mb-2">{m.label}</p>
                <p className={`text-3xl font-black font-display dark:text-white text-slate-900`}>{m.value}</p>
                <p className={`text-sm font-semibold mt-1 ${m.color}`}>{m.change} YoY</p>
              </div>
            ))}
          </div>
          <ChartCard title="Monthly Revenue, Expenses & Profit" subtitle="Full fiscal year breakdown" filters={['Revenue', 'Profit', 'All']}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRevenueData}>
                <defs>
                  <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/100000}L`} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} formatter={(v: any) => `₹${(v/100000).toFixed(1)}L`} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" fill="url(#revG)" strokeWidth={2.5} dot={false} />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f59e0b" fill="none" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                <Area type="monotone" dataKey="profit" name="Profit" stroke="#10b981" fill="url(#profG)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </>
      )}

      {/* Quarterly View */}
      {tab === 'quarterly' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quarterlyData.map(q => (
              <div key={q.quarter} className="metric-card">
                <p className="text-xs dark:text-slate-400 text-slate-500 mb-1">{q.quarter}</p>
                <p className="text-2xl font-bold dark:text-white text-slate-900">₹{(q.revenue/10000000).toFixed(1)}Cr</p>
                <p className="text-xs text-emerald-400 mt-1">+{q.growth}% growth</p>
                <p className="text-xs dark:text-slate-400 text-slate-500">Profit: ₹{(q.profit/100000).toFixed(0)}L</p>
              </div>
            ))}
          </div>
          <ChartCard title="Quarterly Revenue vs Profit" subtitle="2024 full year">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="quarter" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000000}Cr`} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} formatter={(v: any) => `₹${(v/100000).toFixed(0)}L`} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {/* Yearly View */}
      {tab === 'yearly' && (
        <div className="space-y-5">
          <ChartCard title="5-Year Revenue & Expansion Trend" subtitle="Historical growth + 2026 forecast">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/10000000}Cr`} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} formatter={(v: any, name: string) => [name === 'Revenue' ? `₹${(v/10000000).toFixed(1)}Cr` : `${v} locations`, name]} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="branches" name="Branches" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-500/10 to-purple-600/10 border border-primary-500/20">
            <p className="text-sm font-semibold dark:text-white text-slate-900 mb-1">📈 2026 Forecast Summary</p>
            <p className="text-sm dark:text-slate-300 text-slate-700">
              At current growth trajectory of <strong>+29.6% YoY</strong>, WyaparIQ is projected to reach <strong>₹14.5 Crore</strong> in revenue by end-2026, across <strong>15 branches</strong>.
              Diwali season alone is predicted to contribute <strong>35%</strong> of annual revenue.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default PremiumReports
