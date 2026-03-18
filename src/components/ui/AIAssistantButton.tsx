import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  MessageCircle, X, Sparkles, ArrowRight, BookOpen, HelpCircle,
  BarChart3, Send, Eye, Target, Brain, Database, Settings,
  LayoutDashboard, Navigation
} from 'lucide-react'

// Route mapping for intent detection
const routeMap: { keywords: string[]; route: string; label: string }[] = [
  { keywords: ['dashboard', 'overview', 'home', 'main', 'kpi', 'summary'], route: '/', label: 'Overview Dashboard' },
  { keywords: ['crowd', 'cctv', 'camera', 'footfall', 'heatmap', 'visitor', 'traffic', 'density', 'live feed'], route: '/crowd-analytics', label: 'Crowd Analytics' },
  { keywords: ['sales', 'product', 'customer', 'basket', 'revenue', 'performance', 'peak hours', 'conversion', 'journey'], route: '/sales', label: 'Sales & Customer Insights' },
  { keywords: ['competitor', 'competition', 'market', 'benchmark', 'price', 'amazon', 'flipkart', 'branch', 'location'], route: '/competitors', label: 'Competitor Intelligence' },
  { keywords: ['predict', 'forecast', 'recommendation', 'trend', 'festival', 'demand', 'staff', 'health', 'expansion'], route: '/predictions', label: 'Predictions & Recommendations' },
  { keywords: ['dataset', 'upload', 'csv', 'data', 'custom', 'analysis', 'import', 'file'], route: '/dataset', label: 'Dataset & Custom Analysis' },
  { keywords: ['settings', 'preference', 'theme', 'config', 'account'], route: '/settings', label: 'Settings' },
]

const quickNavButtons = [
  { label: 'Go to Dashboard', icon: LayoutDashboard, route: '/', color: 'from-primary-500 to-violet-500' },
  { label: 'Crowd Analytics', icon: Eye, route: '/crowd-analytics', color: 'from-emerald-500 to-teal-500' },
  { label: 'Sales Insights', icon: BarChart3, route: '/sales', color: 'from-blue-500 to-cyan-500' },
  { label: 'Competitor Intel', icon: Target, route: '/competitors', color: 'from-rose-500 to-pink-500' },
  { label: 'Upload Dataset', icon: Database, route: '/dataset', color: 'from-sky-500 to-blue-500' },
]

interface ChatMessage {
  id: number
  text: string
  isBot: boolean
  navigateTo?: string
  label?: string
}

function detectIntent(message: string): { route: string; label: string } | null {
  const lower = message.toLowerCase()
  for (const entry of routeMap) {
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) {
        return { route: entry.route, label: entry.label }
      }
    }
  }
  return null
}

function getBotResponse(message: string): { text: string; navigateTo?: string; label?: string } {
  const lower = message.toLowerCase()
  const intent = detectIntent(message)

  if (intent) {
    return {
      text: `Taking you to ${intent.label}... 🚀`,
      navigateTo: intent.route,
      label: intent.label,
    }
  }

  // General responses
  if (lower.includes('help') || lower.includes('what can you do')) {
    return { text: 'I can navigate you to any section! Try asking about: Dashboard, Crowd Analytics, Sales, Competitors, Predictions, or Datasets. You can also use the quick buttons below.' }
  }
  if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
    return { text: 'Hello! 👋 I\'m your VyapaarIQ assistant. I can help you navigate to any section or answer questions about the platform. What would you like to do?' }
  }
  if (lower.includes('thank')) {
    return { text: 'You\'re welcome! Let me know if you need anything else. 😊' }
  }

  return { text: 'I can help you navigate! Try asking about dashboard analytics, crowd monitoring, sales insights, competitor analysis, or dataset upload. Use the quick buttons below for instant navigation.' }
}

interface AIAssistantButtonProps {
  onRestartTutorial?: () => void
}

