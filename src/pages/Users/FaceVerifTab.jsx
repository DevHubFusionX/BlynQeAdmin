import { useState } from 'react'
import { useFaceVerifications } from '../../hooks/users/useFaceVerifications.js'
import { ScanFace, Eye } from 'lucide-react'
import { C, Skeleton, Avatar, Badge, EmptyState } from './ui.jsx'

export default function FaceVerifTab({ onViewDetails }) {
  const [statusFilter, setStatusFilter] = useState('pending')
  const { data, isLoading } = useFaceVerifications({ status: statusFilter })

  const items = Array.isArray(data) ? data : data?.records ?? data?.data ?? data?.verifications ?? []

  return (
    <div className="space-y-4">
      {/* ── Filter Controls ── */}
      <div className="flex gap-2">
        {['pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer border ${
              statusFilter === status
                ? 'bg-orange-500 text-white border-transparent shadow-md shadow-orange-500/20'
                : 'text-gray-400 border-zinc-800 hover:text-white hover:bg-white/5'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* ── Table Container ── */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: C.card, borderColor: C.border }}
      >
        {/* Header */}
        <div
          className="grid grid-cols-[2fr_1fr_1.5fr_auto] gap-4 px-6 py-3.5 border-b text-[10px] font-semibold uppercase tracking-widest"
          style={{ borderColor: C.border, color: C.muted }}
        >
          <span>User</span>
          <span>Status</span>
          <span>Submitted</span>
          <span className="w-8 text-right">Action</span>
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="grid grid-cols-[2fr_1fr_1.5fr_auto] gap-4 items-center">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="w-8 h-8 rounded" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={ScanFace}
            title={`No ${statusFilter} requests`}
            description={`There are currently no face verification requests marked as ${statusFilter}.`}
          />
        ) : (
          <div className="divide-y" style={{ divideColor: C.border }}>
            {items.map((item, i) => {
              const user = item?.user ?? item?.profile
              const name = user?.name ?? user?.displayName ?? `User #${i + 1}`
              const email = user?.email ?? '—'
              const date = item?.createdAt
                ? new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '—'
              const verifId = item?._id ?? item?.id

              return (
                <div
                  key={verifId ?? i}
                  className="grid grid-cols-[2fr_1fr_1.5fr_auto] gap-4 px-6 py-4 items-center hover:bg-white/1 transition-colors"
                >
                  {/* User profile */}
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={name} size={8} />
                    <div className="min-w-0">
                      <span className="text-sm font-semibold text-white truncate block">{name}</span>
                      <span className="text-[10px] truncate block" style={{ color: C.muted }}>{email}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <Badge status={item.status ?? statusFilter} />
                  </div>

                  {/* Submitted Date */}
                  <span className="text-xs" style={{ color: C.muted }}>
                    {date}
                  </span>

                  {/* Actions */}
                  <button
                    onClick={() => onViewDetails(verifId)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white cursor-pointer"
                    title="Review Submission"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
