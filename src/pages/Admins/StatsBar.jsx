import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react'
import { C, Skeleton } from '../Users/ui.jsx'

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

export default function StatsBar({ admins = [], isLoading }) {
  const total = admins.length
  const active = admins.filter(a => (a.status ?? 'active').toLowerCase() === 'active').length
  // Default system super-admin role ID or check name/role properties
  const superAdmins = admins.filter(a => a.roleId === '6a30215aa55aafcc197488a8' || a.role === 'super-admin').length

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatItem
        icon={Shield}
        color="#f97316"
        label="Total Admins"
        value={total}
        isLoading={isLoading}
      />
      <StatItem
        icon={ShieldCheck}
        color="#22c55e"
        label="Active Operators"
        value={active}
        isLoading={isLoading}
      />
      <StatItem
        icon={ShieldAlert}
        color="#a78bfa"
        label="Super Admins"
        value={superAdmins}
        isLoading={isLoading}
      />
    </div>
  )
}
