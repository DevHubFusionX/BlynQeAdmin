import { useFaceVerification } from '../../hooks/users/useFaceVerification.js'
import { useApproveFaceVerification } from '../../hooks/users/useApproveFaceVerification.js'
import { useRejectFaceVerification } from '../../hooks/users/useRejectFaceVerification.js'
import { Drawer, C, Skeleton, Avatar, Badge } from './ui.jsx'
import { Check, X, Info } from 'lucide-react'
import { useUIStore } from '../../store/uiStore.js'

export default function FaceVerifDrawer({ open, onClose, verificationId }) {
  const { data: item, isLoading } = useFaceVerification(verificationId)
  const approveMutation = useApproveFaceVerification()
  const rejectHook = useRejectFaceVerification()
  const showToast = useUIStore((s) => s.showToast)

  const user = item?.user ?? item?.profile
  const name = user?.name ?? user?.displayName ?? 'Verification Review'
  const email = user?.email ?? '—'
  const status = item?.status ?? 'pending'

  // Verification images: selfie vs reference photo (user profile image or uploaded doc)
  const selfieUrl = item?.selfieUrl ?? item?.selfie ?? item?.faceImage ?? ''
  const referenceUrl = item?.referenceUrl ?? item?.reference ?? user?.images?.[0] ?? user?.photos?.[0] ?? ''

  const isMutating = approveMutation.isPending || rejectHook.isPending

  const handleApprove = () => {
    approveMutation.mutate(
      { id: verificationId },
      {
        onSuccess: () => {
          showToast(`Successfully approved face verification for ${name}!`, 'success')
          onClose()
        },
        onError: (err) => {
          showToast(err?.message ?? 'Failed to approve face verification.', 'error')
        },
      }
    )
  }

  const handleReject = () => {
    rejectHook.mutate(
      { id: verificationId },
      {
        onSuccess: () => {
          showToast(`Successfully rejected face verification for ${name}.`, 'success')
          onClose()
        },
        onError: (err) => {
          showToast(err?.message ?? 'Failed to reject face verification.', 'error')
        },
      }
    )
  }

  return (
    <Drawer open={open} onClose={onClose} title="Face Verification Review" width="max-w-xl">
      {isLoading ? (
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3.5 w-48" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="aspect-3/4 rounded-2xl" />
            <Skeleton className="aspect-3/4 rounded-2xl" />
          </div>
        </div>
      ) : !item ? (
        <div className="p-6 text-center text-gray-400 text-sm">
          Failed to load face verification request.
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Scrollable content */}
          <div className="flex-1 p-6 space-y-6">
            {/* User Info card */}
            <div
              className="p-4 rounded-xl border flex items-center gap-4"
              style={{ backgroundColor: C.card, borderColor: C.border }}
            >
              <Avatar name={name} size={10} />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{name}</h4>
                <p className="text-xs truncate mt-0.5" style={{ color: C.muted }}>{email}</p>
              </div>
              <Badge status={status} />
            </div>

            {/* Comparison Images */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-orange-500 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> Compare Verification Photo with Profile Photo
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {/* Selfie / Captured Live Photo */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block text-center">
                    Live Capture
                  </span>
                  <div
                    className="aspect-3/4 rounded-2xl overflow-hidden bg-zinc-900 border flex items-center justify-center"
                    style={{ borderColor: C.border }}
                  >
                    {selfieUrl ? (
                      <img src={selfieUrl} alt="Selfie Capture" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-gray-500">No capture available</span>
                    )}
                  </div>
                </div>

                {/* Reference Photo */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block text-center">
                    Profile Reference
                  </span>
                  <div
                    className="aspect-3/4 rounded-2xl overflow-hidden bg-zinc-900 border flex items-center justify-center"
                    style={{ borderColor: C.border }}
                  >
                    {referenceUrl ? (
                      <img src={referenceUrl} alt="Reference Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-gray-500">No profile photo</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons footer */}
          {status === 'pending' && (
            <div
              className="p-6 border-t flex gap-3 shrink-0"
              style={{ borderColor: C.border, backgroundColor: C.card }}
            >
              <button
                onClick={handleReject}
                disabled={isMutating}
                className="flex-1 py-3 rounded-xl text-xs font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" /> Reject verification
              </button>
              <button
                onClick={handleApprove}
                disabled={isMutating}
                className="flex-1 py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" /> Approve verification
              </button>
            </div>
          )}
        </div>
      )}
    </Drawer>
  )
}
