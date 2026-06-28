import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Heart,
  TriangleAlert,
  Mail,
  Settings,
  HelpCircle,
  ChevronDown,
} from 'lucide-react'
import { useReports } from '../../../hooks/reports/useReports.js'

const SECTIONS = [
  {
    label: 'Platform',
    items: [
      { to: '/',        label: 'Dashboard',     Icon: LayoutDashboard },
      { to: '/users',   label: 'Users',          Icon: Users },
      { to: '/admins',  label: 'Admins',         Icon: ShieldCheck },
    ],
  },
  {
    label: 'Activity',
    items: [
      { to: '/match',   label: 'Matches',        Icon: Heart },
      { to: '/reports', label: 'Reports',        Icon: TriangleAlert },
    ],
  },
  {
    label: 'Communications',
    items: [
      { to: '/email',   label: 'Email Console',  Icon: Mail },
    ],
  },
]

const BOTTOM_ITEMS = [
  { to: '#help',     label: 'Help',     Icon: HelpCircle },
  { to: '#settings', label: 'Settings', Icon: Settings },
]

export default function Sidebar() {
  const { data: pendingData } = useReports({ status: 'pendings', limit: 1 })
  const pendingCount = pendingData?.pagination?.total ?? pendingData?.records?.length ?? 0

  return (
    <aside
      style={{ backgroundColor: '#1a1c23', borderColor: '#23252e' }}
      className="w-60 flex flex-col shrink-0 border-r"
    >
      {/* ── Logo ── */}
      <div className="h-[64px] flex items-center gap-3 px-5 border-b" style={{ borderColor: '#23252e' }}>
        <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0">
          <span className="text-white font-black text-sm tracking-tight">B</span>
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-white font-bold text-sm tracking-wide">Blynque</span>
          <span className="text-[10px] font-medium" style={{ color: '#6b7280' }}>Admin Console</span>
        </div>
        <ChevronDown className="ml-auto w-4 h-4 shrink-0" style={{ color: '#4b5563' }} />
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {SECTIONS.map((section) => (
          <div key={section.label}>
            <p
              className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: '#4b5563' }}
            >
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map(({ to, label, Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      isActive
                        ? 'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all bg-orange-500/15 text-orange-400'
                        : 'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all text-gray-400 hover:bg-white/5 hover:text-white'
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-all ${
                            isActive
                              ? 'bg-orange-500 shadow-md shadow-orange-500/40 text-white'
                              : 'bg-white/5 text-gray-500'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <span>{label}</span>
                        {label === 'Reports' && pendingCount > 0 && (
                          <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            isActive ? 'bg-orange-500 text-white' : 'bg-red-500/20 text-red-400 animate-pulse'
                          }`}>
                            {pendingCount}
                          </span>
                        )}
                        {isActive && (label !== 'Reports' || pendingCount === 0) && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Bottom ── */}
      <div className="px-3 pb-4 space-y-0.5 border-t pt-3" style={{ borderColor: '#23252e' }}>
        {BOTTOM_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-white/5 hover:text-white transition-all"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 shrink-0">
              <Icon className="w-3.5 h-3.5" />
            </span>
            {label}
          </NavLink>
        ))}

        {/* ── Admin pill ── */}
        <div
          className="mt-3 mx-1 flex items-center gap-3 rounded-xl px-3 py-2.5"
          style={{ backgroundColor: '#23252e' }}
        >
          <div className="w-7 h-7 rounded-full bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md shadow-orange-500/20">
            A
          </div>
          <div className="flex flex-col leading-none min-w-0">
            <span className="text-white text-xs font-semibold truncate">Admin</span>
            <span className="text-[10px] truncate" style={{ color: '#6b7280' }}>admin@blynque.com</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
