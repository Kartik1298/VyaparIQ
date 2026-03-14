import React from 'react'
import {
  Users, ShoppingBag, Building2, Package,
  AlertTriangle, UserCheck, TrendingUp, Activity
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'
import StatCard from '../components/ui/StatCard'
import ChartCard from '../components/ui/ChartCard'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import {
  dashboardKPIs, visitorTrendData, branchPerformanceData,
  productCategoryData, weeklyGrowthData, topProducts
} from '../data/mockData'

const formatINR = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`
  return `₹${value}`
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-xl p-3 border border-white/10 shadow-xl">
        <p className="text-xs text-slate-400 mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-300">{entry.name}:</span>
            <span className="text-white font-semibold">
              {entry.name.toLowerCase().includes('sale') || entry.name.toLowerCase().includes('revenue')
                ? formatINR(entry.value)
                : entry.value.toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-7">
      <PageHeader
        title="Dashboard"
        subtitle="Real-time retail intelligence across all branches"
        badge="Live"
        badgeColor="emerald"
        icon={<Activity className="w-6 h-6 text-primary-400" />}
        actions={
          <div className="flex items-center gap-2 text-xs dark:text-slate-400 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
            Last updated: just now
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Visitors Today"
          value={dashboardKPIs.totalVisitors}
          change={dashboardKPIs.visitorsChange}
          changeLabel="vs yesterday"
          icon={Users}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
          delay={0}
        />
        <StatCard
          title="Total Sales Today"
          value={dashboardKPIs.totalSales}
          change={dashboardKPIs.salesChange}
          changeLabel="vs yesterday"
          icon={ShoppingBag}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          prefix="₹"
          delay={100}
        />
        <StatCard
          title="Avg. Order Value"
          value={dashboardKPIs.avgOrderValue}
          change={dashboardKPIs.avgOrderChange}
          changeLabel="vs last week"
          icon={TrendingUp}
          iconColor="text-primary-400"
          iconBg="bg-primary-500/10"
          prefix="₹"
          delay={200}
        />
        <StatCard
          title="Conversion Rate"
          value={dashboardKPIs.conversionRate}
          change={dashboardKPIs.conversionChange}
          changeLabel="vs last week"
          icon={Activity}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
          suffix="%"
          delay={300}
        />
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="metric-card border-l-4 border-emerald-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs dark:text-slate-400 text-slate-500">Top Branch</p>
              <p className="font-semibold dark:text-white text-slate-900 text-sm">{dashboardKPIs.topBranch}</p>
              <p className="text-xs text-emerald-400">₹{dashboardKPIs.topBranchSales.toLocaleString('en-IN')} today</p>
            </div>
          </div>
        </div>
        <div className="metric-card border-l-4 border-amber-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs dark:text-slate-400 text-slate-500">Inventory Alerts</p>
              <p className="font-semibold dark:text-white text-slate-900 text-sm">{dashboardKPIs.inventoryAlerts} products</p>
              <p className="text-xs text-amber-400">Require restocking</p>
            </div>
          </div>
        </div>
        <div className="metric-card border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs dark:text-slate-400 text-slate-500">Staff Alerts</p>
              <p className="font-semibold dark:text-white text-slate-900 text-sm">{dashboardKPIs.staffAlerts} branches</p>
              <p className="text-xs text-blue-400">Need more staff today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Visitor + Sales Trend */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Today's Visitor & Sales Trend"
            subtitle="Hourly breakdown across all branches"
            filters={['Today', 'Week', 'Month']}
          >
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={visitorTrendData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="visitorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${v/1000}K` : v} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                <Area type="monotone" dataKey="visitors" name="Visitors" stroke="#6366f1" fill="url(#visitorGrad)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="sales" name="Sales (₹)" stroke="#10b981" fill="url(#salesGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Product Category Pie */}
        <ChartCard title="Sales by Category" subtitle="Today's distribution">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={productCategoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {productCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, '']}
                contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {productCategoryData.map(item => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs dark:text-slate-400 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                {item.name} ({item.value}%)
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Branch Performance & Weekly Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Branch Performance" subtitle="Top 6 branches by revenue" filters={['Revenue', 'Visitors']}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={branchPerformanceData.slice(0, 6)} layout="vertical" margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => formatINR(v)} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} width={110} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" name="Sales" radius={[0, 6, 6, 0]}>
                {branchPerformanceData.slice(0, 6).map((_, i) => (
                  <Cell key={i} fill={`hsl(${250 + i * 15}, 80%, ${65 - i * 5}%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly Revenue Growth" subtitle="vs target and last year" filters={['8W', '12W', '6M']}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weeklyGrowthData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lastYearGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#475569" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#475569" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/100000}L`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              <Area type="monotone" dataKey="lastYear" name="Last Year" stroke="#475569" fill="url(#lastYearGrad)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              <Area type="monotone" dataKey="target" name="Target" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" fill="none" dot={false} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" fill="url(#revGrad)" strokeWidth={2.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top Products Table */}
      <ChartCard title="Top Selling Products" subtitle="Across all branches today">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Category</th>
                <th>Units Sold</th>
                <th>Revenue</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => (
                <tr key={p.name}>
                  <td className="dark:text-slate-500 text-slate-400 font-mono text-xs">{String(i + 1).padStart(2, '0')}</td>
                  <td className="dark:text-white text-slate-900 font-medium">{p.name}</td>
                  <td>
                    <Badge variant={
                      p.category === 'Electronics' ? 'info' :
                      p.category === 'Fashion' ? 'purple' :
                      p.category === 'Groceries' ? 'success' : 'default'
                    }>
                      {p.category}
                    </Badge>
                  </td>
                  <td className="dark:text-slate-300 text-slate-700 font-medium">
                    {p.sales.toLocaleString('en-IN')}
                  </td>
                  <td className="dark:text-slate-300 text-slate-700 font-medium">
                    {formatINR(p.revenue)}
                  </td>
                  <td>
                    <span className={`text-xs font-semibold ${p.trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {p.trend > 0 ? '+' : ''}{p.trend}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  )
}

export default Dashboard
