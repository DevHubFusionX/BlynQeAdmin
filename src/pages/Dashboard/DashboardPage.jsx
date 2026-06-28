import { useUsersCount } from '../../hooks/users/useUsersCount.js'
import { useUsers } from '../../hooks/users/useUsers.js'
import { useFaceVerifications } from '../../hooks/users/useFaceVerifications.js'
import { useMatchCount } from '../../hooks/match/useMatchCount.js'
import { useReports } from '../../hooks/reports/useReports.js'
import { useAdmins } from '../../hooks/admin/useAdmins.js'
import {
  Users,
  UserX,
  Heart,
  ShieldAlert,
  ScanFace,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Circle,
  ArrowUpRight,
} from 'lucide-react'

// ─── Colour palette ───────────────────────────────────────────────────────────
const CARD = '#1a1c23'
const BORDER = '#23252e'
const MUTED = '#6b7280'

// ─── Skeleton ────────────────────────────────────────────────────────────────
function Skeleton({ className = '' }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className}`}
      style={{ backgroundColor: '#23252e' }}
    />
  )
}

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconColor, iconBg, label, value, sub, isLoading, accent }) {
  return (
    <div
      className="relative flex flex-col gap-4 p-5 rounded-2xl border overflow-hidden"
      style={{ backgroundColor: CARD, borderColor: BORDER }}
    >
      {/* Subtle glow behind icon */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-2xl pointer-events-none"
        style={{ backgroundColor: accent }}
      />

      <div className="flex items-start justify-between">
        <span
          className="flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </span>
        <ArrowUpRight className="w-4 h-4" style={{ color: MUTED }} />
      </div>

      {isLoading ? (
        <>
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-3 w-32" />
        </>
      ) : (
        <div>
          <p className="text-3xl font-bold text-white tabular-nums">
            {value ?? '—'}
          </p>
          <p className="text-xs mt-1 font-medium" style={{ color: MUTED }}>{label}</p>
          {sub && (
            <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>{sub}</p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionTitle({ children }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: MUTED }}>
      {children}
    </h2>
  )
}

// ─── Donut ring ──────────────────────────────────────────────────────────────
function DonutChart({ segments }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  const r = 52
  const cx = 64
  const cy = 64
  const circ = 2 * Math.PI * r

  const offsets = []
  let acc = 0
  for (const seg of segments) {
    offsets.push(acc)
    acc += (seg.value / total) * circ
  }

  const slices = segments.map((seg, idx) => {
    const dash = (seg.value / total) * circ
    const gap = circ - dash
    const offset = offsets[idx]
    return (
      <circle
        key={seg.label}
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={seg.color}
        strokeWidth="14"
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={-offset}
        strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
      />
    )
  })

  return (
    <div className="flex items-center gap-6">
      <svg width="128" height="128" className="shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={BORDER} strokeWidth="14" />
        {slices}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill={MUTED} fontSize="9">TOTAL</text>
      </svg>
      <ul className="space-y-2.5">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-xs text-white font-medium">{seg.label}</span>
            <span className="text-xs ml-auto pl-4 tabular-nums" style={{ color: MUTED }}>{seg.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    pending: { color: '#f97316', bg: '#f9731615', label: 'Pending' },
    resolved: { color: '#22c55e', bg: '#22c55e15', label: 'Resolved' },
    dismissed: { color: '#6b7280', bg: '#6b728015', label: 'Dismissed' },
    open: { color: '#f97316', bg: '#f9731615', label: 'Open' },
  }
  const s = map[status?.toLowerCase()] ?? map.pending
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ color: s.color, backgroundColor: s.bg }}
    >
      <Circle className="w-1.5 h-1.5 fill-current" />
      {s.label}
    </span>
  )
}

// ─── Verification row ────────────────────────────────────────────────────────
function VerifRow({ item, index }) {
  const name = item?.name ?? item?.user?.name ?? `User #${index + 1}`
  const email = item?.email ?? item?.user?.email ?? '—'
  const status = item?.status ?? 'pending'

  return (
    <div
      className="flex items-center gap-3 py-3 border-b last:border-0"
      style={{ borderColor: BORDER }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
        style={{ background: 'linear-gradient(135deg,#f97316,#b45309)' }}
      >
        {name[0]?.toUpperCase() ?? 'U'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{name}</p>
        <p className="text-[11px] truncate" style={{ color: MUTED }}>{email}</p>
      </div>
      <StatusBadge status={status} />
    </div>
  )
}

// ─── Report row ───────────────────────────────────────────────────────────────
function ReportRow({ item, index }) {
  const reason = item?.reason ?? item?.type ?? `Report #${index + 1}`
  const reporter = item?.reporter?.name ?? item?.reportedBy ?? '—'
  const status = item?.status ?? 'pending'

  return (
    <div
      className="flex items-center gap-3 py-3 border-b last:border-0"
      style={{ borderColor: BORDER }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: '#f9731615' }}
      >
        <ShieldAlert className="w-4 h-4" style={{ color: '#f97316' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate capitalize">{reason}</p>
        <p className="text-[11px] truncate" style={{ color: MUTED }}>by {reporter}</p>
      </div>
      <StatusBadge status={status} />
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: countData, isLoading: loadingCount } = useUsersCount()
  const { data: matchData, isLoading: loadingMatch } = useMatchCount()
  const { data: verifData, isLoading: loadingVerif } = useFaceVerifications({ status: 'pending', limit: 5 })
  const { data: reportsData, isLoading: loadingReports } = useReports({ limit: 5 })
  const { data: adminsData, isLoading: loadingAdmins } = useAdmins()

  // Safely extract counts
  const totalUsers = countData?.total ?? countData?.totalUsers ?? countData?.count ?? '—'
  const activeUsers = countData?.active ?? countData?.activeUsers ?? '—'
  const suspendedCount = countData?.suspended ?? countData?.suspendedUsers ?? '—'

  const totalMatches = matchData?.total ?? matchData?.count ?? '—'
  const totalLikes = matchData?.like ?? matchData?.likes ?? '—'
  const superLikes = matchData?.superLike ?? matchData?.superLikes ?? 0

  const pendingVerifs = Array.isArray(verifData)
    ? verifData
    : verifData?.records ?? verifData?.data ?? verifData?.verifications ?? []

  const recentReports = Array.isArray(reportsData)
    ? reportsData
    : reportsData?.records ?? reportsData?.data ?? reportsData?.reports ?? []

  const adminCount = Array.isArray(adminsData) ? adminsData.length
    : adminsData?.records?.length ?? adminsData?.data?.length ?? adminsData?.admins?.length ?? '—'

  // Match donut segments
  const matchSegments = [
    { label: 'Likes', value: typeof totalLikes === 'number' ? totalLikes : 0, color: '#f97316' },
    { label: 'Super Likes', value: typeof superLikes === 'number' ? superLikes : 0, color: '#fb923c' },
    { label: 'Dislikes', value: matchData?.dislike ?? 0, color: '#374151' },
  ]

  return (
    <div className="space-y-8">
      {/* ── Hero greeting ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Platform Overview
          </h1>
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            Real-time metrics across users, matches, verifications &amp; reports.
          </p>
        </div>
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border"
          style={{ backgroundColor: '#22c55e10', borderColor: '#22c55e30', color: '#22c55e' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
          Live Data
        </div>
      </div>

      {/* ── Stat cards ────────────────────────────────────────────── */}
      <section>
        <SectionTitle>Key Metrics</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <StatCard
            icon={Users} iconColor="#f97316" iconBg="#f9731620" accent="#f97316"
            label="Total Users" value={totalUsers}
            sub={activeUsers !== '—' ? `${activeUsers} active` : undefined}
            isLoading={loadingCount}
          />
          <StatCard
            icon={UserX} iconColor="#ef4444" iconBg="#ef444420" accent="#ef4444"
            label="Suspended" value={suspendedCount}
            sub="Platform bans"
            isLoading={loadingCount}
          />
          <StatCard
            icon={Heart} iconColor="#f97316" iconBg="#f9731620" accent="#f97316"
            label="Total Matches" value={totalMatches}
            sub={typeof totalLikes === 'number' ? `${totalLikes} likes` : undefined}
            isLoading={loadingMatch}
          />
          <StatCard
            icon={ScanFace} iconColor="#a78bfa" iconBg="#a78bfa20" accent="#a78bfa"
            label="Pending Verif." value={pendingVerifs.length}
            sub="Face ID queue"
            isLoading={loadingVerif}
          />
          <StatCard
            icon={ShieldAlert} iconColor="#ef4444" iconBg="#ef444420" accent="#ef4444"
            label="Open Reports" value={recentReports.filter(r => (r.status ?? 'pending') === 'pending').length || recentReports.length}
            sub="Needs review"
            isLoading={loadingReports}
          />
          <StatCard
            icon={ShieldCheck} iconColor="#22c55e" iconBg="#22c55e20" accent="#22c55e"
            label="Admins" value={adminCount}
            sub="Active console users"
            isLoading={loadingAdmins}
          />
          <StatCard
            icon={TrendingUp} iconColor="#f97316" iconBg="#f9731620" accent="#f97316"
            label="Super Likes" value={superLikes}
            sub="Premium interactions"
            isLoading={loadingMatch}
          />
          <StatCard
            icon={CheckCircle2} iconColor="#22c55e" iconBg="#22c55e20" accent="#22c55e"
            label="Dislikes" value={matchData?.dislike ?? '—'}
            sub="Pass interactions"
            isLoading={loadingMatch}
          />
        </div>
      </section>

      {/* ── Bento row: Donut + Reports + Verif ────────────────────── */}
      <section>
        <SectionTitle>Activity Breakdown</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Match engagement donut */}
          <div
            className="rounded-2xl border p-5 flex flex-col gap-4"
            style={{ backgroundColor: CARD, borderColor: BORDER }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Match Engagement</p>
                <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>Likes vs Super Likes vs Dislikes</p>
              </div>
              <Heart className="w-4 h-4" style={{ color: '#f97316' }} />
            </div>
            {loadingMatch ? (
              <div className="flex items-center gap-6">
                <Skeleton className="w-32 h-32 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-2/4" />
                </div>
              </div>
            ) : (
              <DonutChart segments={matchSegments} />
            )}
          </div>

          {/* Pending face verifications */}
          <div
            className="rounded-2xl border p-5 flex flex-col gap-1"
            style={{ backgroundColor: CARD, borderColor: BORDER }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-white">Face Verif. Queue</p>
                <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>Pending ID reviews</p>
              </div>
              <ScanFace className="w-4 h-4" style={{ color: '#a78bfa' }} />
            </div>
            {loadingVerif ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-2 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : pendingVerifs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <CheckCircle2 className="w-8 h-8" style={{ color: '#22c55e' }} />
                <p className="text-sm font-medium text-white">All clear</p>
                <p className="text-xs" style={{ color: MUTED }}>No pending verifications</p>
              </div>
            ) : (
              pendingVerifs.slice(0, 5).map((item, i) => (
                <VerifRow key={item._id ?? i} item={item} index={i} />
              ))
            )}
          </div>

          {/* Recent reports */}
          <div
            className="rounded-2xl border p-5 flex flex-col gap-1"
            style={{ backgroundColor: CARD, borderColor: BORDER }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-white">Recent Reports</p>
                <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>Latest user reports</p>
              </div>
              <ShieldAlert className="w-4 h-4" style={{ color: '#ef4444' }} />
            </div>
            {loadingReports ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-xl" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-2 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <CheckCircle2 className="w-8 h-8" style={{ color: '#22c55e' }} />
                <p className="text-sm font-medium text-white">No open reports</p>
              </div>
            ) : (
              recentReports.slice(0, 5).map((item, i) => (
                <ReportRow key={item._id ?? i} item={item} index={i} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── Users table preview ────────────────────────────────────── */}
      <section>
        <SectionTitle>Recent Users</SectionTitle>
        <RecentUsersTable />
      </section>
    </div>
  )
}

// ─── Recent users inline table ────────────────────────────────────────────────
function RecentUsersTable() {
  const { data, isLoading } = useUsers({ limit: 8 })
  const users = Array.isArray(data) ? data : data?.records ?? data?.data ?? data?.users ?? []

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: CARD, borderColor: BORDER }}
    >
      {/* Table header */}
      <div
        className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 px-5 py-3 border-b text-[10px] font-semibold uppercase tracking-widest"
        style={{ borderColor: BORDER, color: MUTED }}
      >
        <span>User</span>
        <span>Email</span>
        <span>Status</span>
        <span className="text-right">Joined</span>
      </div>

      {/* Rows */}
      {isLoading ? (
        <div className="p-5 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-3 w-16 ml-auto" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <Users className="w-8 h-8" style={{ color: MUTED }} />
          <p className="text-sm" style={{ color: MUTED }}>No users found</p>
        </div>
      ) : (
        <div>
          {users.slice(0, 8).map((u, i) => {
            const name = u?.name ?? u?.displayName ?? `User ${i + 1}`
            const email = u?.email ?? '—'
            const status = u?.status ?? (u?.isSuspended ? 'suspended' : 'active')
            const joined = u?.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'
            const initials = name[0]?.toUpperCase() ?? 'U'

            return (
              <div
                key={u._id ?? i}
                className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 px-5 py-3.5 items-center border-b last:border-0 hover:bg-white/2 transition-colors"
                style={{ borderColor: BORDER }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                    style={{ background: 'linear-gradient(135deg,#f97316,#b45309)' }}
                  >
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-white truncate">{name}</span>
                </div>

                <span className="text-sm truncate" style={{ color: MUTED }}>{email}</span>

                <div>
                  {status === 'suspended' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">
                      <XCircle className="w-3 h-3" /> Suspended
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  )}
                </div>

                <span className="text-sm text-right" style={{ color: MUTED }}>{joined}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer */}
      <div
        className="px-5 py-3 border-t flex items-center justify-between"
        style={{ borderColor: BORDER }}
      >
        <span className="text-xs" style={{ color: MUTED }}>
          Showing {Math.min(users.length, 8)} of {users.length} loaded
        </span>
        <a href="#/users" className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1">
          View all <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
