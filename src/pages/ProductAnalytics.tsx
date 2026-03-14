import React, { useState } from 'react'
import { Package, TrendingUp, BarChart3, Share2 } from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Legend, RadarChart,
  PolarGrid, PolarAngleAxis, Radar
} from 'recharts'
import ChartCard from '../components/ui/ChartCard'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import { topProducts, productRelationships } from '../data/mockData'

const demandTrendData = [
  { month: 'Sep', electronics: 32000, fashion: 18000, groceries: 15000, beauty: 8000 },
  { month: 'Oct', electronics: 38000, fashion: 22000, groceries: 16500, beauty: 9500 },
  { month: 'Nov', electronics: 52000, fashion: 28000, groceries: 18000, beauty: 11000 },
  { month: 'Dec', electronics: 68000, fashion: 35000, groceries: 22000, beauty: 14000 },
  { month: 'Jan', electronics: 45000, fashion: 25000, groceries: 17000, beauty: 10000 },
  { month: 'Feb', electronics: 41000, fashion: 30000, groceries: 16000, beauty: 12000 },
  { month: 'Mar', electronics: 48000, fashion: 32000, groceries: 17500, beauty: 13000 },
]

const basketData = [
  { pair: 'Phone + Case', frequency: 892, lift: 4.2 },
  { pair: 'Laptop + Mouse', frequency: 756, lift: 3.8 },
  { pair: 'Shirt + Belt', frequency: 634, lift: 3.1 },
  { pair: 'Jeans + T-Shirt', frequency: 598, lift: 2.9 },
  { pair: 'Frame + Lens', frequency: 541, lift: 5.1 },
  { pair: 'Bread + Butter', frequency: 512, lift: 3.6 },
  { pair: 'Shampoo + Cond.', frequency: 478, lift: 4.0 },
  { pair: 'Milk + Cereal', frequency: 423, lift: 2.8 },
]

const branchProductData = [
  { branch: 'Mumbai', electronics: 88, fashion: 72, groceries: 65, beauty: 58 },
  { branch: 'Delhi', electronics: 82, fashion: 78, groceries: 70, beauty: 62 },
  { branch: 'Bangalore', electronics: 90, fashion: 65, groceries: 58, beauty: 55 },
  { branch: 'Chennai', electronics: 70, fashion: 80, groceries: 75, beauty: 68 },
  { branch: 'Hyderabad', electronics: 75, fashion: 70, groceries: 68, beauty: 60 },
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
          <span className="text-white font-semibold">{e.value?.toLocaleString?.('en-IN') ?? e.value}</span>
        </div>
      ))}
    </div>
  )
}

