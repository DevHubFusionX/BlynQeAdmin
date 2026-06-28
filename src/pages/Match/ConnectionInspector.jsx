import { useState } from 'react'
import { Heart, Copy, Check, Calendar, User, Mail } from 'lucide-react'
import { C, Avatar } from '../Users/ui.jsx'
import { useAuthStore } from '../../store/authStore.js'

export default function ConnectionInspector({ connection, type = 'match' }) {
  const [copiedId1, setCopiedId1] = useState(false)
  const [copiedId2, setCopiedId2] = useState(false)

  const activeUser = useAuthStore((s) => s.user)
  const activeUserName = activeUser?.displayName ?? activeUser?.name ?? 'You'

  if (!connection) {
    return (
      <div
        className="h-full rounded-2xl border flex flex-col items-center justify-center p-8 text-center"
        style={{ backgroundColor: C.card, borderColor: C.border }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: C.surface }}
        >
          <Heart className="w-6 h-6 text-gray-500 animate-pulse" />
        </div>
        <h3 className="text-sm font-bold text-white mb-1">Select a Connection</h3>
        <p className="text-xs max-w-xs mx-auto" style={{ color: C.muted }}>
          Choose any match or like event from the directory to inspect profile compatibility, timestamps, and account details.
        </p>
      </div>
    )
  }

  // Extract profiles
  const parseUserProfile = (u) => {
    if (!u) return null
    const profile = Array.isArray(u) ? u[0] : u
    if (!profile) return null
    const firstName = profile.firstName ?? ''
    const lastName = profile.lastName ?? ''
    const fullName = profile.name ?? profile.displayName ?? `${firstName} ${lastName}`.trim()

    let dob = '—'
    if (profile.dateOfBirth) {
      try {
        dob = new Date(profile.dateOfBirth).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      } catch {
        dob = profile.dateOfBirth
      }
    }

    const coords = profile.location?.coordinates
    let locationStr = null
    if (coords && coords.length >= 2) {
      const lat = Number(coords[1])
      const lng = Number(coords[0])
      if (!isNaN(lat) && !isNaN(lng)) {
        locationStr = `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      }
    }

    return {
      id: profile._id ?? profile.id ?? '—',
      name: fullName || 'User Account',
      email: profile.email ?? '—',
      gender: profile.gender ?? 'Unspecified',
      dateOfBirth: dob,
      location: locationStr,
      src: profile.photo?.url ?? profile.images?.[0] ?? profile.photos?.[0] ?? null
    }
  }

  let u1 = null
  let u2 = null

  if (type === 'match') {
    const rawU1 = connection?.user1 ?? connection?.users?.[0]
    const rawU2 = connection?.user2 ?? connection?.users?.[1]

    if (rawU1 || rawU2) {
      u1 = parseUserProfile(rawU1)
      u2 = parseUserProfile(rawU2)
    } else {
      u1 = { name: activeUserName, email: activeUser?.email ?? '—', gender: '—', id: activeUser?.id ?? activeUser?._id ?? '—', src: null }
      u2 = parseUserProfile(connection)
    }
  } else {
    u1 = parseUserProfile(connection?.user ?? connection?.sender ?? connection?.likeUserProfile)
    u2 = parseUserProfile(connection?.likedUser ?? connection?.receiver ?? connection?.target ?? connection?.likedUserProfile)
  }

  const action = connection?.action ?? (connection?.isSuperLike ? 'super-like' : 'like')
  const dateStr = connection?.createdAt 
    ? new Date(connection.createdAt).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    : '—'

  const copyId = (id, setCopied) => {
    if (!id) return
    navigator.clipboard.writeText(id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="rounded-2xl border p-6 flex flex-col h-full space-y-6 overflow-y-auto animate-fadeIn"
      style={{ backgroundColor: C.card, borderColor: C.border }}
    >
      <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: C.border }}>
        <div>
          <h3 className="text-sm font-bold text-white">Connection Inspector</h3>
          <p className="text-[11px] mt-0.5" style={{ color: C.muted }}>Detailed matching metrics and event timeline.</p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
          style={{ 
            color: type === 'match' ? '#f97316' : action === 'super-like' ? '#a78bfa' : '#38bdf8', 
            backgroundColor: type === 'match' ? '#f9731615' : action === 'super-like' ? '#a78bfa15' : '#38bdf815' 
          }}
        >
          {type === 'match' ? 'Mutual Match' : action === 'super-like' ? 'Super Like' : 'Standard Like'}
        </span>
      </div>

      {/* ── Side-by-Side Profiles ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* User 1 */}
        <div className="p-4 rounded-xl bg-zinc-900/40 border space-y-3.5" style={{ borderColor: C.border }}>
          <div className="flex flex-col items-center text-center">
            <Avatar name={u1?.name ?? 'User A'} src={u1?.src} size={12} />
            <h4 className="text-xs font-bold text-white mt-2 truncate w-full">{u1?.name ?? 'User A'}</h4>
            <span className="text-[10px] uppercase font-semibold text-orange-500 mt-0.5">Originator</span>
          </div>

          <div className="space-y-2.5 pt-3 border-t text-[11px]" style={{ borderColor: C.border }}>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span className="text-white truncate flex-1">{u1?.email ?? '—'}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span className="text-gray-300 capitalize truncate">{u1?.gender ?? 'Unspecified'}</span>
            </div>
            {u1?.dateOfBirth && u1.dateOfBirth !== '—' && (
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <span className="text-gray-300 truncate">{u1.dateOfBirth}</span>
              </div>
            )}
            {u1?.location && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-[10px] font-mono shrink-0">LOC:</span>
                <span className="text-gray-300 truncate flex-1">{u1.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-[10px] font-mono shrink-0">ID:</span>
              <span className="text-gray-400 font-mono truncate flex-1">{u1?._id ?? u1?.id ?? '—'}</span>
              {(u1?._id || u1?.id) && (u1?._id ?? u1?.id) !== '—' && (
                <button
                  onClick={() => copyId(u1?._id ?? u1?.id, setCopiedId1)}
                  className="text-gray-500 hover:text-white"
                >
                  {copiedId1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User 2 */}
        <div className="p-4 rounded-xl bg-zinc-900/40 border space-y-3.5" style={{ borderColor: C.border }}>
          <div className="flex flex-col items-center text-center">
            <Avatar name={u2?.name ?? 'User B'} src={u2?.src} size={12} />
            <h4 className="text-xs font-bold text-white mt-2 truncate w-full">{u2?.name ?? 'User B'}</h4>
            <span className="text-[10px] uppercase font-semibold text-gray-400 mt-0.5">Target</span>
          </div>

          <div className="space-y-2.5 pt-3 border-t text-[11px]" style={{ borderColor: C.border }}>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span className="text-white truncate flex-1">{u2?.email ?? '—'}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span className="text-gray-300 capitalize truncate">{u2?.gender ?? 'Unspecified'}</span>
            </div>
            {u2?.dateOfBirth && u2.dateOfBirth !== '—' && (
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <span className="text-gray-300 truncate">{u2.dateOfBirth}</span>
              </div>
            )}
            {u2?.location && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-[10px] font-mono shrink-0">LOC:</span>
                <span className="text-gray-300 truncate flex-1">{u2.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-[10px] font-mono shrink-0">ID:</span>
              <span className="text-gray-400 font-mono truncate flex-1">{u2?._id ?? u2?.id ?? '—'}</span>
              {(u2?._id || u2?.id) && (u2?._id ?? u2?.id) !== '—' && (
                <button
                  onClick={() => copyId(u2?._id ?? u2?.id, setCopiedId2)}
                  className="text-gray-500 hover:text-white"
                >
                  {copiedId2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Match Timeline ── */}
      <div className="space-y-3 pt-2">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-orange-500 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" /> Interaction Timeline
        </h4>
        
        <div className="relative pl-6 border-l border-zinc-800 space-y-5 py-2">
          {/* Step 1 */}
          <div className="relative">
            <span
              className="absolute left-[-31px] top-0.5 w-4.5 h-4.5 rounded-full border flex items-center justify-center bg-zinc-950"
              style={{ borderColor: '#38bdf8' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            </span>
            <div className="text-xs">
              <p className="font-semibold text-white">Interaction Initiated</p>
              <p className="text-[10px] mt-0.5" style={{ color: C.muted }}>
                {u1?.name ?? 'User A'} logged a {action.replace('-', ' ')} event targetting {u2?.name ?? 'User B'}.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <span
              className="absolute left-[-31px] top-0.5 w-4.5 h-4.5 rounded-full border flex items-center justify-center bg-zinc-950"
              style={{ borderColor: type === 'match' ? '#f97316' : C.border }}
            >
              {type === 'match' ? (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
              )}
            </span>
            <div className="text-xs">
              <p className="font-semibold text-white">
                {type === 'match' ? 'Mutual Match Complete' : 'Pending Target Callback'}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: C.muted }}>
                {type === 'match' 
                  ? `${u2?.name ?? 'User B'} reciprocating with mutual interest completed the pair.` 
                  : `Waiting for ${u2?.name ?? 'User B'} to respond or match.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata stamp */}
      <div
        className="p-3.5 rounded-xl border flex flex-col gap-1 text-[11px]"
        style={{ backgroundColor: C.surface, borderColor: C.border }}
      >
        <div className="flex justify-between">
          <span style={{ color: C.muted }}>System Timestamp:</span>
          <span className="font-semibold text-white">{dateStr}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: C.muted }}>Event ID:</span>
          <span className="font-mono text-[10px] text-gray-300">{connection?._id ?? connection?.id ?? '—'}</span>
        </div>
      </div>
    </div>
  )
}
