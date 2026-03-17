import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Sparkles, ArrowRight, BookOpen, HelpCircle, BarChart3 } from 'lucide-react'

const quickActions = [
  {
    icon: BarChart3,
    title: 'Dashboard Guide',
    desc: 'Understand your metrics and charts',
    color: 'text-primary-400',
  },
  {
    icon: BookOpen,
    title: 'Restart Tutorial',
    desc: 'Take the onboarding tour again',
    color: 'text-emerald-400',
    action: 'restart_tutorial',
  },
  {
    icon: HelpCircle,
    title: 'Feature Overview',
    desc: 'Learn about all VyapaarIQ features',
    color: 'text-amber-400',
  },
]

interface AIAssistantButtonProps {
  onRestartTutorial?: () => void
}

const AIAssistantButton: React.FC<AIAssistantButtonProps> = ({ onRestartTutorial }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute bottom-16 right-0 w-80 mb-3"
          >
            <div className="ai-assistant-panel rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-primary-600 to-purple-600">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">VyapaarIQ Assistant</p>
                    <p className="text-xs text-white/60">How can I help you?</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 space-y-1.5">
                <p className="text-xs text-white/40 px-2 py-1.5 font-medium uppercase tracking-wider">Quick Actions</p>
                {quickActions.map((action, i) => (
                  <motion.button
                    key={action.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    onClick={() => {
                      if (action.action === 'restart_tutorial' && onRestartTutorial) {
                        onRestartTutorial()
                        setIsOpen(false)
                      }
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5
                      transition-all duration-200 group text-left"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0
                      group-hover:bg-white/10 transition-colors">
                      <action.icon className={`w-4.5 h-4.5 ${action.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white/85 group-hover:text-white transition-colors">{action.title}</p>
                      <p className="text-xs text-white/35 mt-0.5">{action.desc}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 
                      group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </motion.button>
                ))}

                {/* Tip */}
                <div className="mx-2 mt-2 p-3 rounded-xl bg-primary-500/5 border border-primary-500/10">
                  <p className="text-xs text-white/40 leading-relaxed">
                    <span className="text-primary-400 font-medium">💡 Tip:</span> Hover over any chart on the dashboard to see detailed explanations of what the data means.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center
          transition-all duration-300 ${
          isOpen
            ? 'bg-white/10 border border-white/20 backdrop-blur-xl'
            : 'bg-gradient-to-br from-primary-500 to-purple-600'
        }`}
        style={!isOpen ? { boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)' } : {}}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-5 h-5 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Pulse ring when closed */}
      {!isOpen && (
        <motion.div
          animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-2xl bg-primary-500/30 pointer-events-none"
        />
      )}
    </div>
  )
}

export default AIAssistantButton
