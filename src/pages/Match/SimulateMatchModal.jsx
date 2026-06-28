import { useState } from 'react'
import { useLikeUser } from '../../hooks/match/index.js'
import { useUIStore } from '../../store/uiStore.js'
import { C } from '../Users/ui.jsx'
import { AlertCircle, Flame, Star, ThumbsUp, X } from 'lucide-react'

export default function SimulateMatchModal({ open, onClose }) {
  const mutation = useLikeUser()
  const showToast = useUIStore((s) => s.showToast)

  const [likedUserId, setLikedUserId] = useState('')
  const [action, setAction] = useState('like')
  const [errorMsg, setErrorMsg] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)



  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    if (!likedUserId.trim()) {
      setErrorMsg('Target User ID is required.')
      return
    }

    mutation.mutate(
      {
        likedUserId: likedUserId.trim(),
        action: action,
      },
      {
        onSuccess: () => {
          const msg = `Successfully logged a ${action} interaction!`
          setSuccessMsg(msg)
          showToast(msg, 'success')
          setTimeout(() => {
            onClose()
          }, 1500)
        },
        onError: (err) => {
          const errMsg = err?.message ?? 'Failed to log interaction.'
          setErrorMsg(errMsg)
          showToast(errMsg, 'error')
        },
      }
    )
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl border p-6 shadow-2xl animate-scaleUp"
        style={{ backgroundColor: C.card, borderColor: C.border }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b" style={{ borderColor: C.border }}>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="text-base font-bold text-white">Simulate Interaction</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
            Log a mock interaction from the system console. The action will be logged under your current active login session.
          </p>

          {errorMsg && (
            <div
              className="p-3.5 rounded-xl border flex items-start gap-2.5 text-xs text-red-400"
              style={{ backgroundColor: '#ef444410', borderColor: '#ef444420' }}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              className="p-3.5 rounded-xl border flex items-start gap-2.5 text-xs text-emerald-400"
              style={{ backgroundColor: '#22c55e10', borderColor: '#22c55e20' }}
            >
              <ThumbsUp className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Target User ID */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Target User ID
            </label>
            <input
              type="text"
              required
              value={likedUserId}
              onChange={(e) => setLikedUserId(e.target.value)}
              placeholder="Paste MongoDB ID of the user you want to interact with"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-orange-500/50 transition-colors"
              style={{ borderColor: C.border }}
            />
          </div>

          {/* Action type */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
              Interaction Event Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'like', label: 'Like', icon: ThumbsUp, color: '#38bdf8' },
                { id: 'super-like', label: 'Super Like', icon: Star, color: '#a78bfa' },
                { id: 'dislike', label: 'Dislike', icon: X, color: '#ef4444' },
              ].map((act) => {
                const Icon = act.icon
                const isSelected = action === act.id
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setAction(act.id)}
                    className="p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all"
                    style={{
                      borderColor: isSelected ? act.color : C.border,
                      backgroundColor: isSelected ? `${act.color}10` : 'transparent',
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: isSelected ? act.color : C.muted }} />
                    <span className="text-[10px] font-bold text-white">{act.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer disabled:opacity-50"
              style={{ borderColor: C.border, color: C.muted }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all cursor-pointer disabled:opacity-50"
            >
              {mutation.isPending ? 'Logging...' : 'Submit Event'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
