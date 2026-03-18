import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, MessageCircle, HelpCircle, Play } from 'lucide-react'
import { useTutorial } from '../../context/TutorialContext'

/* ─── Typing indicator (bouncing dots) ─── */
const TypingDots: React.FC = () => (
  <div className="flex items-center gap-1 px-3 py-2">
    {[0, 1, 2].map(i => (
      <motion.div
        key={i}
        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        className="w-1.5 h-1.5 rounded-full bg-primary-400"
      />
    ))}
  </div>
)

/* ─── Face expressions for the avatar ─── */
type FaceExpression = 'happy' | 'thinking' | 'waving' | 'idle'

const AvatarFace: React.FC<{ expression: FaceExpression }> = ({ expression }) => {
  // Mouth variations
  const getMouth = () => {
    switch (expression) {
      case 'happy':
        return <div className="w-4 h-2 border-b-2 border-white/90 rounded-b-full mx-auto" />
      case 'waving':
        return <div className="w-3 h-3 rounded-full border-2 border-white/90 mx-auto" />
      case 'thinking':
        return <div className="w-3.5 h-[2px] bg-white/60 rounded mx-auto mt-0.5" />
      default:
        return <div className="w-4 h-2 border-b-2 border-white/90 rounded-b-full mx-auto" />
    }
  }

  return (
    <div className="relative">
      {/* Eyes */}
      <div className="flex gap-2.5 mb-0.5 justify-center">
        <motion.div
          animate={expression === 'thinking'
            ? { x: [0, 2, 0] }
            : { scaleY: [1, 0.1, 1] }}
          transition={expression === 'thinking'
            ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.15, repeat: Infinity, repeatDelay: 4 }}
          className="w-2 h-2.5 bg-white rounded-full"
        />
        <motion.div
          animate={expression === 'thinking'
            ? { x: [0, 2, 0] }
            : { scaleY: [1, 0.1, 1] }}
          transition={expression === 'thinking'
            ? { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }
            : { duration: 0.15, repeat: Infinity, repeatDelay: 4, delay: 0.02 }}
          className="w-2 h-2.5 bg-white rounded-full"
        />
      </div>
      {/* Mouth */}
      {getMouth()}
      {/* Waving hand */}
      {expression === 'waving' && (
        <motion.div
          animate={{ rotate: [0, 14, -8, 14, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.5 }}
          className="absolute -right-5 top-0 text-[14px]"
        >
          👋
        </motion.div>
      )}
    </div>
  )
}

/* ─── Cute AI Avatar that floats and gives hints ─── */
const AIAvatar: React.FC = () => {
  const { isTutorialActive, currentStep, currentStepIndex, activeSteps, startTutorial, setSteps } = useTutorial()
  const [showBubble, setShowBubble] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showIdlePrompt, setShowIdlePrompt] = useState(false)

  // Determine expression
  const expression: FaceExpression = useMemo(() => {
    if (!isTutorialActive) return 'idle'
    if (isTyping) return 'thinking'
    if (currentStepIndex === 0) return 'waving'
    return 'happy'
  }, [isTutorialActive, isTyping, currentStepIndex])

  // Show speech bubble when tutorial step changes — with typing effect
  useEffect(() => {
    if (!isTutorialActive || !currentStep) {
      setShowBubble(false)
      setDismissed(false)
      setIsTyping(false)
      return
    }
    setDismissed(false)
    setIsTyping(true)
    setShowBubble(true)

    // Show typing for 800ms, then reveal message
    const typingTimer = setTimeout(() => setIsTyping(false), 800)
    const hideTimer = setTimeout(() => setShowBubble(false), 10000)
    return () => {
      clearTimeout(typingTimer)
      clearTimeout(hideTimer)
    }
  }, [isTutorialActive, currentStep, currentStepIndex])

  // Handle idle click to show prompt to start tutorial
  const handleIdleClick = () => {
    if (isTutorialActive) {
      setDismissed(false)
      setShowBubble(prev => !prev)
    } else {
      setShowIdlePrompt(prev => !prev)
    }
  }

  const handleStartTutorial = () => {
    setShowIdlePrompt(false)
    // Restart tutorial with default steps
    startTutorial()
  }

  return (
    <div className="fixed bottom-24 left-6 z-[1003] flex flex-col items-start gap-3">
      {/* Speech Bubble — during tutorial */}
      <AnimatePresence>
        {isTutorialActive && showBubble && !dismissed && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative max-w-xs"
          >
            <div
              className="px-4 py-3 rounded-2xl rounded-bl-md text-xs text-white/85 leading-relaxed"
              style={{
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(99, 102, 241, 0.1)',
              }}
            >
              <button
                onClick={() => setDismissed(true)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/20 transition-all text-[10px]"
              >
                ×
              </button>
              {isTyping ? (
                <TypingDots />
              ) : (
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <span>{currentStep?.avatarMessage}</span>
                </div>
              )}
            </div>
            {/* Tail */}
            <div
              className="absolute -bottom-1.5 left-5 w-3 h-3 rotate-45"
              style={{
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderTop: 'none',
                borderLeft: 'none',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle Prompt Bubble — when tutorial is NOT active */}
      <AnimatePresence>
        {!isTutorialActive && showIdlePrompt && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative max-w-xs"
          >
            <div
              className="px-4 py-3 rounded-2xl rounded-bl-md text-xs text-white/85 leading-relaxed"
              style={{
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(99, 102, 241, 0.1)',
              }}
            >
              <button
                onClick={() => setShowIdlePrompt(false)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/20 transition-all text-[10px]"
              >
                ×
              </button>
              <div className="space-y-2">
                <p className="text-white/70 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
                  Need a tour of the dashboard?
                </p>
                <button
                  onClick={handleStartTutorial}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white bg-gradient-to-r from-primary-500 to-purple-600 hover:scale-105 active:scale-95 transition-transform w-full justify-center"
                >
                  <Play className="w-3 h-3" /> Start Tutorial
                </button>
              </div>
            </div>
            <div
              className="absolute -bottom-1.5 left-5 w-3 h-3 rotate-45"
              style={{
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderTop: 'none',
                borderLeft: 'none',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Avatar — always visible */}
      <motion.button
        onClick={handleIdleClick}
        animate={{
          y: [0, -6, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative w-14 h-14 rounded-full shadow-xl cursor-pointer"
        style={{
          background: isTutorialActive
            ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)'
            : 'linear-gradient(135deg, #475569 0%, #6366f1 50%, #a855f7 100%)',
          boxShadow: isTutorialActive
            ? '0 8px 30px rgba(99, 102, 241, 0.4), 0 0 0 3px rgba(99, 102, 241, 0.15)'
            : '0 8px 20px rgba(71, 85, 105, 0.3), 0 0 0 3px rgba(99, 102, 241, 0.08)',
        }}
      >
        {/* Face */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AvatarFace expression={expression} />
        </div>

        {/* Sparkle decoration */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
        </motion.div>

        {/* Pulse ring — only during tutorial */}
        {isTutorialActive && (
          <motion.div
            animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-primary-400"
          />
        )}

        {/* Help indicator when idle */}
        {!isTutorialActive && (
          <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center border-2 border-slate-900">
            <span className="text-[8px] font-bold text-slate-900">?</span>
          </div>
        )}
      </motion.button>

      {/* Step indicator — during tutorial */}
      {isTutorialActive && (
        <div className="flex gap-1 ml-3">
          {activeSteps.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentStepIndex ? 'w-5 bg-primary-400' : i < currentStepIndex ? 'w-2 bg-primary-400/50' : 'w-2 bg-white/15'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default AIAvatar
