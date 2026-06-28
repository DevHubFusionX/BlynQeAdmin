import { useUsersCount } from '../../hooks/users/useUsersCount.js'
import { Users, UserCheck, UserX } from 'lucide-react'
import { C, Skeleton } from './ui.jsx'

function StatItem({ icon: Icon, color, label, value, isLoading }) {
  return (
    <div
      className="p-5 rounded-2xl border flex items-center justify-between"
      style={{ backgroundColor: C.card, borderColor: C.border }}
    >
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: C.muted }}>
          {label}
        </p>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <p className="text-3xl font-black text-white tabular-nums tracking-tight">
            {value ?? 0}
          </p>
        )}
      </div>
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}10` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
    </div>
  )
}

export default function StatsBar() {
  const { data: countData, isLoading } = useUsersCount()

  const total = countData?.total ?? countData?.totalUsers ?? countData?.count ?? 0
  const active = countData?.active ?? countData?.activeUsers ?? 0
  const suspended = countData?.suspended ?? countData?.suspendedUsers ?? 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatItem
        icon={Users}
        color="#f97316"
        label="Total Users"
        value={total}
        isLoading={isLoading}
      />
      <StatItem
        icon={UserCheck}
        color="#22c55e"
        label="Active Users"
        value={active}
        isLoading={isLoading}
      />
      <StatItem
        icon={UserX}
        color="#ef4444"
        label="Suspended Users"
        value={suspended}
        isLoading={isLoading}
      />
    </div>
  )
}
