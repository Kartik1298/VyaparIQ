import React, { useState } from 'react'
import { Brain, MapPin, TrendingUp, Building2, CheckCircle } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import ChartCard from '../components/ui/ChartCard'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import { branchLocations, expansionRecommendations } from '../data/mockData'

const indianCitiesDemo = [
  { city: 'Mumbai', x: 24, y: 60, existing: true, branches: 5 },
  { city: 'Delhi', x: 42, y: 18, existing: true, branches: 4 },
  { city: 'Bangalore', x: 34, y: 73, existing: true, branches: 3 },
  { city: 'Chennai', x: 40, y: 78, existing: true, branches: 3 },
  { city: 'Hyderabad', x: 38, y: 62, existing: true, branches: 2 },
  { city: 'Pune', x: 27, y: 57, existing: true, branches: 2 },
  { city: 'Kolkata', x: 62, y: 40, existing: true, branches: 2 },
  { city: 'Jaipur', x: 38, y: 28, existing: true, branches: 1 },
  { city: 'Ahmedabad', x: 27, y: 42, existing: false, score: 92 },
  { city: 'Lucknow', x: 50, y: 28, existing: false, score: 87 },
  { city: 'Chandigarh', x: 40, y: 12, existing: false, score: 85 },
  { city: 'Kochi', x: 32, y: 82, existing: false, score: 82 },
  { city: 'Indore', x: 34, y: 42, existing: false, score: 80 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl p-3 border border-white/10 shadow-xl">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-white font-bold">Score: {payload[0]?.value}/100</p>
    </div>
  )
}

const BranchPredictor: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const selected = expansionRecommendations.find(c => c.city === selectedCity)

  return (
    <div className="space-y-7">
      <PageHeader
        title="AI Branch Location Predictor"
        subtitle="Find the best Indian cities to expand your retail presence"
        icon={<Brain className="w-6 h-6 text-purple-400" />}
        badge="AI Powered"
        badgeColor="primary"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* India Map */}
        <div className="lg:col-span-2">
          <ChartCard title="India Expansion Map" subtitle="● Existing branches  ◎ Recommended locations">
            <div className="relative w-full bg-gradient-to-br dark:from-slate-800/80 dark:to-slate-900/80 from-slate-100 to-slate-200 rounded-xl overflow-hidden border border-white/10"
              style={{ paddingBottom: '70%' }}>
              {/* India silhouette placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-4/5 relative">
                  {/* Simplified India map outline using SVG */}
                  <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
                    <path d="M35 10 L65 10 L75 25 L80 45 L70 65 L60 85 L50 95 L40 85 L30 65 L20 45 L25 25 Z"
                      fill="none" stroke="currentColor" strokeWidth="1"
                      className="dark:text-slate-400 text-slate-600" />
                  </svg>
                  {/* City dots */}
                  {indianCitiesDemo.map(city => (
                    <button
                      key={city.city}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                      style={{ left: `${city.x}%`, top: `${city.y}%` }}
                      onClick={() => setSelectedCity(city.existing ? null : selectedCity === city.city ? null : city.city)}
                    >
                      {city.existing ? (
                        <div className="relative">
                          <div className="w-4 h-4 rounded-full bg-primary-500 border-2 border-white shadow-lg shadow-primary-500/40 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{city.branches}</span>
                          </div>
                          <span className="absolute left-1/2 -translate-x-1/2 top-5 text-xs dark:text-white text-slate-900 font-semibold whitespace-nowrap bg-slate-900/80 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            {city.city}
                          </span>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className={`w-5 h-5 rounded-full border-2 border-dashed flex items-center justify-center transition-all ${
                            selectedCity === city.city ? 'bg-amber-500 border-amber-300 scale-125' : 'bg-amber-500/20 border-amber-400 hover:bg-amber-500/40'
                          }`}>
                            <span className="text-amber-300 text-xs font-bold">+</span>
                          </div>
                          <span className="absolute left-1/2 -translate-x-1/2 top-6 text-xs dark:text-white text-slate-900 font-semibold whitespace-nowrap bg-slate-900/80 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            {city.city} ({(city as any).score})
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 mt-3 text-xs dark:text-slate-400 text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary-500" /> Existing branches
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-amber-500/40 border border-dashed border-amber-400" /> Recommended expansion
              </div>
            </div>
          </ChartCard>
        </div>

        {/* City Detail */}
        <ChartCard title="Expansion Score" subtitle={selected ? `Detailed analysis: ${selected.city}` : 'Click a ◎ dot to see analysis'}>
          {selected ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-5xl font-black font-display text-amber-400">{selected.score}</p>
                <p className="text-sm dark:text-slate-400 text-slate-500">Expansion Score / 100</p>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Population', value: selected.population },
                  { label: 'Demand Level', value: selected.demand },
                  { label: 'Competition', value: selected.competition },
                ].map(m => (
                  <div key={m.label} className="flex justify-between py-2 border-b dark:border-white/5 border-slate-200">
                    <span className="text-sm dark:text-slate-400 text-slate-500">{m.label}</span>
                    <Badge variant={m.value === 'High' ? 'success' : m.value === 'Medium' ? 'warning' : 'danger'}>
                      {m.value}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl dark:bg-primary-500/5 bg-primary-50 border border-primary-500/20">
                <p className="text-xs dark:text-primary-300 text-primary-700">{selected.reason}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 dark:text-slate-500 text-slate-400">
              <MapPin className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Click a + dot on the map to see AI expansion analysis</p>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Expansion Recommendations Chart */}
      <ChartCard title="Top 5 Recommended Cities" subtitle="AI expansion score ranking">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={expansionRecommendations}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="city" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[70, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="score" name="AI Score" radius={[6, 6, 0, 0]}>
              {expansionRecommendations.map((_, i) => (
                <Cell key={i} fill={`hsl(${260 + i * 15}, 75%, ${65 - i * 5}%)`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

export default BranchPredictor
