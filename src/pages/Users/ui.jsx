/* eslint-disable react-refresh/only-export-components */
/**
 * src/pages/Users/ui.jsx
 * Shared design primitives for the Users page.
 * All sub-components import from here.
 */
import { useEffect } from 'react'
import { X, AlertTriangle } from 'lucide-react'

// ─── Design tokens ────────────────────────────────────────────────────────────
export const C = {
  bg:      '#13151a',
  card:    '#1a1c23',
  border:  '#23252e',
  muted:   '#6b7280',
  surface: '#23252e',
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
export function Skeleton({ className = '' }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className}`}
      style={{ backgroundColor: C.surface }}
    />
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
export function Avatar({ name, src, size = 8 }) {
  const initials = name
    ? name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U'
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`w-${size} h-${size} rounded-full object-cover shrink-0 select-none`}
      />
    )
  }
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 select-none`}
      style={{ background: 'linear-gradient(135deg,#f97316,#b45309)' }}
    >
      {initials}
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────
const BADGE_MAP = {
  active:    { color: '#22c55e', bg: '#22c55e18', label: 'Active' },
  suspended: { color: '#ef4444', bg: '#ef444418', label: 'Suspended' },
  pending:   { color: '#f97316', bg: '#f9731618', label: 'Pending' },
  approved:  { color: '#22c55e', bg: '#22c55e18', label: 'Approved' },
  rejected:  { color: '#ef4444', bg: '#ef444418', label: 'Rejected' },
}

export function Badge({ status }) {
  const s = BADGE_MAP[status?.toLowerCase()] ?? BADGE_MAP.pending
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ color: s.color, backgroundColor: s.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: s.color }} />
      {s.label}
    </span>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: C.surface }}
      >
        <Icon className="w-5 h-5" style={{ color: C.muted }} />
      </div>
      <p className="text-sm font-semibold text-white">{title}</p>
      {description && (
        <p className="text-xs text-center max-w-xs" style={{ color: C.muted }}>{description}</p>
      )}
    </div>
  )
}

// ─── Drawer ───────────────────────────────────────────────────────────────────
export function Drawer({ open, onClose, title, children, width = 'max-w-lg' }) {
  // Lock body scroll while open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full z-50 flex flex-col w-full ${width} transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: C.card, borderLeft: `1px solid ${C.border}` }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: C.border }}
        >
          <span className="text-sm font-semibold text-white">{title}</span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" style={{ color: C.muted }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  )
}

// ─── Confirm modal ────────────────────────────────────────────────────────────
export function ConfirmModal({ open, onClose, onConfirm, isPending, title, description, confirmLabel = 'Confirm', danger = false }) {
  if (!open) return null
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Card — on top of backdrop */}
      <div
        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm rounded-2xl border p-6 shadow-2xl"
        style={{ backgroundColor: C.card, borderColor: C.border }}
      >
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
          style={{ backgroundColor: danger ? '#ef444418' : '#f9731618' }}
        >
          <AlertTriangle className="w-5 h-5" style={{ color: danger ? '#ef4444' : '#f97316' }} />
        </div>

        <h3 className="text-base font-bold text-white mb-1">{title}</h3>
        <p className="text-sm mb-6" style={{ color: C.muted }}>{description}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors cursor-pointer disabled:opacity-50"
            style={{ borderColor: C.border, color: C.muted }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors cursor-pointer disabled:opacity-50 ${
              danger
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {isPending ? 'Please wait…' : confirmLabel}
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Row action button ────────────────────────────────────────────────────────
export function ActionBtn({ onClick, children, variant = 'default' }) {
  const styles = {
    default: 'text-gray-400 hover:text-white hover:bg-white/5',
    danger:  'text-red-400 hover:text-red-300 hover:bg-red-500/10',
    success: 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10',
  }
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${styles[variant]}`}
    >
      {children}
    </button>
  )
}
