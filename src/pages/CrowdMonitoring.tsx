import React, { useState, useMemo } from 'react'
import { Users, Clock, TrendingUp, MapPin, Upload } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, AreaChart, Area, Legend
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import ChartCard from '../components/ui/ChartCard'
import StatCard from '../components/ui/StatCard'
import PageHeader from '../components/ui/PageHeader'
import { useData } from '../context/DataContext'
import { crowdData as mockCrowdData } from '../data/mockData'

const mockDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const mockHours = ['6AM','7AM','8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM','6PM','7PM','8PM','9PM','10PM']

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
  const { businessData } = useData()
  const navigate = useNavigate()
  const hasData = !!businessData

  // Derive crowd data from CSV
  const derived = useMemo(() => {
    if (!businessData) return null
    const { analysis, parsedData } = businessData
    const { summary, topItems } = analysis

    // Look for time/hour related columns
    const hourCol = summary.categoricalColumns.find(c => /hour|time|period/i.test(c)) || summary.dateColumns[0]
    const visitorCol = summary.numericColumns.find(c => /visitor|count|traffic|crowd|footfall/i.test(c)) || summary.numericColumns[0]
    const dayCol = summary.categoricalColumns.find(c => /day|weekday|day_of_week/i.test(c))

    if (!visitorCol) return null

    // Aggregate by hour if available
    if (hourCol) {
      const hourAgg: Record<string, number> = {}
      parsedData.rows.forEach(row => {
        const h = row[hourCol]
        const v = parseFloat(row[visitorCol]) || 0
        if (h) hourAgg[h] = (hourAgg[h] || 0) + v
      })
      const hourlyData = Object.entries(hourAgg)
        .map(([hour, visitors]) => ({ hour, visitors: Math.round(visitors) }))
        .sort((a, b) => a.hour.localeCompare(b.hour))

      const peakHour = hourlyData.reduce((max, h) => h.visitors > max.visitors ? h : max, hourlyData[0])
      const totalVisitors = hourlyData.reduce((a, b) => a + b.visitors, 0)

      return { hourlyData, peakHour: peakHour?.hour || '-', totalVisitors, type: 'hourly' as const }
    }

    // Aggregate by day
    if (dayCol) {
      const dayAgg: Record<string, number> = {}
      parsedData.rows.forEach(row => {
        const d = row[dayCol]
        const v = parseFloat(row[visitorCol]) || 0
        if (d) dayAgg[d] = (dayAgg[d] || 0) + v
      })
      const dailyData = Object.entries(dayAgg)
        .map(([day, visitors]) => ({ day, visitors: Math.round(visitors) }))
        .sort((a, b) => b.visitors - a.visitors)

      return { dailyData, busiestDay: dailyData[0]?.day || '-', totalVisitors: dailyData.reduce((a, b) => a + b.visitors, 0), type: 'daily' as const }
    }

    // Just aggregate total
    const totalVisitors = parsedData.rows.reduce((sum, row) => sum + (parseFloat(row[visitorCol]) || 0), 0)
    return { totalVisitors: Math.round(totalVisitors), type: 'simple' as const }
  }, [businessData])

  // Mock heatmap
  const heatmapMatrix = mockHours.map((hour, hi) => {
    const row = mockCrowdData.hourlyData[hi] || {} as any
    return mockDays.map((day, di) => {
      const keys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sum']
      return (row as any)[keys[di]] || 0
    })
  })
  const maxVal = Math.max(...heatmapMatrix.flat())

  const mockTodayData = mockCrowdData.hourlyData.map(h => ({
    hour: h.hour,
    visitors: ((h as any).mon + (h as any).tue + (h as any).wed + (h as any).thu + (h as any).fri + (h as any).sat + (h as any).sum) / 7 | 0,
    peak: (h as any).sat,
  }))

  return (
    <div className="space-y-7">
      <PageHeader
        title="Crowd Monitoring"
        subtitle={hasData && derived
          ? `Visitor patterns from ${businessData.fileName}`
          : 'Real-time visitor tracking and traffic pattern analysis'
        }
        icon={<Users className="w-6 h-6 text-emerald-400" />}
        badge={hasData && derived ? 'CSV Data' : 'Demo'}
        badgeColor="emerald"
        actions={!hasData ? (
          <button onClick={() => navigate('/upload')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-all">
            <Upload className="w-3.5 h-3.5" /> Upload CSV
          </button>
        ) : undefined}
      />

      {!hasData && (
        <div onClick={() => navigate('/upload')}
          className="p-3 rounded-xl bg-gradient-to-r from-emerald-600/10 to-primary-600/10 border border-primary-500/20 cursor-pointer hover:border-primary-500/40 transition-all">
          <p className="text-xs dark:text-slate-400 text-slate-500 text-center">
            <Upload className="w-3.5 h-3.5 inline mr-1" />
            Upload CSV with visitor/traffic data for real crowd analysis
          </p>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Visitors" value={derived?.totalVisitors || mockCrowdData.avgDailyVisitors * 8} icon={Users} iconColor="text-emerald-400" iconBg="bg-emerald-500/10" />
        <StatCard title="Current In-Store" value={hasData ? Math.round((derived?.totalVisitors || 0) / 10) : 1247} icon={MapPin} iconColor="text-blue-400" iconBg="bg-blue-500/10" />
        <StatCard title="Peak Hour" value={derived?.type === 'hourly' ? (derived as any).peakHour : '6 PM'} icon={Clock} iconColor="text-amber-400" iconBg="bg-amber-500/10" />
        <StatCard title="Busiest Day" value={derived?.type === 'daily' ? (derived as any).busiestDay : mockCrowdData.busiestDay} icon={TrendingUp} iconColor="text-purple-400" iconBg="bg-purple-500/10" />
      </div>

      {/* CSV hourly chart */}
      {derived?.type === 'hourly' && (
        <ChartCard title="Visitor Flow by Hour" subtitle="From uploaded CSV data">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={(derived as any).hourlyData}>
              <defs>
                <linearGradient id="csvCrowdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="visitors" name="Visitors" stroke="#10b981" fill="url(#csvCrowdGrad)" strokeWidth={2.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* CSV daily chart */}
      {derived?.type === 'daily' && (
        <ChartCard title="Visitors by Day" subtitle="From uploaded CSV data">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={(derived as any).dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="visitors" name="Visitors" radius={[6, 6, 0, 0]}>
                {(derived as any).dailyData.map((_: any, i: number) => (
                  <Cell key={i} fill={`hsl(${160 + i * 15}, 70%, ${55 - i * 3}%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Mock hourly chart */}
      {(!hasData || !derived || derived.type === 'simple') && (
        <ChartCard title="Today's Hourly Visitor Flow" subtitle="Average vs peak Saturday traffic (demo)" filters={['Today', 'Avg Week', 'Peak Day']}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={mockTodayData}>
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
      )}

      {/* Weekly Heatmap - always show */}
      {(!hasData || !derived || derived.type === 'simple') && (
        <ChartCard title="Weekly Traffic Heatmap" subtitle="Visitor intensity by hour and day (demo)">
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="flex ml-16 mb-2">
                {mockDays.map(d => (
                  <div key={d} className="flex-1 text-center text-xs font-semibold dark:text-slate-400 text-slate-500">{d}</div>
                ))}
              </div>
              {heatmapMatrix.map((row, hi) => (
                <div key={hi} className="flex items-center mb-1.5">
                  <div className="w-14 text-xs dark:text-slate-500 text-slate-400 text-right pr-2 flex-shrink-0">{mockHours[hi]}</div>
                  {row.map((val, di) => (
                    <div key={di} className="flex-1 mx-0.5">
                      <div
                        className="h-8 rounded-md flex items-center justify-center text-xs font-bold text-white transition-all hover:scale-105 cursor-pointer"
                        style={{ backgroundColor: getHeatColor(val, maxVal), opacity: val === 0 ? 0.3 : 1 }}
                        title={`${mockHours[hi]} ${mockDays[di]}: ${val} visitors`}
                      >
                        {val > 200 ? val : ''}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
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
      )}
    </div>
  )
}

export default CrowdMonitoring
