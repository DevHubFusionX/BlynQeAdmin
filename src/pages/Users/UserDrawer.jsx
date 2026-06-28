import { useUser } from '../../hooks/users/useUser.js'
import { Drawer, C, Skeleton, Avatar, Badge } from './ui.jsx'
import { Mail, Calendar, Phone, CalendarDays } from 'lucide-react'

export default function UserDrawer({ open, onClose, userId, onSuspendToggle, onDelete }) {
  const { data: user, isLoading } = useUser(userId)

  const name = user?.name ?? user?.displayName ?? 'User Details'
  const email = user?.email ?? '—'
  const phone = user?.phoneNumber ?? user?.phone ?? '—'
  const gender = user?.gender ?? '—'
  const bio = user?.bio ?? 'No biography provided.'
  const status = user?.status ?? (user?.isSuspended ? 'suspended' : 'active')
  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '—'

  // Photos
  const photos = Array.isArray(user?.images) ? user.images : (user?.photos ?? [])

  return (
    <Drawer open={open} onClose={onClose} title="User Profile Inspection">
      {isLoading ? (
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center gap-3">
            <Skeleton className="w-20 h-20 rounded-full" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="space-y-4 pt-4 border-t" style={{ borderColor: C.border }}>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      ) : !user ? (
        <div className="p-6 text-center text-gray-400 text-sm">
          Failed to load user profile.
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Scrollable Body */}
          <div className="flex-1 p-6 space-y-6">
            {/* Header info */}
            <div className="flex flex-col items-center text-center">
              <Avatar name={name} size={16} />
              <h3 className="text-lg font-bold text-white mt-3">{name}</h3>
              <p className="text-xs mt-1" style={{ color: C.muted }}>{email}</p>
              <div className="mt-3">
                <Badge status={status} />
              </div>
            </div>

            {/* Profile fields */}
            <div className="space-y-4 pt-5 border-t" style={{ borderColor: C.border }}>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-orange-500">
                Identity Details
              </h4>
              <div className="space-y-3.5">
                <div className="flex items-center gap-3 text-xs text-white">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div className="flex-1">
                    <p style={{ color: C.muted }} className="text-[10px] uppercase font-semibold">Email</p>
                    <p className="mt-0.5">{email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-white">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <div className="flex-1">
                    <p style={{ color: C.muted }} className="text-[10px] uppercase font-semibold">Phone</p>
                    <p className="mt-0.5">{phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-white">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div className="flex-1">
                    <p style={{ color: C.muted }} className="text-[10px] uppercase font-semibold">Gender &amp; Info</p>
                    <p className="mt-0.5 capitalize">{gender}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-white">
                  <CalendarDays className="w-4 h-4 text-gray-500" />
                  <div className="flex-1">
                    <p style={{ color: C.muted }} className="text-[10px] uppercase font-semibold">Member Since</p>
                    <p className="mt-0.5">{joined}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2 pt-5 border-t" style={{ borderColor: C.border }}>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-orange-500">
                Biography
              </h4>
              <p className="text-xs leading-relaxed text-gray-300 bg-white/2 border p-3.5 rounded-xl" style={{ borderColor: C.border }}>
                {bio}
              </p>
            </div>

            {/* Photos */}
            {photos.length > 0 && (
              <div className="space-y-3 pt-5 border-t" style={{ borderColor: C.border }}>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-orange-500">
                  Profile Images
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((url, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl overflow-hidden bg-zinc-800 border"
                      style={{ borderColor: C.border }}
                    >
                      <img src={url} alt={`Profile ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Actions Footer */}
          <div
            className="p-6 border-t flex gap-3 shrink-0"
            style={{ borderColor: C.border, backgroundColor: C.card }}
          >
            <button
              onClick={() => onSuspendToggle(user)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                status === 'suspended'
                  ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                  : 'border-red-500/30 text-red-400 hover:bg-red-500/10'
              }`}
            >
              {status === 'suspended' ? 'Unsuspend Account' : 'Suspend Account'}
            </button>
            <button
              onClick={() => onDelete(user)}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
            >
              Delete User
            </button>
          </div>
        </div>
      )}
    </Drawer>
  )
}
