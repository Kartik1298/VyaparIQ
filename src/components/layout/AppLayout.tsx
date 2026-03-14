import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen dark:bg-slate-950 bg-slate-50 transition-colors duration-300">
      {/* Background mesh gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-600/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-600/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-600/3 blur-3xl" />
      </div>

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <TopBar sidebarCollapsed={collapsed} />

      <main
        className={`transition-all duration-300 pt-16 min-h-screen ${collapsed ? 'pl-16' : 'pl-64'}`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppLayout
