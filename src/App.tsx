import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import ProductAnalytics from './pages/ProductAnalytics'
import CrowdMonitoring from './pages/CrowdMonitoring'
import StoreHeatmap from './pages/StoreHeatmap'
import BranchAnalytics from './pages/BranchAnalytics'
import WarehouseAnalytics from './pages/WarehouseAnalytics'
import StaffAnalytics from './pages/StaffAnalytics'
import BranchPredictor from './pages/BranchPredictor'
import FestivalDemand from './pages/FestivalDemand'
import CompetitorMonitoring from './pages/CompetitorMonitoring'
import CustomerJourney from './pages/CustomerJourney'
import ProductNetwork from './pages/ProductNetwork'
import RealTimePanel from './pages/RealTimePanel'
import BusinessHealth from './pages/BusinessHealth'
import PremiumReports from './pages/PremiumReports'
import DataUpload from './pages/DataUpload'
import LayoutOptimizer from './pages/LayoutOptimizer'
import Settings from './pages/Settings'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<ProductAnalytics />} />
        <Route path="/crowd" element={<CrowdMonitoring />} />
        <Route path="/heatmap" element={<StoreHeatmap />} />
        <Route path="/branches" element={<BranchAnalytics />} />
        <Route path="/warehouse" element={<WarehouseAnalytics />} />
        <Route path="/staff" element={<StaffAnalytics />} />
        <Route path="/expansion" element={<BranchPredictor />} />
        <Route path="/festivals" element={<FestivalDemand />} />
        <Route path="/competitor" element={<CompetitorMonitoring />} />
        <Route path="/journey" element={<CustomerJourney />} />
        <Route path="/network" element={<ProductNetwork />} />
        <Route path="/realtime" element={<RealTimePanel />} />
        <Route path="/health" element={<BusinessHealth />} />
        <Route path="/premium" element={<PremiumReports />} />
        <Route path="/upload" element={<DataUpload />} />
        <Route path="/layout" element={<LayoutOptimizer />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
