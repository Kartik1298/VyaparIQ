import React, { useEffect, useCallback, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { X, Lightbulb, CheckCircle, AlertTriangle, Info, ChevronRight } from 'lucide-react'
import { useTutorial, AppNotification } from '../../context/TutorialContext'

const iconMap = {
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/15', border: 'border-blue-500/20', barColor: 'bg-blue-400' },
  success: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/20', barColor: 'bg-emerald-400' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/20', barColor: 'bg-amber-400' },
  insight: { icon: Lightbulb, color: 'text-purple-400', bg: 'bg-purple-500/15', border: 'border-purple-500/20', barColor: 'bg-purple-400' },
}

const NotificationItem: React.FC<{
  notification: AppNotification
  onDismiss: (id: string) => void
}> = ({ notification, onDismiss }) => {
  const navigate = useNavigate()
  const cfg = iconMap[notification.type]
  const Icon = cfg.icon
  const dismissMs = notification.autoDismissMs ?? 6000
  const [progress, setProgress] = useState(100)
  const startRef = useRef(Date.now())

  // Auto-dismiss with progress bar
  useEffect(() => {
    if (dismissMs <= 0) return
    startRef.current = Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - startRef.current
      const remaining = Math.max(0, 100 - (elapsed / dismissMs) * 100)
      setProgress(remaining)
      if (remaining <= 0) {
        clearInterval(interval)
        onDismiss(notification.id)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [notification.id, dismissMs, onDismiss])

  const handleClick = () => {
    if (notification.route) {
      navigate(notification.route)
      onDismiss(notification.id)
    }
    // If no route, clicking does nothing (except close button)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.85 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={`group relative w-80 rounded-xl overflow-hidden shadow-xl ${
        notification.route ? 'cursor-pointer hover:scale-[1.02]' : ''
      } transition-transform`}
      style={{
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.35)',
      }}
      onClick={handleClick}
    >
      {/* Accent bar */}
      <div className={`absolute left-0 top-0 w-1 h-full ${cfg.bg}`} />

      <div className="flex items-start gap-3 p-4 pl-5">
        <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0 border ${cfg.border}`}>
          <Icon className={`w-4 h-4 ${cfg.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white/90 truncate">{notification.title}</p>
          <p className="text-xs text-white/45 mt-0.5 leading-relaxed line-clamp-2">{notification.message}</p>
          {notification.route ? (
            <div className="flex items-center gap-1 mt-2 text-primary-400 text-[10px] font-medium">
              <span>View details</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          ) : (
            <div className="mt-2 text-[10px] text-white/25 font-medium">
              Info only
            </div>
          )}
        </div>
        <button
          onClick={e => { e.stopPropagation(); onDismiss(notification.id) }}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/10 transition-all flex-shrink-0 opacity-0 group-hover:opacity-100"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress bar countdown */}
      {dismissMs > 0 && (
        <div className="h-[2px] bg-white/5 w-full">
          <div
            className={`h-full ${cfg.barColor} transition-[width] duration-75 ease-linear`}
            style={{ width: `${progress}%`, opacity: 0.6 }}
          />
        </div>
      )}
    </motion.div>
  )
}

const NotificationSystem: React.FC = () => {
  const { notifications, dismissNotification } = useTutorial()

  const handleDismiss = useCallback((id: string) => {
    dismissNotification(id)
  }, [dismissNotification])

  return (
    <div className="fixed top-20 right-6 z-[999] flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {notifications.map(notif => (
          <NotificationItem
            key={notif.id}
            notification={notif}
            onDismiss={handleDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default NotificationSystem
