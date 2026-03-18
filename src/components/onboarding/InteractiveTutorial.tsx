import React, { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, ArrowLeft, X, Sparkles } from 'lucide-react'
import { useTutorial } from '../../context/TutorialContext'

/* ───────────────────────────────────────────
   Highlight / Dim calculation
   ─────────────────────────────────────────── */
function getSectionRect(sectionId: string): DOMRect | null {
  const el = document.querySelector(`[data-tutorial-section="${sectionId}"]`)
  return el ? el.getBoundingClientRect() : null
}

/* ───────────────────────────────────────────
   InteractiveTutorial Component
   ─────────────────────────────────────────── */
const InteractiveTutorial: React.FC = () => {
  const {
    isTutorialActive, currentStep, currentStepIndex, activeSteps,
    nextStep, prevStep, skipTutorial,
  } = useTutorial()

  const navigate = useNavigate()
  const location = useLocation()
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const recalcRef = useRef<number>(0)

  // Navigate to the step's route when step changes
  useEffect(() => {
    if (!isTutorialActive || !currentStep) return
    if (currentStep.route && location.pathname !== currentStep.route) {
      navigate(currentStep.route)
    }
  }, [isTutorialActive, currentStep, navigate, location.pathname])

  // Recalculate highlight rect on step change, resize, scroll
  const recalculate = useCallback(() => {
    if (!currentStep) { setHighlightRect(null); return }
    // brief delay for route change DOM to settle
    const timer = setTimeout(() => {
      const rect = getSectionRect(currentStep.sectionId)
      setHighlightRect(rect)
      setTransitioning(false)
    }, 250)
    return () => clearTimeout(timer)
  }, [currentStep])

  useEffect(() => {
    if (!isTutorialActive) return
    setTransitioning(true)
    const cleanup = recalculate()
    return cleanup
  }, [currentStep, isTutorialActive, recalculate])

  // Recalc on resize / scroll
  useEffect(() => {
    if (!isTutorialActive) return
    const handler = () => {
      cancelAnimationFrame(recalcRef.current)
      recalcRef.current = requestAnimationFrame(() => {
        if (currentStep) setHighlightRect(getSectionRect(currentStep.sectionId))
      })
    }
    window.addEventListener('resize', handler)
    window.addEventListener('scroll', handler, true)
    return () => {
      window.removeEventListener('resize', handler)
      window.removeEventListener('scroll', handler, true)
      cancelAnimationFrame(recalcRef.current)
    }
  }, [isTutorialActive, currentStep])

  // Scroll highlighted section into view
  useEffect(() => {
    if (!isTutorialActive || !currentStep) return
    const timer = setTimeout(() => {
      const el = document.querySelector(`[data-tutorial-section="${currentStep.sectionId}"]`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 350)
    return () => clearTimeout(timer)
  }, [isTutorialActive, currentStep])

  if (!isTutorialActive || !currentStep) return null

  const isFirst = currentStepIndex === 0
  const isLast = currentStepIndex === activeSteps.length - 1
  const padding = 12

  // Position the tooltip card below or above the highlighted section
  const getTooltipStyle = (): React.CSSProperties => {
    if (!highlightRect) {
      return { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    }
    const { top, left, width, height } = highlightRect
    const spaceBelow = window.innerHeight - (top + height)
    const cardWidth = 420

    let tooltipTop: number
    let tooltipLeft = Math.max(16, Math.min(left, window.innerWidth - cardWidth - 16))

    if (spaceBelow > 220) {
      tooltipTop = top + height + padding + 16
    } else {
      tooltipTop = Math.max(16, top - padding - 220)
    }

    return { position: 'fixed', top: tooltipTop, left: tooltipLeft, maxWidth: cardWidth }
  }

  return (
    <>
      {/* ── Dim overlay — pointer-events: none so clicks pass through ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000]"
        style={{
          backgroundColor: 'rgba(2, 6, 23, 0.55)',
          backdropFilter: 'blur(1px)',
          pointerEvents: 'none',          // clicks pass through to dashboard
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* ── Highlight ring around section ── */}
      {highlightRect && !transitioning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed z-[1001] pointer-events-none rounded-2xl"
          style={{
            top: highlightRect.top - padding,
            left: highlightRect.left - padding,
            width: highlightRect.width + padding * 2,
            height: highlightRect.height + padding * 2,
            border: '2px solid rgba(99, 102, 241, 0.5)',
            boxShadow: '0 0 30px rgba(99, 102, 241, 0.2), 0 0 60px rgba(99, 102, 241, 0.1), inset 0 0 30px rgba(99, 102, 241, 0.05)',
            transition: 'top 0.5s ease, left 0.5s ease, width 0.5s ease, height 0.5s ease',
          }}
        >
          {/* The highlighted section is fully opaque / clickable */}
          <div
            className="absolute rounded-2xl"
            style={{
              top: -2,
              left: -2,
              width: highlightRect.width + padding * 2 + 4,
              height: highlightRect.height + padding * 2 + 4,
              // The actual content below this shine is exposed naturally because overlay has pointer-events: none
              background: 'transparent',
            }}
          />
          {/* Pulsing corners */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl border-2 border-primary-400/30"
          />
        </motion.div>
      )}

      {/* ── Tooltip Card ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="z-[1002] w-full"
          style={{ ...(getTooltipStyle() as any), pointerEvents: 'auto' }}
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.1)',
            }}
          >
            {/* Progress bar */}
            <div className="h-1 bg-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStepIndex + 1) / activeSteps.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <div className="p-5">
              {/* Step badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-500/15 text-primary-400 border border-primary-500/20">
                  <Sparkles className="w-3 h-3" />
                  Step {currentStepIndex + 1} of {activeSteps.length}
                </span>
                {currentStep.route && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {currentStep.route}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{currentStep.title}</h3>

              {/* Description */}
              <p className="text-sm text-white/55 leading-relaxed mb-5">{currentStep.description}</p>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {!isFirst && (
                    <button
                      onClick={prevStep}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                  )}
                  <button
                    onClick={skipTutorial}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white/40 hover:text-white/60 transition-all"
                  >
                    <X className="w-3 h-3" /> Skip
                  </button>
                </div>

                <button
                  onClick={nextStep}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-primary-500 to-purple-600 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all"
                >
                  {isLast ? 'Finish' : 'Next'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default InteractiveTutorial
