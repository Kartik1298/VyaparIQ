import React, { useState } from 'react'
import { Globe, Link, TrendingUp, Search } from 'lucide-react'
import ChartCard from '../components/ui/ChartCard'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import { productRelationships } from '../data/mockData'

const ProductNetwork: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = productRelationships.filter(r =>
    !searchQuery ||
    r.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.target.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const highlighted = selected
    ? productRelationships.filter(r => r.source === selected || r.target === selected)
    : filtered

  // Get unique nodes
  const allNodes = Array.from(new Set(
    productRelationships.flatMap(r => [r.source, r.target])
  ))

  // Arrange nodes in a circle
  const nodePositions: Record<string, { x: number; y: number }> = {}
  allNodes.forEach((node, i) => {
    const angle = (i / allNodes.length) * 2 * Math.PI - Math.PI / 2
    const radius = 38
    nodePositions[node] = {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    }
  })

  const getStrengthColor = (s: number) => {
    if (s >= 0.85) return '#6366f1'
    if (s >= 0.7) return '#10b981'
    if (s >= 0.55) return '#f59e0b'
    return '#64748b'
  }

  return (
    <div className="space-y-7">
      <PageHeader
        title="Product Relationship Network"
        subtitle="Visualize products frequently bought together and cross-sell opportunities"
        icon={<Globe className="w-6 h-6 text-indigo-400" />}
        badge="Association Mining"
        badgeColor="primary"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Network Graph */}
        <div className="lg:col-span-2">
          <ChartCard title="Product Co-purchase Network" subtitle="Node size = sales volume · Edge thickness = association strength">
            <div className="relative w-full" style={{ paddingBottom: '75%' }}>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                {/* Edges */}
                {highlighted.map((rel, i) => {
                  const from = nodePositions[rel.source]
                  const to = nodePositions[rel.target]
                  if (!from || !to) return null
                  const isHigh = rel.strength >= 0.8
                  return (
                    <line
                      key={i}
                      x1={from.x} y1={from.y}
                      x2={to.x} y2={to.y}
                      stroke={getStrengthColor(rel.strength)}
                      strokeWidth={rel.strength * 0.8}
                      strokeOpacity={selected ? (rel.source === selected || rel.target === selected ? 1 : 0.1) : 0.7}
                      className="transition-all duration-300"
                    />
                  )
                })}
                {/* Nodes */}
                {allNodes.map(node => {
                  const pos = nodePositions[node]
                  const connections = productRelationships.filter(r => r.source === node || r.target === node).length
                  const r = 2 + connections * 0.3
                  const isSelected = selected === node
                  const isConnected = selected
                    ? productRelationships.some(rel => (rel.source === selected || rel.target === selected) && (rel.source === node || rel.target === node))
                    : true
                  return (
                    <g key={node} className="cursor-pointer" onClick={() => setSelected(isSelected ? null : node)}>
                      <circle
                        cx={pos.x} cy={pos.y} r={r + 1.5}
                        fill={isSelected ? '#6366f1' : '#1e293b'}
                        opacity={isConnected || !selected ? 1 : 0.2}
                        className="transition-all duration-300"
                      />
                      <circle
                        cx={pos.x} cy={pos.y} r={r}
                        fill={isSelected ? '#818cf8' : '#334155'}
                        stroke={isSelected ? '#6366f1' : '#475569'}
                        strokeWidth={0.5}
                        opacity={isConnected || !selected ? 1 : 0.2}
                        className="transition-all duration-300"
                      />
                      <text
                        x={pos.x} y={pos.y + r + 2.5}
                        textAnchor="middle"
                        fontSize="2.5"
                        fill={isSelected ? '#c7d2fe' : '#94a3b8'}
                        opacity={isConnected || !selected ? 1 : 0.2}
                        className="transition-all duration-300 select-none"
                      >
                        {node}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
            <p className="text-xs dark:text-slate-500 text-slate-400 text-center mt-2">Click a node to highlight its connections</p>
          </ChartCard>
        </div>

        {/* Relationship List */}
        <div className="space-y-5">
          <ChartCard title="Top Associations" subtitle="By strength score">
            <div className="mb-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 dark:text-slate-500 text-slate-400" />
              <input
                type="text"
                placeholder="Search products…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-lg dark:bg-white/5 bg-slate-100 border dark:border-white/10 border-slate-200 dark:text-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {[...filtered]
                .sort((a, b) => b.strength - a.strength)
                .map((rel, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all
                      ${selected === rel.source || selected === rel.target
                        ? 'dark:bg-primary-500/10 bg-primary-50 border border-primary-500/20'
                        : 'dark:hover:bg-white/5 hover:bg-slate-100'
                      }`}
                    onClick={() => setSelected(selected === rel.source ? null : rel.source)}
                  >
                    <Link className="w-3 h-3 flex-shrink-0" style={{ color: getStrengthColor(rel.strength) }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium dark:text-white text-slate-900 truncate">{rel.source} ↔ {rel.target}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="flex-1 h-1 dark:bg-white/10 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${rel.strength * 100}%`, backgroundColor: getStrengthColor(rel.strength) }} />
                        </div>
                        <span className="text-xs" style={{ color: getStrengthColor(rel.strength) }}>{(rel.strength * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </ChartCard>

          {selected && (
            <ChartCard title={`${selected} — Connections`} subtitle="All associated products">
              <div className="space-y-2">
                {productRelationships
                  .filter(r => r.source === selected || r.target === selected)
                  .map((r, i) => {
                    const partner = r.source === selected ? r.target : r.source
                    return (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg dark:bg-white/5 bg-slate-100">
                        <span className="text-sm dark:text-white text-slate-900">{partner}</span>
                        <Badge variant={r.strength >= 0.8 ? 'success' : r.strength >= 0.65 ? 'warning' : 'default'}>
                          {(r.strength * 100).toFixed(0)}% match
                        </Badge>
                      </div>
                    )
                  })}
              </div>
            </ChartCard>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductNetwork
