import { useUIStore } from '../../store/uiStore.js'
import { CheckCircle2, AlertOctagon, Info, X } from 'lucide-react'

export default function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts)
  const removeToast = useUIStore((s) => s.removeToast)

  if (toasts.length === 0) return null

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          color: '#22c55e',
          bg: '#1a1c23',
          border: 'rgba(34, 197, 94, 0.2)',
          icon: CheckCircle2,
        }
      case 'error':
        return {
          color: '#ef4444',
          bg: '#1a1c23',
          border: 'rgba(239, 68, 68, 0.2)',
          icon: AlertOctagon,
        }
      case 'info':
      default:
        return {
          color: '#f97316',
          bg: '#1a1c23',
          border: 'rgba(249, 115, 22, 0.2)',
          icon: Info,
        }
    }
  }

  return (
    <div className="fixed top-6 right-6 z-9999 flex flex-col gap-3 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const s = getToastStyles(toast.type)
        const Icon = s.icon

        return (
          <div
            key={toast.id}
            className="pointer-events-auto w-80 p-4 rounded-xl border shadow-2xl flex gap-3 items-start animate-slideInRight"
            style={{
              backgroundColor: s.bg,
              borderColor: s.border,
            }}
          >
            {/* Left status indicator icon */}
            <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: s.color }} />

            {/* Middle text */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white leading-relaxed wrap-break-word">
                {toast.message}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-500 hover:text-white transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
