import React, { useState } from 'react'
import { Navigation, ArrowRight, Users } from 'lucide-react'
import ChartCard from '../components/ui/ChartCard'
import PageHeader from '../components/ui/PageHeader'
import { customerJourneyData } from '../data/mockData'

// Build simple Sankey from paths
const nodes = Array.from(new Set([
  ...customerJourneyData.paths.map(p => p.from),
  ...customerJourneyData.paths.map(p => p.to),
]))

const journeySteps = [
  ['Entrance'],
  ['Electronics', 'Fashion', 'Groceries', 'Home & Living'],
  ['Accessories', 'FMCG', 'Beauty'],
  ['Billing'],
]

const pathColors = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#ec4899', '#06b6d4']

const topPaths = [
  { path: 'Entrance → Electronics → Accessories → Billing', count: 280, pct: '22%' },
  { path: 'Entrance → Fashion → Accessories → Billing', count: 220, pct: '17%' },
  { path: 'Entrance → Groceries → FMCG → Billing', count: 200, pct: '16%' },
  { path: 'Entrance → Fashion → Beauty → Billing', count: 100, pct: '8%' },
  { path: 'Entrance → Electronics → Billing', count: 170, pct: '13%' },
  { path: 'Entrance → Home & Living → Billing', count: 130, pct: '10%' },
]

const CustomerJourney: React.FC = () => {
  const [highlightPath, setHighlightPath] = useState<string | null>(null)

  return (
    <div className="space-y-7">
      <PageHeader
        title="Customer Journey Analytics"
        subtitle="Track how customers move through your store from entrance to billing"
        icon={<Navigation className="w-6 h-6 text-pink-400" />}
        badge="Flow Analysis"
        badgeColor="primary"
      />

      {/* Visual Journey Flow */}
      <ChartCard title="Customer Movement Flow" subtitle="Visitor paths from entrance to billing">
        <div className="overflow-x-auto py-4">
          <div className="flex items-center gap-2 min-w-[700px] justify-between">
            {journeySteps.map((step, si) => (
              <React.Fragment key={si}>
                <div className="flex flex-col gap-3">
                  {step.map((node, ni) => {
                    const incomingFlow = customerJourneyData.paths
                      .filter(p => p.to === node)
                      .reduce((a, b) => a + b.value, 0)
                    const outgoingFlow = customerJourneyData.paths
                      .filter(p => p.from === node)
                      .reduce((a, b) => a + b.value, 0)
                    const total = Math.max(incomingFlow, outgoingFlow, 100)
                    return (
                      <div
                        key={node}
                        className="rounded-xl p-3 text-center cursor-pointer transition-all hover:scale-105 border"
                        style={{
                          minWidth: 110,
                          backgroundColor: `${pathColors[ni % pathColors.length]}20`,
                          borderColor: `${pathColors[ni % pathColors.length]}40`,
                        }}
                      >
                        <p className="text-xs font-semibold dark:text-white text-slate-900">{node}</p>
                        <p className="text-xs mt-0.5" style={{ color: pathColors[ni % pathColors.length] }}>
                          {total} visitors
                        </p>
                      </div>
                    )
                  })}
                </div>
                {si < journeySteps.length - 1 && (
                  <div className="flex flex-col items-center">
                    <ArrowRight className="w-5 h-5 dark:text-slate-500 text-slate-400" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Flow connections */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {customerJourneyData.paths.slice(0, 6).map((path, i) => (
            <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg dark:bg-white/5 bg-slate-100">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: pathColors[i % pathColors.length] }} />
              <span className="text-xs dark:text-slate-300 text-slate-700">{path.from}</span>
              <ArrowRight className="w-3 h-3 dark:text-slate-500 text-slate-400 flex-shrink-0" />
              <span className="text-xs dark:text-slate-300 text-slate-700">{path.to}</span>
              <span className="ml-auto text-xs font-bold dark:text-white text-slate-900">{path.value}</span>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Top Customer Paths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Most Common Customer Paths" subtitle="Ranked by frequency">
          <div className="space-y-3">
            {topPaths.map((p, i) => (
              <div key={i} className="p-3 rounded-xl dark:bg-white/5 bg-slate-100 group hover:dark:bg-white/8 hover:bg-slate-200 transition-all">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-xs font-medium dark:text-white text-slate-900 leading-relaxed">{p.path}</p>
                  <span className="text-xs font-bold dark:text-white text-slate-900 flex-shrink-0">{p.pct}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 dark:bg-white/10 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: p.pct, backgroundColor: pathColors[i % pathColors.length] }}
                    />
                  </div>
                  <span className="text-xs dark:text-slate-400 text-slate-500">{p.count} visitors</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Zone Transition Analysis" subtitle="How traffic flows between zones">
          <div className="space-y-3 pt-2">
            {[
              { from: 'Entrance', to: 'Electronics', value: 450, width: '90%' },
              { from: 'Entrance', to: 'Fashion', value: 380, width: '76%' },
              { from: 'Entrance', to: 'Groceries', value: 320, width: '64%' },
              { from: 'Electronics', to: 'Accessories', value: 280, width: '56%' },
              { from: 'Fashion', to: 'Accessories', value: 220, width: '44%' },
              { from: 'Accessories', to: 'Billing', value: 420, width: '84%' },
            ].map((t, i) => (
              <div key={i} className="grid grid-cols-5 items-center gap-2">
                <p className="text-xs dark:text-slate-400 text-slate-500 text-right col-span-1 truncate">{t.from}</p>
                <ArrowRight className="w-3 h-3 dark:text-slate-600 text-slate-400" />
                <p className="text-xs dark:text-white text-slate-900 font-medium col-span-1 truncate">{t.to}</p>
                <div className="col-span-2 flex items-center gap-1.5">
                  <div className="flex-1 h-2 dark:bg-white/10 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-purple-500" style={{ width: t.width }} />
                  </div>
                  <span className="text-xs dark:text-slate-400 text-slate-500 w-8">{t.value}</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  )
}

export default CustomerJourney
