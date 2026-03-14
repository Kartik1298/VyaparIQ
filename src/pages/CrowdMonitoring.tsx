import React, { useState } from 'react'
import { Users, Clock, TrendingUp, MapPin } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts'
import ChartCard from '../components/ui/ChartCard'
import StatCard from '../components/ui/StatCard'
import PageHeader from '../components/ui/PageHeader'
import { crowdData } from '../data/mockData'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const hours = ['6AM','7AM','8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM','6PM','7PM','8PM','9PM','10PM']

// Build heatmap matrix
const heatmapMatrix = hours.map((hour, hi) => {
  const row = crowdData.hourlyData[hi] || {}
  return days.map((day, di) => {
    const keys = ['mon','tue','wed','thu','fri','sat','sum']
    return (row as any)[keys[di]] || 0
  })
})
const maxVal = Math.max(...heatmapMatrix.flat())

const getHeatColor = (val: number, max: number) => {
  const ratio = val / max
  if (ratio > 0.8) return '#ef4444'
  if (ratio > 0.6) return '#f97316'
  if (ratio > 0.4) return '#f59e0b'
  if (ratio > 0.2) return '#22c55e'
  return '#1e293b'
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl p-3 border border-white/10 shadow-xl">
      <p className="text-xs text-slate-400 mb-2">{label}</p>
      {payload.map((e: any) => (
        <div key={e.name} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }} />
          <span className="text-slate-300">{e.name}:</span>
          <span className="text-white font-semibold">{e.value?.toLocaleString?.('en-IN')}</span>
        </div>
      ))}
    </div>
  )
}

const CrowdMonitoring: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState('All')

  const todayData = crowdData.hourlyData.map(h => ({
    hour: h.hour,
    visitors: (h.mon + h.tue + h.wed + h.thu + h.fri + h.sat + h.sum) / 7 | 0,
    peak: (h.sat),
  }))

  return (
    <div className="space-y-7">
      <PageHeader
        title="Crowd Monitoring"
        subtitle="Real-time visitor tracking and traffic pattern analysis"
        icon={<Users className="w-6 h-6 text-emerald-400" />}
        badge="Live"
        badgeColor="emerald"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Today's Visitors" value={crowdData.avgDailyVisitors * 8} change={7.2} icon={Users} iconColor="text-emerald-400" iconBg="bg-emerald-500/10" />
        <StatCard title="Current In-Store" value={1247} change={12.5} icon={MapPin} iconColor="text-blue-400" iconBg="bg-blue-500/10" />
        <StatCard title="Peak Hour" value="6 PM" icon={Clock} iconColor="text-amber-400" iconBg="bg-amber-500/10" />
        <StatCard title="Busiest Day" value="Sat" icon={TrendingUp} iconColor="text-purple-400" iconBg="bg-purple-500/10" />
      </div>

      {/* Hourly Visitor Chart */}
      <ChartCard title="Today's Hourly Visitor Flow" subtitle="Average vs peak Saturday traffic" filters={['Today', 'Avg Week', 'Peak Day']}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={todayData}>
            <defs>
              <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="peakGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
            <Area type="monotone" dataKey="visitors" name="Avg Visitors" stroke="#10b981" fill="url(#avgGrad)" strokeWidth={2.5} dot={false} />
            <Area type="monotone" dataKey="peak" name="Peak (Sat)" stroke="#ef4444" fill="url(#peakGrad)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Weekly Heatmap */}
      <ChartCard title="Weekly Traffic Heatmap" subtitle="Visitor intensity by hour and day">
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Day headers */}
            <div className="flex ml-16 mb-2">
              {days.map(d => (
                <div key={d} className="flex-1 text-center text-xs font-semibold dark:text-slate-400 text-slate-500">{d}</div>
              ))}
            </div>
            {/* Heatmap rows */}
            {heatmapMatrix.map((row, hi) => (
              <div key={hi} className="flex items-center mb-1.5">
                <div className="w-14 text-xs dark:text-slate-500 text-slate-400 text-right pr-2 flex-shrink-0">{hours[hi]}</div>
                {row.map((val, di) => (
                  <div key={di} className="flex-1 mx-0.5">
                    <div
                      className="h-8 rounded-md flex items-center justify-center text-xs font-bold text-white transition-all hover:scale-105 cursor-pointer"
                      style={{ backgroundColor: getHeatColor(val, maxVal), opacity: val === 0 ? 0.3 : 1 }}
                      title={`${hours[hi]} ${days[di]}: ${val} visitors`}
                    >
                      {val > 200 ? val : ''}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {/* Legend */}
            <div className="flex items-center gap-3 mt-4 ml-16">
              <span className="text-xs dark:text-slate-400 text-slate-500">Low</span>
              {['#1e293b', '#22c55e', '#f59e0b', '#f97316', '#ef4444'].map(c => (
                <div key={c} className="w-8 h-3 rounded" style={{ backgroundColor: c }} />
              ))}
              <span className="text-xs dark:text-slate-400 text-slate-500">High</span>
            </div>
          </div>
        </div>
      </ChartCard>

      {/* Daily Comparison */}
      <ChartCard title="Day-wise Visitor Comparison" subtitle="This week vs last week same days" filters={['Visitors', 'Revenue']}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={days.map((d, i) => ({
            day: d,
            thisWeek: [2100, 2300, 2150, 2400, 2800, 4200, 3500][i],
            lastWeek: [1900, 2100, 2000, 2200, 2600, 3800, 3200][i],
          }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
            <Bar dataKey="thisWeek" name="This Week" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="lastWeek" name="Last Week" fill="#475569" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

export default CrowdMonitoring
