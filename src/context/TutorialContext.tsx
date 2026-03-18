import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode, useMemo } from 'react'

/* ─── Tutorial Step Definition ─── */
export interface TutorialStep {
  id: string
  sectionId: string          // matches data-tutorial-section on the DOM element
  title: string
  description: string
  avatarMessage: string      // what the AI avatar says
  route?: string             // optional: navigate to this route when step starts
  icon?: React.ElementType
}

/* ─── Notification Definition ─── */
export interface AppNotification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'insight'
  route?: string             // optional: clicking redirects here
  autoDismissMs?: number     // auto-dismiss duration, default 6000
  timestamp: number
}

/* ─── Context Shape ─── */
interface TutorialContextType {
  // Tutorial state
  isTutorialActive: boolean
  currentStepIndex: number
  currentStep: TutorialStep | null
  steps: TutorialStep[]
  activeSteps: TutorialStep[]   // steps filtered to registered sections
  startTutorial: () => void
  stopTutorial: () => void
  nextStep: () => void
  prevStep: () => void
  skipTutorial: () => void
  setSteps: (steps: TutorialStep[]) => void

  // Notifications
  notifications: AppNotification[]
  addNotification: (n: Omit<AppNotification, 'id' | 'timestamp'>) => void
  dismissNotification: (id: string) => void

  // Registered sections (for dynamic tutorial)
  registeredSections: string[]
  registerSection: (sectionId: string) => void
  unregisterSection: (sectionId: string) => void
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined)

export const TutorialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isTutorialActive, setIsTutorialActive] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [steps, setSteps] = useState<TutorialStep[]>([])
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [registeredSections, setRegisteredSections] = useState<string[]>([])

  // Filter steps to only include those whose sections are registered (dynamic adaptation)
  const activeSteps = useMemo(() => {
    if (registeredSections.length === 0) return steps // fallback: show all if none registered
    return steps.filter(s => registeredSections.includes(s.sectionId))
  }, [steps, registeredSections])

  const currentStep = useMemo(() => (
    isTutorialActive && activeSteps.length > 0 ? activeSteps[currentStepIndex] || null : null
  ), [isTutorialActive, activeSteps, currentStepIndex])

  const startTutorial = useCallback(() => {
    setCurrentStepIndex(0)
    setIsTutorialActive(true)
  }, [])

  const stopTutorial = useCallback(() => {
    setIsTutorialActive(false)
    setCurrentStepIndex(0)
  }, [])

  const nextStep = useCallback(() => {
    setCurrentStepIndex(prev => {
      if (prev >= activeSteps.length - 1) {
        setIsTutorialActive(false)
        return 0
      }
      return prev + 1
    })
  }, [activeSteps.length])

  const prevStep = useCallback(() => {
    setCurrentStepIndex(prev => Math.max(0, prev - 1))
  }, [])

  const skipTutorial = useCallback(() => {
    setIsTutorialActive(false)
    setCurrentStepIndex(0)
    localStorage.setItem('vyapaarIQ_tutorial_complete', 'true')
  }, [])

  const addNotification = useCallback((n: Omit<AppNotification, 'id' | 'timestamp'>) => {
    const notification: AppNotification = {
      ...n,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
    }
    setNotifications(prev => [...prev, notification])
  }, [])

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const registerSection = useCallback((sectionId: string) => {
    setRegisteredSections(prev => prev.includes(sectionId) ? prev : [...prev, sectionId])
  }, [])

  const unregisterSection = useCallback((sectionId: string) => {
    setRegisteredSections(prev => prev.filter(s => s !== sectionId))
  }, [])

  const value = useMemo(() => ({
    isTutorialActive, currentStepIndex, currentStep, steps, activeSteps,
    startTutorial, stopTutorial, nextStep, prevStep, skipTutorial, setSteps,
    notifications, addNotification, dismissNotification,
    registeredSections, registerSection, unregisterSection,
  }), [isTutorialActive, currentStepIndex, currentStep, steps, activeSteps, notifications, registeredSections,
    startTutorial, stopTutorial, nextStep, prevStep, skipTutorial, addNotification, dismissNotification,
    registerSection, unregisterSection])

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  )
}

export const useTutorial = (): TutorialContextType => {
  const ctx = useContext(TutorialContext)
  if (!ctx) throw new Error('useTutorial must be used inside TutorialProvider')
  return ctx
}

/* ─── Auto-register / unregister a section on mount/unmount ─── */
export const useTutorialSection = (sectionId: string) => {
  const { registerSection, unregisterSection } = useTutorial()
  useEffect(() => {
    registerSection(sectionId)
    return () => unregisterSection(sectionId)
  }, [sectionId, registerSection, unregisterSection])
}
