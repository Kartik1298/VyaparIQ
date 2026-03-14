import React, { useState } from 'react'
import { Building2, TrendingUp, Star, Users } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend
} from 'recharts'
import ChartCard from '../components/ui/ChartCard'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import { branchPerformanceData } from '../data/mockData'

const monthlyBranchData = [
  { month: 'Oct', mumbai: 220000, delhi: 185000, bangalore: 175000, chennai: 142000 },
  { month: 'Nov', mumbai: 280000, delhi: 235000, bangalore: 210000, chennai: 175000 },
  { month: 'Dec', mumbai: 350000, delhi: 290000, bangalore: 260000, chennai: 215000 },
  { month: 'Jan', mumbai: 210000, delhi: 178000, bangalore: 165000, chennai: 138000 },
  { month: 'Feb', mumbai: 225000, delhi: 190000, bangalore: 180000, chennai: 148000 },
  { month: 'Mar', mumbai: 234500, delhi: 198000, bangalore: 187000, chennai: 156000 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl p-3 border border-white/10 shadow-xl">
      <p className="text-xs text-slate-400 mb-2">{label}</p>
      {payload.map((e: any) => (
        <div key={e.name} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }} />
          <span className="text-slate-300">{e.name}:</span>
          <span className="text-white font-semibold">₹{(e.value / 1000).toFixed(0)}K</span>
        </div>
      ))}
    </div>
  )
}

const RADAR_METRICS = [
  { key: 'sales', label: 'Sales' },
  { key: 'visitors', label: 'Visitors' },
  { key: 'staff', label: 'Staff' },
  { key: 'rating', label: 'Rating' },
]

const radarData = branchPerformanceData.slice(0, 5).map(b => ({
  branch: b.name.split(' - ')[0],
  Sales: Math.round(b.sales / 3000),
  Visitors: Math.round(b.visitors / 40),
  Staff: Math.round(b.staff / 0.5),
  Rating: Math.round(b.rating * 20),
}))

const BranchAnalytics: React.FC = () => {
  const [selected, setSelected] = useState(0)
  const branch = branchPerformanceData[selected]

  return (
    <div className="space-y-7">
      <PageHeader
        title="Branch Analytics"
        subtitle="Comprehensive performance comparison across all store locations"
        icon={<Building2 className="w-6 h-6 text-violet-400" />}
        badge={`${branchPerformanceData.length} Branches`}
        badgeColor="primary"
      />

      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Branches" value={branchPerformanceData.length} icon={Building2} iconColor="text-violet-400" iconBg="bg-violet-500/10" />
        <StatCard title="Avg Daily Sales" value={Math.round(branchPerformanceData.reduce((a, b) => a + b.sales, 0) / branchPerformanceData.length)} prefix="₹" icon={TrendingUp} iconColor="text-emerald-400" iconBg="bg-emerald-500/10" />
        <StatCard title="Best Performer" value={branchPerformanceData[0].name.split(' - ')[0]} icon={Star} iconColor="text-amber-400" iconBg="bg-amber-500/10" />
        <StatCard title="Total Visitors" value={branchPerformanceData.reduce((a, b) => a + b.visitors, 0)} icon={Users} iconColor="text-blue-400" iconBg="bg-blue-500/10" />
      </div>

      {/* Branch selector + detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartCard title="Select Branch" subtitle="Click to drill-down">
          <div className="space-y-1.5">
            {branchPerformanceData.map((b, i) => (
              <button
                key={b.name}
                onClick={() => setSelected(i)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left
                  ${selected === i
                    ? 'bg-primary-500/20 border border-primary-500/30'
                    : 'dark:hover:bg-white/5 hover:bg-slate-100'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs dark:text-slate-500 text-slate-400 font-mono w-5">#{i + 1}</span>
                  <div>
                    <p className={`text-xs font-semibold ${selected === i ? 'text-primary-400' : 'dark:text-white text-slate-900'}`}>{b.name}</p>
                    <p className="text-xs dark:text-slate-400 text-slate-500">⭐ {b.rating} rating</p>
                  </div>
                </div>
                <span className="text-xs font-bold dark:text-white text-slate-900">₹{(b.sales / 1000).toFixed(0)}K</span>
              </button>
            ))}
          </div>
        </ChartCard>

        <div className="lg:col-span-2 space-y-5">
          {/* Branch KPIs */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Daily Sales', value: `₹${(branch.sales / 1000).toFixed(0)}K`, color: 'text-emerald-400' },
              { label: 'Daily Visitors', value: branch.visitors.toLocaleString('en-IN'), color: 'text-blue-400' },
              { label: 'Staff Count', value: branch.staff, color: 'text-purple-400' },
              { label: 'Customer Rating', value: `${branch.rating} ⭐`, color: 'text-amber-400' },
            ].map(m => (
              <div key={m.label} className="metric-card text-center">
                <p className="text-xs dark:text-slate-400 text-slate-500 mb-1">{m.label}</p>
                <p className={`text-2xl font-bold font-display ${m.color}`}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Monthly trend for selected branch */}
          <ChartCard title={`${branch.name} — Monthly Revenue`} subtitle="6-month performance">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyBranchData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey={['mumbai','delhi','bangalore','chennai','hyderabad','pune','kolkata','jaipur'][selected] || 'mumbai'}
                  name={branch.name.split(' - ')[0]}
                  radius={[6, 6, 0, 0]} fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Revenue Comparison" subtitle="All branches side by side" filters={['Sales', 'Visitors']}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={branchPerformanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}K`} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} width={105} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" name="Sales" radius={[0, 6, 6, 0]}>
                {branchPerformanceData.map((_, i) => (
                  <Cell key={i} fill={`hsl(${250 + i * 12}, 75%, ${68 - i * 5}%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Multi-Metric Radar" subtitle="Performance across dimensions">
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="branch" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Radar name="Sales" dataKey="Sales" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Visitors" dataKey="Visitors" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Rating" dataKey="Rating" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}

export default BranchAnalytics
