import { Flame, Star, ThumbsUp } from 'lucide-react'
import { C, Avatar } from '../Users/ui.jsx'
import { useAuthStore } from '../../store/authStore.js'

export default function ConnectionCard({ connection, type = 'match', selected = false, onClick }) {
  const activeUser = useAuthStore((s) => s.user)
  const activeUserName = activeUser?.displayName ?? activeUser?.name ?? 'You'

  // Safe extraction helper
  const parseUserProfile = (u) => {
    if (!u) return null
    const profile = Array.isArray(u) ? u[0] : u
    if (!profile) return null
    const firstName = profile.firstName ?? ''
    const lastName = profile.lastName ?? ''
    const fullName = profile.name ?? profile.displayName ?? `${firstName} ${lastName}`.trim()
    return {
      name: fullName || 'User Account',
      avatar: fullName || 'U',
      src: profile.photo?.url ?? profile.images?.[0] ?? profile.photos?.[0] ?? null,
    }
  }

  const getEntityData = () => {
    if (type === 'match') {
      const rawU1 = connection?.user1 ?? connection?.users?.[0]
      const rawU2 = connection?.user2 ?? connection?.users?.[1]
      
      const u1 = (rawU1 || rawU2)
        ? parseUserProfile(rawU1)
        : { name: activeUserName, avatar: activeUserName, src: null }

      const u2 = (rawU1 || rawU2)
        ? parseUserProfile(rawU2)
        : parseUserProfile(connection)

      return {
        name1: u1?.name ?? 'User A',
        name2: u2?.name ?? 'User B',
        avatar1: u1?.avatar ?? 'A',
        avatar2: u2?.avatar ?? 'B',
        src1: u1?.src ?? null,
        src2: u2?.src ?? null,
        label: 'Mutual Match',
        badgeColor: '#f97316',
        badgeBg: '#f9731615',
        icon: Flame,
      }
    } else {
      const sender = parseUserProfile(connection?.user ?? connection?.sender ?? connection?.likeUserProfile)
      const receiver = parseUserProfile(connection?.likedUser ?? connection?.receiver ?? connection?.target ?? connection?.likedUserProfile)
      const action = connection?.action ?? (connection?.isSuperLike ? 'super-like' : 'like')
      
      const isSuper = action === 'super-like'
      return {
        name1: sender?.name ?? 'Sender',
        name2: receiver?.name ?? 'Receiver',
        avatar1: sender?.avatar ?? 'S',
        avatar2: receiver?.avatar ?? 'R',
        src1: sender?.src ?? null,
        src2: receiver?.src ?? null,
        label: isSuper ? 'Super Like' : 'Like Event',
        badgeColor: isSuper ? '#a78bfa' : '#38bdf8',
        badgeBg: isSuper ? '#a78bfa15' : '#38bdf815',
        icon: isSuper ? Star : ThumbsUp,
      }
    }
  }

  const data = getEntityData()
  const Icon = data.icon
  const date = connection?.createdAt 
    ? new Date(connection.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '—'

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none flex flex-col gap-3 group relative overflow-hidden ${
        selected 
          ? 'shadow-lg shadow-orange-500/5' 
          : 'hover:bg-white/1'
      }`}
      style={{
        backgroundColor: C.card,
        borderColor: selected ? '#f97316' : C.border,
      }}
    >
      {/* Top row: Badge + Date */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ color: data.badgeColor, backgroundColor: data.badgeBg }}
        >
          <Icon className="w-3 h-3" />
          {data.label}
        </span>
        <span className="text-[10px]" style={{ color: C.muted }}>
          {date}
        </span>
      </div>

      {/* Main Row: Connected Avatars + Names */}
      <div className="flex items-center gap-4">
        {/* Avatars container */}
        <div className="flex items-center relative w-14 h-9 shrink-0">
          <div className="absolute left-0 z-10 transition-transform group-hover:-translate-x-1 duration-200">
            <Avatar name={data.avatar1} src={data.src1} size={8} />
          </div>
          <div className="absolute right-0 border-2 transition-transform group-hover:translate-x-1 duration-200" style={{ borderColor: C.card, borderRadius: '9999px' }}>
            <Avatar name={data.avatar2} src={data.src2} size={8} />
          </div>
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-white truncate">
            {type === 'match' ? (
              <>
                {data.name1} <span style={{ color: C.muted }}>&amp;</span> {data.name2}
              </>
            ) : (
              <>
                {data.name1} <span className="text-orange-500 font-bold mx-0.5">→</span> {data.name2}
              </>
            )}
          </p>
          <p className="text-[10px] truncate mt-0.5" style={{ color: C.muted }}>
            {type === 'match' ? 'Pair established' : 'Interaction logged'}
          </p>
        </div>
      </div>
    </div>
  )
}
