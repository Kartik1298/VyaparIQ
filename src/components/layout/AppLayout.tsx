import React, { useState, useCallback, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import OnboardingTutorial from '../onboarding/OnboardingTutorial'
import AIAssistantButton from '../ui/AIAssistantButton'
import InteractiveTutorial from '../onboarding/InteractiveTutorial'
import AIAvatar from '../onboarding/AIAvatar'
import NotificationSystem from '../onboarding/NotificationSystem'
import { useTutorial, useTutorialSection, TutorialStep } from '../../context/TutorialContext'

/* ─── Default tutorial steps mapped to 6 dashboard sections ─── */
const defaultSteps: TutorialStep[] = [
  {
    id: 'overview-kpis',
    sectionId: 'overview-kpis',
    title: 'Key Performance Indicators',
    description: 'Your most important business metrics at a glance — total revenue, visitors, conversion rate, and average order value. These update in real-time when you upload your own data.',
    avatarMessage: '👋 Hi there! These are your KPIs — the heartbeat of your business. Keep an eye on these daily!',
    route: '/',
  },
  {
    id: 'overview-charts',
    sectionId: 'overview-charts',
    title: 'Revenue & Visitor Trends',
    description: 'Track how your sales and foot traffic change over time. Charts adapt based on your uploaded dataset — daily, weekly, or monthly view.',
    avatarMessage: '📈 Charts tell stories! Look for peaks — they often align with promotions or festivals.',
    route: '/',
  },
  {
    id: 'overview-insights',
    sectionId: 'overview-insights',
    title: 'Smart AI Insights & Alerts',
    description: 'AI-generated alerts and business health indicators. These adapt dynamically when you upload a dataset, showing personalized recommendations.',
    avatarMessage: '🧠 These insights are AI-powered! Upload your real data to get personalized alerts.',
    route: '/',
  },
  {
    id: 'crowd-section',
    sectionId: 'crowd-section',
    title: 'Crowd Analytics',
    description: 'Monitor live CCTV feeds, view crowd density heatmaps, and analyze footfall patterns across all your branches. Use tabs to switch between views.',
    avatarMessage: '👥 Crowd analytics help you optimize staff scheduling. Peak hours = more staff needed!',
    route: '/crowd-analytics',
  },
  {
    id: 'sales-section',
    sectionId: 'sales-section',
    title: 'Sales & Customer Insights',
    description: 'Dive into product performance, customer behavior, basket analysis, and peak hour optimization. Each tab reveals powerful business insights.',
    avatarMessage: '🛒 Did you know? Basket analysis can reveal hidden product combinations that boost sales!',
    route: '/sales',
  },
  {
    id: 'dataset-section',
    sectionId: 'dataset-section',
    title: 'Upload Your Own Data',
    description: 'Upload CSV/Excel files and watch the entire platform transform with YOUR business data. All charts, insights, and predictions adapt automatically.',
    avatarMessage: '📂 This is where the magic starts! Upload your sales data and everything else personalizes itself.',
    route: '/dataset',
  },
]

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const location = useLocation()
  const {
    isTutorialActive, startTutorial, setSteps,
    addNotification, registeredSections,
  } = useTutorial()

  // Register dashboard sections that are on the main "/" route
  // (these are always mounted when Dashboard is rendered)
  useTutorialSection('overview-kpis')
  useTutorialSection('overview-charts')
  useTutorialSection('overview-insights')

  // Show first-time onboarding overlay
  useEffect(() => {
    const tutorialComplete = localStorage.getItem('vyapaarIQ_tutorial_complete')
    if (!tutorialComplete) {
      const timer = setTimeout(() => setShowOnboarding(true), 600)
      return () => clearTimeout(timer)
    }
  }, [])

  // When onboarding overlay completes → start interactive tutorial
  const handleOnboardingComplete = useCallback(() => {
    localStorage.setItem('vyapaarIQ_tutorial_complete', 'true')
    setShowOnboarding(false)

    // Start interactive tutorial after a short pause
    setTimeout(() => {
      setSteps(defaultSteps)
      startTutorial()
    }, 800)
  }, [setSteps, startTutorial])

  // Restart full tutorial flow
  const handleRestartTutorial = useCallback(() => {
    localStorage.removeItem('vyapaarIQ_tutorial_complete')
    setSteps(defaultSteps)
    startTutorial()
  }, [setSteps, startTutorial])

  // Demo: Fire some welcome notifications after first login
  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('vyapaarIQ_welcome_notifs')
    if (hasSeenWelcome) return
    sessionStorage.setItem('vyapaarIQ_welcome_notifs', 'true')

    const timers = [
      setTimeout(() => {
        addNotification({
          title: '📊 Upload Your Data',
          message: 'Upload a CSV file to see personalized analytics across all sections.',
          type: 'insight',
          route: '/dataset',
          autoDismissMs: 10000,
        })
      }, 3000),
      setTimeout(() => {
        addNotification({
          title: '🔥 High Traffic Detected',
          message: 'Main branch visitor count is 34% above average. Consider adding extra staff.',
          type: 'warning',
          route: '/crowd-analytics',
          autoDismissMs: 8000,
        })
      }, 7000),
      setTimeout(() => {
        addNotification({
          title: '✅ System Ready',
          message: 'All analytics modules are loaded and operational.',
          type: 'success',
          // No route — clicking does nothing (demonstrates no-redirect behavior)
          autoDismissMs: 5000,
        })
      }, 12000),
      setTimeout(() => {
        addNotification({
          title: '💡 Pro Tip',
          message: 'Use the AI chatbot to navigate anywhere in the dashboard instantly.',
          type: 'info',
          // No route — info-only notification
          autoDismissMs: 7000,
        })
      }, 16000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [addNotification])

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

      {/* AI Assistant Chatbot */}
      <AIAssistantButton onRestartTutorial={handleRestartTutorial} />

      {/* Interactive Tutorial Overlay (highlight/dim) */}
      <InteractiveTutorial />

      {/* AI Avatar (always visible — shows tutorial hints during active tutorial, idle prompt otherwise) */}
      <AIAvatar />

      {/* Notification Toasts */}
      <NotificationSystem />

      {/* First-time Onboarding Overlay */}
      {showOnboarding && (
        <OnboardingTutorial onComplete={handleOnboardingComplete} />
      )}
    </div>
  )
}

export default AppLayout
