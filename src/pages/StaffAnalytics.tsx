import React from 'react'
import { UserCheck, Users, TrendingUp, Clock } from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts'
import ChartCard from '../components/ui/ChartCard'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import { staffData } from '../data/mockData'

const staffForecastData = [
  { hour: '9AM', needed: 12, actual: 10, efficiency: 83 },
  { hour: '10AM', needed: 18, actual: 16, efficiency: 89 },
  { hour: '11AM', needed: 22, actual: 20, efficiency: 91 },
  { hour: '12PM', needed: 28, actual: 25, efficiency: 89 },
  { hour: '1PM', needed: 30, actual: 28, efficiency: 93 },
  { hour: '2PM', needed: 25, actual: 25, efficiency: 100 },
  { hour: '3PM', needed: 22, actual: 22, efficiency: 100 },
  { hour: '4PM', needed: 26, actual: 24, efficiency: 92 },
  { hour: '5PM', needed: 35, actual: 30, efficiency: 86 },
  { hour: '6PM', needed: 40, actual: 35, efficiency: 88 },
  { hour: '7PM', needed: 38, actual: 36, efficiency: 95 },
  { hour: '8PM', needed: 28, actual: 28, efficiency: 100 },
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
          <span className="text-white font-semibold">{e.value}{e.name === 'Efficiency' ? '%' : ''}</span>
        </div>
      ))}
    </div>
  )
}

const StaffAnalytics: React.FC = () => {
  const totalStaff = staffData.reduce((a, b) => a + b.currentStaff, 0)
  const totalRecommended = staffData.reduce((a, b) => a + b.recommended, 0)
  const avgEfficiency = Math.round(staffData.reduce((a, b) => a + b.efficiency, 0) / staffData.length)

  return (
    <div className="space-y-7">
      <PageHeader
        title="Staff Analytics"
        subtitle="Employee productivity, staffing optimization, and service capacity"
        icon={<UserCheck className="w-6 h-6 text-cyan-400" />}
        badge="AI Optimized"
        badgeColor="primary"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Staff" value={totalStaff} icon={Users} iconColor="text-blue-400" iconBg="bg-blue-500/10" />
        <StatCard title="Recommended" value={totalRecommended} icon={UserCheck} iconColor="text-emerald-400" iconBg="bg-emerald-500/10" />
        <StatCard title="Gap" value={totalRecommended - totalStaff} icon={TrendingUp} iconColor="text-amber-400" iconBg="bg-amber-500/10" />
        <StatCard title="Avg Efficiency" value={avgEfficiency} suffix="%" icon={Clock} iconColor="text-purple-400" iconBg="bg-purple-500/10" />
      </div>

      {/* Staff by Branch */}
      <ChartCard title="Staff Requirement by Branch" subtitle="Current vs AI-recommended staffing levels">
        <div className="space-y-4">
          {staffData.map(branch => {
            const gap = branch.recommended - branch.currentStaff
            const efficiency = branch.efficiency
            return (
              <div key={branch.branch} className="p-4 rounded-xl dark:bg-white/5 bg-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold dark:text-white text-slate-900 text-sm">{branch.branch}</p>
                    <p className="text-xs dark:text-slate-400 text-slate-500">{branch.customersPerHour} customers/hr · Ratio {branch.ratio}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={gap > 5 ? 'danger' : gap > 0 ? 'warning' : 'success'}>
                      {gap > 0 ? `Need +${gap} staff` : 'Optimal'}
                    </Badge>
                    <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">{efficiency}% efficient</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="dark:text-slate-400 text-slate-500">Current: <strong className="dark:text-white text-slate-900">{branch.currentStaff}</strong></span>
                      <span className="dark:text-slate-400 text-slate-500">Needed: <strong className="text-primary-400">{branch.recommended}</strong></span>
                    </div>
                    <div className="h-2 dark:bg-white/10 bg-slate-200 rounded-full overflow-hidden relative">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary-500 to-purple-500"
                        style={{ width: `${(branch.currentStaff / branch.recommended) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </ChartCard>

      {/* Staffing Forecast Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Hourly Staff Requirement" subtitle="Today's needed vs actual staffing">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={staffForecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              <Bar dataKey="needed" name="Needed" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Actual" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Service Efficiency by Hour" subtitle="Staff utilization percentage">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={staffForecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[75, 105]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="efficiency" name="Efficiency" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: '#f59e0b', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}

export default StaffAnalytics
