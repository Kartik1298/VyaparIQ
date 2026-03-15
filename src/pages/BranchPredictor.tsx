import React, { useState, useEffect, useRef } from 'react'
import { Brain, MapPin, TrendingUp, Building2, CheckCircle, Navigation, Layers } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import ChartCard from '../components/ui/ChartCard'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import { expansionRecommendations } from '../data/mockData'

// Fix Leaflet marker icons in Vite/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom icons for existing and recommended locations
const existingIcon = new L.DivIcon({
  html: `<div style="
    width:28px;height:28px;border-radius:50%;
    background:linear-gradient(135deg,#6366f1,#8b5cf6);
    border:3px solid #fff;box-shadow:0 2px 12px rgba(99,102,241,0.5);
    display:flex;align-items:center;justify-content:center;
    color:#fff;font-weight:900;font-size:11px;font-family:system-ui;
  "></div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16],
})

const recommendedIcon = new L.DivIcon({
  html: `<div style="
    width:30px;height:30px;border-radius:50%;
    background:linear-gradient(135deg,#f59e0b,#f97316);
    border:3px dashed #fbbf24;box-shadow:0 2px 14px rgba(245,158,11,0.5);
    display:flex;align-items:center;justify-content:center;
    color:#fff;font-weight:900;font-size:16px;font-family:system-ui;
    animation:pulse-glow 2s infinite;
  ">+</div>`,
  className: '',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -18],
})