const AIAssistantButton: React.FC<AIAssistantButtonProps> = ({ onRestartTutorial }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, text: 'Welcome! 👋 I\'m your VyapaarIQ assistant. Ask me anything or use quick buttons to navigate!', isBot: true },
  ])
  const [inputValue, setInputValue] = useState('')
  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMsg: ChatMessage = { id: Date.now(), text: inputValue.trim(), isBot: false }
    setMessages(prev => [...prev, userMsg])
    setInputValue('')

    // Bot response with delay
    setTimeout(() => {
      const response = getBotResponse(userMsg.text)
      const botMsg: ChatMessage = {
        id: Date.now() + 1,
        text: response.text,
        isBot: true,
        navigateTo: response.navigateTo,
        label: response.label,
      }
      setMessages(prev => [...prev, botMsg])

      // Navigate after brief delay
      if (response.navigateTo) {
        setTimeout(() => {
          navigate(response.navigateTo!)
          setIsOpen(false)
        }, 1200)
      }
    }, 600)
  }

  const handleQuickNav = (route: string, label: string) => {
    const navMsg: ChatMessage = { id: Date.now(), text: `Taking you to ${label}... 🚀`, isBot: true }
    setMessages(prev => [...prev, navMsg])
    setTimeout(() => {
      navigate(route)
      setIsOpen(false)
    }, 800)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute bottom-16 right-0 w-96 mb-3"
          >
            <div className="ai-assistant-panel rounded-2xl overflow-hidden shadow-2xl flex flex-col" style={{ maxHeight: '520px' }}>
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-primary-600 to-purple-600 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">VyapaarIQ Assistant</p>
                    <p className="text-xs text-white/60">Ask me anything or navigate</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ maxHeight: '260px' }}>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      msg.isBot
                        ? 'bg-white/10 text-white/90 rounded-tl-md'
                        : 'bg-primary-500 text-white rounded-tr-md'
                    }`}>
                      {msg.text}
                      {msg.navigateTo && (
                        <div className="mt-2 flex items-center gap-1.5 text-primary-300">
                          <Navigation className="w-3 h-3" />
                          <span className="text-[10px] font-medium">Navigating...</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Nav Buttons */}
              <div className="px-3 py-2 border-t border-white/5 flex-shrink-0">
                <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider mb-2">Quick Navigate</p>
                <div className="flex flex-wrap gap-1.5">
                  {quickNavButtons.map(btn => (
                    <button
                      key={btn.route}
                      onClick={() => handleQuickNav(btn.route, btn.label)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-white/80 bg-gradient-to-r ${btn.color} bg-opacity-20 hover:bg-opacity-40 transition-all hover:scale-105`}
                      style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))` }}
                    >
                      <btn.icon className="w-3 h-3" />
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions Row */}
              <div className="px-3 py-1.5 border-t border-white/5 flex gap-1.5 flex-shrink-0">
                <button
                  onClick={() => { if (onRestartTutorial) { onRestartTutorial(); setIsOpen(false); } }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-white/50 hover:text-white/70 bg-white/5 hover:bg-white/10 transition-all"
                >
                  <BookOpen className="w-3 h-3" /> Restart Tutorial
                </button>
                <button
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-white/50 hover:text-white/70 bg-white/5 hover:bg-white/10 transition-all"
                  onClick={() => {
                    const helpMsg: ChatMessage = { id: Date.now(), text: 'I can navigate you to any section! Try: "show me crowd analytics", "go to sales", or "upload dataset". Use the quick buttons above for instant navigation.', isBot: true }
                    setMessages(prev => [...prev, helpMsg])
                  }}
                >
                  <HelpCircle className="w-3 h-3" /> Help
                </button>
              </div>

              {/* Input */}
              <div className="p-3 border-t border-white/5 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
                    placeholder="Ask or type a section name..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 transition-colors"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center text-white hover:bg-primary-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
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
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-5 h-5 text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
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