const ProductAnalytics: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filtered = selectedCategory === 'All'
    ? topProducts
    : topProducts.filter(p => p.category === selectedCategory)

  return (
    <div className="space-y-7">
      <PageHeader
        title="Product Analytics"
        subtitle="Demand trends, best sellers, and market basket analysis"
        icon={<Package className="w-6 h-6 text-blue-400" />}
        badge="AI Powered"
        badgeColor="primary"
      />

      {/* Top Products ranked */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {topProducts.slice(0, 3).map((p, i) => (
          <div key={p.name} className={`metric-card relative overflow-hidden ${
            i === 0 ? 'border-t-2 border-amber-400' : i === 1 ? 'border-t-2 border-slate-400' : 'border-t-2 border-amber-700'
          }`}>
            <div className="absolute top-3 right-3 text-4xl font-black opacity-10 dark:text-white text-slate-900">
              #{i + 1}
            </div>
            <Badge variant={i === 0 ? 'warning' : 'default'} size="sm">
              {i === 0 ? '🏆 Top Seller' : i === 1 ? '🥈 #2 Rank' : '🥉 #3 Rank'}
            </Badge>
            <h3 className="font-bold dark:text-white text-slate-900 mt-2 text-base">{p.name}</h3>
            <p className="text-xs dark:text-slate-400 text-slate-500 mb-3">{p.category}</p>
            <div className="flex justify-between">
              <div>
                <p className="text-2xl font-bold dark:text-white text-slate-900">{p.sales.toLocaleString('en-IN')}</p>
                <p className="text-xs dark:text-slate-400 text-slate-500">units sold</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${p.trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {p.trend > 0 ? '+' : ''}{p.trend}%
                </p>
                <p className="text-xs dark:text-slate-400 text-slate-500">growth</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Demand Trend & Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ChartCard title="Product Category Demand Trend" subtitle="Monthly demand across categories" filters={['6M', '1Y', '2Y']}>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={demandTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                <Line type="monotone" dataKey="electronics" name="Electronics" stroke="#6366f1" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="fashion" name="Fashion" stroke="#a855f7" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="groceries" name="Groceries" stroke="#10b981" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="beauty" name="Beauty" stroke="#ec4899" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="Branch Product Mix" subtitle="Category strength by branch">
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={branchProductData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="branch" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Radar name="Electronics" dataKey="electronics" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
              <Radar name="Fashion" dataKey="fashion" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Market Basket Analysis */}
      <ChartCard
        title="Market Basket Analysis"
        subtitle="Frequently bought together pairs — AI detected patterns"
        actions={
          <div className="flex items-center gap-1.5 text-xs dark:text-slate-400 text-slate-500">
            <Share2 className="w-3.5 h-3.5" /> Association Rules
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={basketData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="pair" tick={{ fill: '#94a3b8', fontSize: 11 }} width={110} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="frequency" name="Co-purchase Frequency" radius={[0, 6, 6, 0]}>
                {basketData.map((_, i) => (
                  <Cell key={i} fill={`hsl(${260 + i * 10}, 75%, ${65 - i * 3}%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold dark:text-white text-slate-900">AI Insights</h4>
            {basketData.slice(0, 5).map((item) => (
              <div key={item.pair} className="flex items-center justify-between p-3 rounded-xl dark:bg-white/5 bg-slate-100">
                <div>
                  <p className="text-sm font-medium dark:text-white text-slate-900">{item.pair}</p>
                  <p className="text-xs dark:text-slate-400 text-slate-500">{item.frequency} co-purchases</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary-400">{item.lift}x</p>
                  <p className="text-xs dark:text-slate-400 text-slate-500">lift score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>

      {/* Products Table */}
      <ChartCard title="All Products Performance" subtitle="Filtered by category"
        actions={
          <div className="flex gap-1">
            {['All', 'Electronics', 'Fashion', 'Groceries'].map(c => (
              <button key={c} onClick={() => setSelectedCategory(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === c ? 'bg-primary-500 text-white' : 'dark:text-slate-400 text-slate-600 dark:hover:bg-white/5 hover:bg-slate-100'
                }`}>
                {c}
              </button>
            ))}
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Units Sold</th>
                <th>Revenue</th>
                <th>Trend</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.name}>
                  <td className="dark:text-white text-slate-900 font-medium">{p.name}</td>
                  <td><Badge variant={p.category === 'Electronics' ? 'info' : p.category === 'Fashion' ? 'purple' : 'success'}>{p.category}</Badge></td>
                  <td className="dark:text-slate-300 text-slate-700">{p.sales.toLocaleString('en-IN')}</td>
                  <td className="dark:text-slate-300 text-slate-700">₹{(p.revenue / 100000).toFixed(1)}L</td>
                  <td>
                    <span className={`text-sm font-bold ${p.trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {p.trend > 0 ? '+' : ''}{p.trend}%
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full dark:bg-white/10 bg-slate-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-purple-500"
                          style={{ width: `${Math.min(100, (p.sales / 4600) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs dark:text-slate-400 text-slate-500 w-8">
                        {Math.round((p.sales / 4600) * 100)}%
                      </span>
                    </div>
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

export default ProductAnalytics