const selectedIcon = new L.DivIcon({
  html: `<div style="
    width:36px;height:36px;border-radius:50%;
    background:linear-gradient(135deg,#ef4444,#f97316);
    border:3px solid #fef3c7;box-shadow:0 0 20px rgba(239,68,68,0.6);
    display:flex;align-items:center;justify-content:center;
    color:#fff;font-weight:900;font-size:13px;font-family:system-ui;
  ">★</div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20],
})

// Indian cities with real lat/lng
const indianCities = [
  { city: 'Mumbai', lat: 19.076, lng: 72.8777, existing: true, branches: 5 },
  { city: 'Delhi', lat: 28.7041, lng: 77.1025, existing: true, branches: 4 },
  { city: 'Bangalore', lat: 12.9716, lng: 77.5946, existing: true, branches: 3 },
  { city: 'Chennai', lat: 13.0827, lng: 80.2707, existing: true, branches: 3 },
  { city: 'Hyderabad', lat: 17.385, lng: 78.4867, existing: true, branches: 2 },
  { city: 'Pune', lat: 18.5204, lng: 73.8567, existing: true, branches: 2 },
  { city: 'Kolkata', lat: 22.5726, lng: 88.3639, existing: true, branches: 2 },
  { city: 'Jaipur', lat: 26.9124, lng: 75.7873, existing: true, branches: 1 },
  { city: 'Ahmedabad', lat: 23.0225, lng: 72.5714, existing: false, score: 92 },
  { city: 'Lucknow', lat: 26.8467, lng: 80.9462, existing: false, score: 87 },
  { city: 'Chandigarh', lat: 30.7333, lng: 76.7794, existing: false, score: 85 },
  { city: 'Kochi', lat: 9.9312, lng: 76.2673, existing: false, score: 82 },
  { city: 'Indore', lat: 22.7196, lng: 75.8577, existing: false, score: 80 },
]

// Map style selector
const mapStyles = [
  { name: 'Blueprint', url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', attr: '&copy; CARTO' },
  { name: 'Classic', url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', attr: '&copy; CARTO' },
  { name: 'Satellite', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attr: '&copy; Esri' },
]

// Component to recenter map when selected city changes
const MapRecenter: React.FC<{ lat: number; lng: number; zoom: number }> = ({ lat, lng, zoom }) => {
  const map = useMap()
  useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 1.2 })
  }, [lat, lng, zoom, map])
  return null
}

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
  const [mapStyle, setMapStyle] = useState(0)
  const selected = expansionRecommendations.find(c => c.city === selectedCity)
  const selectedCityData = indianCities.find(c => c.city === selectedCity)

  const mapCenter: [number, number] = selectedCityData
    ? [selectedCityData.lat, selectedCityData.lng]
    : [22.5, 78.9]
  const mapZoom = selectedCityData ? 10 : 5

  return (
    <div className="space-y-7">
      <style>{`
        .blueprint-map .leaflet-container {
          background: #0f172a !important;
          border-radius: 12px;
        }
        .blueprint-map .leaflet-tile-pane {
          filter: saturate(0.35) brightness(0.8) contrast(1.1);
        }
        .blueprint-map.style-0 .leaflet-tile-pane {
          filter: saturate(0.15) brightness(0.85) contrast(1.15) hue-rotate(200deg);
        }
        .blueprint-map.style-1 .leaflet-tile-pane {
          filter: saturate(0.7) brightness(0.95) contrast(1.05);
        }
        .blueprint-map.style-2 .leaflet-tile-pane {
          filter: saturate(0.8) brightness(0.9) contrast(1.1);
        }
        .leaflet-popup-content-wrapper {
          background: rgba(15, 23, 42, 0.95) !important;
          color: #e2e8f0 !important;
          border: 1px solid rgba(99,102,241,0.3) !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
          backdrop-filter: blur(12px) !important;
        }
        .leaflet-popup-tip {
          background: rgba(15, 23, 42, 0.95) !important;
        }
        .leaflet-popup-content {
          margin: 10px 14px !important;
          font-family: 'Inter', system-ui, sans-serif !important;
        }
        .leaflet-control-zoom a {
          background: rgba(15, 23, 42, 0.9) !important;
          color: #94a3b8 !important;
          border-color: rgba(99,102,241,0.2) !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(99, 102, 241, 0.3) !important;
          color: #fff !important;
        }
        .leaflet-control-attribution {
          background: rgba(15, 23, 42, 0.7) !important;
          color: #475569 !important;
          font-size: 9px !important;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 8px rgba(245,158,11,0.4); }
          50% { box-shadow: 0 0 20px rgba(245,158,11,0.7); }
        }
      `}</style>

      <PageHeader
        title="AI Branch Location Predictor"
        subtitle="Find the best Indian cities to expand your retail presence"
        icon={<Brain className="w-6 h-6 text-purple-400" />}
        badge="AI Powered"
        badgeColor="primary"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Interactive Map */}
        <div className="lg:col-span-2">
          <ChartCard
            title="India Expansion Map"
            subtitle="● Existing branches  ◎ Recommended locations"
            actions={
              <div className="flex items-center gap-1.5">
                {mapStyles.map((s, i) => (
                  <button
                    key={s.name}
                    onClick={() => setMapStyle(i)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      mapStyle === i
                        ? 'bg-primary-500 text-white'
                        : 'dark:bg-white/5 bg-slate-100 dark:text-slate-400 text-slate-600 dark:hover:bg-white/10 hover:bg-slate-200'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            }
          >
            <div className={`blueprint-map style-${mapStyle} rounded-xl overflow-hidden border dark:border-white/10 border-slate-200`} style={{ height: 420 }}>
              <MapContainer
                center={[22.5, 78.9]}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
                scrollWheelZoom={true}
              >
                <TileLayer url={mapStyles[mapStyle].url} attribution={mapStyles[mapStyle].attr} />
                <MapRecenter lat={mapCenter[0]} lng={mapCenter[1]} zoom={mapZoom} />

                {/* Existing branch markers */}
                {indianCities.filter(c => c.existing).map(city => (
                  <React.Fragment key={city.city}>
                    <Marker
                      position={[city.lat, city.lng]}
                      icon={existingIcon}
                    >
                      <Popup>
                        <div style={{ minWidth: 160 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1' }} />
                            <strong style={{ fontSize: 13, color: '#e2e8f0' }}>{city.city}</strong>
                          </div>
                          <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6 }}>
                            <div>Status: <span style={{ color: '#10b981', fontWeight: 600 }}>Active</span></div>
                            <div>Branches: <span style={{ color: '#fff', fontWeight: 700 }}>{city.branches}</span></div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                    {/* Coverage radius circle */}
                    <Circle
                      center={[city.lat, city.lng]}
                      radius={50000}
                      pathOptions={{
                        color: '#6366f1',
                        fillColor: '#6366f1',
                        fillOpacity: 0.06,
                        weight: 1,
                        dashArray: '4, 4',
                      }}
                    />
                  </React.Fragment>
                ))}

                {/* Recommended expansion markers */}
                {indianCities.filter(c => !c.existing).map(city => {
                  const recData = expansionRecommendations.find(r => r.city === city.city)
                  return (
                    <React.Fragment key={city.city}>
                      <Marker
                        position={[city.lat, city.lng]}
                        icon={selectedCity === city.city ? selectedIcon : recommendedIcon}
                        eventHandlers={{
                          click: () => setSelectedCity(
                            selectedCity === city.city ? null : city.city
                          ),
                        }}
                      >
                        <Popup>
                          <div style={{ minWidth: 180 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                              <strong style={{ fontSize: 13, color: '#e2e8f0' }}>{city.city}</strong>
                            </div>
                            <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.8 }}>
                              <div>Status: <span style={{ color: '#f59e0b', fontWeight: 600 }}>Recommended</span></div>
                              <div>AI Score: <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: 14 }}>{(city as any).score}/100</span></div>
                              {recData && (
                                <>
                                  <div>Population: <span style={{ color: '#e2e8f0' }}>{recData.population}</span></div>
                                  <div>Demand: <span style={{ color: '#10b981' }}>{recData.demand}</span></div>
                                  <div>Competition: <span style={{ color: '#ef4444' }}>{recData.competition}</span></div>
                                </>
                              )}
                            </div>
                            {recData && (
                              <div style={{ marginTop: 8, padding: '6px 8px', background: 'rgba(99,102,241,0.1)', borderRadius: 8, fontSize: 10, color: '#a5b4fc', lineHeight: 1.4 }}>
                                {recData.reason}
                              </div>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                      {/* Pulsing recommended zone */}
                      <Circle
                        center={[city.lat, city.lng]}
                        radius={40000}
                        pathOptions={{
                          color: '#f59e0b',
                          fillColor: '#f59e0b',
                          fillOpacity: 0.04,
                          weight: 1.5,
                          dashArray: '6, 3',
                        }}
                      />
                    </React.Fragment>
                  )
                })}
              </MapContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-3 text-xs dark:text-slate-400 text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 border-2 border-white shadow" />
                Existing branches
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-dashed border-amber-300" />
                AI Recommended
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full border border-dashed border-primary-400 bg-primary-500/10" />
                Coverage radius
              </div>
            </div>
          </ChartCard>
        </div>

        {/* City Detail Panel */}
        <ChartCard title="Expansion Analysis" subtitle={selected ? `City: ${selected.city}` : 'Click a ◎ marker for details'}>
          {selected ? (
            <div className="space-y-4">
              <div className="text-center p-4 rounded-xl bg-gradient-to-br dark:from-amber-500/10 dark:to-orange-500/5 from-amber-50 to-orange-50 border dark:border-amber-500/20 border-amber-200">
                <p className="text-5xl font-black font-display text-amber-400">{selected.score}</p>
                <p className="text-sm dark:text-slate-400 text-slate-500 mt-1">Expansion Score / 100</p>
                <Badge variant={selected.score >= 90 ? 'success' : selected.score >= 80 ? 'warning' : 'info'} className="mt-2">
                  {selected.score >= 90 ? 'Highly Recommended' : selected.score >= 80 ? 'Recommended' : 'Under Review'}
                </Badge>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Population', value: selected.population, icon: '👥' },
                  { label: 'Demand Level', value: selected.demand, icon: '📈' },
                  { label: 'Competition', value: selected.competition, icon: '⚔️' },
                ].map(m => (
                  <div key={m.label} className="flex items-center justify-between py-2.5 px-3 rounded-lg dark:bg-white/3 bg-slate-50 border dark:border-white/5 border-slate-200">
                    <span className="text-sm dark:text-slate-400 text-slate-500 flex items-center gap-2">
                      <span>{m.icon}</span> {m.label}
                    </span>
                    <Badge variant={m.value === 'High' ? 'success' : m.value === 'Medium' ? 'warning' : 'danger'}>
                      {m.value}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl dark:bg-primary-500/5 bg-primary-50 border border-primary-500/20">
                <div className="flex items-start gap-2">
                  <Brain className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs dark:text-primary-300 text-primary-700 leading-relaxed">{selected.reason}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCity(null)}
                className="w-full py-2 rounded-lg text-xs font-medium dark:bg-white/5 bg-slate-100 dark:text-slate-400 text-slate-600 dark:hover:bg-white/10 hover:bg-slate-200 transition-all"
              >
                Back to overview
              </button>
            </div>
          ) : (
            <div className="text-center py-14 space-y-3">
              <div className="relative inline-block">
                <MapPin className="w-12 h-12 dark:text-slate-600 text-slate-400" />
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              </div>
              <p className="text-sm dark:text-slate-400 text-slate-500">Click any <span className="text-amber-400 font-semibold">orange marker</span> on the map to see detailed AI expansion analysis</p>
              <p className="text-xs dark:text-slate-500 text-slate-400">{indianCities.filter(c => !c.existing).length} recommended cities available</p>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Top Cities Bar Chart */}
      <ChartCard title="Top 5 Recommended Cities" subtitle="AI-driven expansion score ranking">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={expansionRecommendations}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="city" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[70, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="score"
              name="AI Score"
              radius={[6, 6, 0, 0]}
              cursor="pointer"
              onClick={(data: any) => setSelectedCity(data.city)}
            >
              {expansionRecommendations.map((entry, i) => (
                <Cell
                  key={i}
                  fill={selectedCity === entry.city
                    ? '#f59e0b'
                    : `hsl(${260 + i * 15}, 75%, ${65 - i * 5}%)`
                  }
                  stroke={selectedCity === entry.city ? '#fbbf24' : 'transparent'}
                  strokeWidth={2}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

export default BranchPredictor
