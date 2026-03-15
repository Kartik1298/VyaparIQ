import React, { useMemo } from 'react'
import {
  Users, ShoppingBag, Building2, Package,
  AlertTriangle, UserCheck, TrendingUp, Activity, Upload
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import StatCard from '../components/ui/StatCard'
import ChartCard from '../components/ui/ChartCard'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import { useData } from '../context/DataContext'
import {
  dashboardKPIs as mockKPIs, visitorTrendData as mockVisitorTrend,
  branchPerformanceData as mockBranchPerf, productCategoryData as mockCategoryData,
  weeklyGrowthData as mockWeeklyGrowth, topProducts as mockTopProducts
} from '../data/mockData'

const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16']

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
              {typeof entry.value === 'number' ? entry.value.toLocaleString('en-IN') : entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const Dashboard: React.FC = () => {
  const { businessData } = useData()
  const navigate = useNavigate()
  const hasData = !!businessData

  // Derive data from CSV or fall back to mock
  const derived = useMemo(() => {
    if (!businessData) return null
    const { analysis, parsedData } = businessData
    const { numericStats, topItems, correlations, timeSeries, summary } = analysis

    // KPIs from numeric columns
    const numCols = summary.numericColumns
    const totalSales = numericStats[numCols.find(c => /sale|revenue|amount|total|price/i.test(c)) || numCols[0]]?.sum || 0
    const totalRows = summary.totalRows
    const avgOrderValue = totalSales > 0 && totalRows > 0 ? Math.round(totalSales / totalRows) : 0

    // Category distribution from first categorical column
    const catCol = summary.categoricalColumns[0]
    const categoryData = catCol && topItems[catCol]
      ? topItems[catCol].slice(0, 8).map((item, i) => ({
          name: item.value, value: item.count, color: COLORS[i % COLORS.length]
        }))
      : null

    // Bar chart from correlations
    const barData = correlations.length > 0
      ? correlations[0].data.slice(0, 8).map(d => ({ name: d.x, sales: d.y }))
      : null

    // Time series for area chart
    const tsData = timeSeries.length > 0
      ? timeSeries[0].data.map(d => ({ time: d.date, value: d.value }))
      : null

    // Top items table
    const secondCat = summary.categoricalColumns[1]
    const firstNumCol = numCols[0]
    const tableData = parsedData.rows.slice(0, 8).map((row, i) => ({
      name: row[catCol] || row[secondCat] || `Row ${i + 1}`,
      category: row[secondCat] || row[catCol] || '-',
      value: firstNumCol ? parseFloat(row[firstNumCol]) || 0 : 0,
      idx: i,
    })).sort((a, b) => b.value - a.value)

    return {
      totalSales,
      totalRows,
      avgOrderValue,
      categoryData,
      barData,
      tsData,
      tableData,
      numericColumns: numCols,
      categoricalColumns: summary.categoricalColumns,
      fileName: businessData.fileName,
    }
  }, [businessData])

  // Use derived or mock data
  const kpis = hasData && derived ? {
    totalVisitors: derived.totalRows,
    visitorsChange: 0,
    totalSales: derived.totalSales,
    salesChange: 0,
    avgOrderValue: derived.avgOrderValue,
    avgOrderChange: 0,
    conversionRate: derived.totalRows > 0 ? Math.round((derived.totalRows * 0.34) * 10) / 10 : 0,
    conversionChange: 0,
  } : mockKPIs

  const categoryData = derived?.categoryData || mockCategoryData
  const barData = derived?.barData || mockBranchPerf.slice(0, 6).map(b => ({ name: b.name, sales: b.sales }))
  const tsData = derived?.tsData || null
  const visitorTrendData = mockVisitorTrend
  const weeklyGrowthData = mockWeeklyGrowth
  const topProducts = derived?.tableData || mockTopProducts

  return (
    <div className="space-y-7">
      <PageHeader
        title="Dashboard"
        subtitle={hasData
          ? `Real-time analytics from ${derived?.fileName} · ${derived?.totalRows.toLocaleString('en-IN')} records`
          : 'Real-time retail intelligence across all branches'
        }
        badge={hasData ? 'CSV Data' : 'Demo'}
        badgeColor={hasData ? 'primary' : 'emerald'}
        icon={<Activity className="w-6 h-6 text-primary-400" />}
        actions={
          hasData ? (
            <div className="flex items-center gap-2 text-xs dark:text-slate-400 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
              Data from: {derived?.fileName}
            </div>
          ) : (
            <button
              onClick={() => navigate('/upload')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload CSV for live data
            </button>
          )
        }
      />

      {/* Upload Prompt Banner */}
      {!hasData && (
        <div
          onClick={() => navigate('/upload')}
          className="p-4 rounded-xl bg-gradient-to-r from-primary-600/10 via-purple-600/10 to-pink-600/10 border border-primary-500/20 cursor-pointer hover:border-primary-500/40 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p className="text-sm font-semibold dark:text-white text-slate-900">Upload your data for real-time analytics</p>
              <p className="text-xs dark:text-slate-400 text-slate-500">Currently showing demo data · Click to upload CSV and see your real business insights</p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title={hasData ? 'Total Records' : 'Total Visitors Today'}
          value={kpis.totalVisitors}
          change={kpis.visitorsChange}
          changeLabel={hasData ? 'from CSV' : 'vs yesterday'}
          icon={Users}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
          delay={0}
        />
        <StatCard
          title={hasData ? 'Total Value' : 'Total Sales Today'}
          value={kpis.totalSales}
          change={kpis.salesChange}
          changeLabel={hasData ? 'aggregated' : 'vs yesterday'}
          icon={ShoppingBag}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          prefix="₹"
          delay={100}
        />
        <StatCard
          title="Avg. Order Value"
          value={kpis.avgOrderValue}
          change={kpis.avgOrderChange}
          changeLabel={hasData ? 'per record' : 'vs last week'}
          icon={TrendingUp}
          iconColor="text-primary-400"
          iconBg="bg-primary-500/10"
          prefix="₹"
          delay={200}
        />
        <StatCard
          title={hasData ? 'Unique Categories' : 'Conversion Rate'}
          value={hasData ? (derived?.categoricalColumns.length || 0) : kpis.conversionRate}
          change={kpis.conversionChange}
          changeLabel={hasData ? 'detected' : 'vs last week'}
          icon={Activity}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
          suffix={hasData ? '' : '%'}
          delay={300}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Trend Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title={hasData && tsData ? 'Data Trend Over Time' : "Today's Visitor & Sales Trend"}
            subtitle={hasData && tsData ? 'From your uploaded dataset' : 'Hourly breakdown across all branches'}
            filters={hasData ? undefined : ['Today', 'Week', 'Month']}
          >
            <ResponsiveContainer width="100%" height={260}>
              {hasData && tsData ? (
                <AreaChart data={tsData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="csvTrendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" name="Value" stroke="#6366f1" fill="url(#csvTrendGrad)" strokeWidth={2.5} dot={false} />
                </AreaChart>
              ) : (
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
              )}
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Category Distribution Pie */}
        <ChartCard
          title={hasData ? 'Data Distribution' : 'Sales by Category'}
          subtitle={hasData ? 'From uploaded CSV' : "Today's distribution"}
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [value, '']}
                contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {categoryData.map((item: any, i: number) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs dark:text-slate-400 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color || COLORS[i % COLORS.length] }} />
                {item.name} ({item.value})
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Bar Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard
          title={hasData ? 'Top Categories by Value' : 'Branch Performance'}
          subtitle={hasData ? 'From your CSV data' : 'Top 6 branches by revenue'}
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => formatINR(v)} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} width={110} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" name="Value" radius={[0, 6, 6, 0]}>
                {barData.map((_: any, i: number) => (
                  <Cell key={i} fill={`hsl(${250 + i * 15}, 80%, ${65 - i * 5}%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Weekly Revenue Growth"
          subtitle={hasData ? 'Historical comparison' : 'vs target and last year'}
          filters={['8W', '12W', '6M']}
        >
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weeklyGrowthData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/100000}L`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" fill="url(#revGrad)" strokeWidth={2.5} dot={false} />
              <Area type="monotone" dataKey="target" name="Target" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" fill="none" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top Items Table */}
      <ChartCard
        title={hasData ? 'Top Records by Value' : 'Top Selling Products'}
        subtitle={hasData ? `From ${derived?.fileName}` : 'Across all branches today'}
      >
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{hasData ? 'Item' : 'Product'}</th>
                <th>{hasData ? 'Category' : 'Category'}</th>
                <th>{hasData ? 'Value' : 'Units Sold'}</th>
                {!hasData && <th>Revenue</th>}
                {!hasData && <th>Trend</th>}
              </tr>
            </thead>
            <tbody>
              {(hasData ? topProducts.slice(0, 8) : mockTopProducts).map((p: any, i: number) => (
                <tr key={hasData ? p.idx : p.name}>
                  <td className="dark:text-slate-500 text-slate-400 font-mono text-xs">{String(i + 1).padStart(2, '0')}</td>
                  <td className="dark:text-white text-slate-900 font-medium">{p.name}</td>
                  <td>
                    <Badge variant={i % 3 === 0 ? 'info' : i % 3 === 1 ? 'purple' : 'success'}>
                      {p.category}
                    </Badge>
                  </td>
                  <td className="dark:text-slate-300 text-slate-700 font-medium">
                    {hasData ? p.value.toLocaleString('en-IN') : p.sales.toLocaleString('en-IN')}
                  </td>
                  {!hasData && (
                    <>
                      <td className="dark:text-slate-300 text-slate-700 font-medium">{formatINR(p.revenue)}</td>
                      <td>
                        <span className={`text-xs font-semibold ${p.trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {p.trend > 0 ? '+' : ''}{p.trend}%
                        </span>
                      </td>
                    </>
                  )}
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
