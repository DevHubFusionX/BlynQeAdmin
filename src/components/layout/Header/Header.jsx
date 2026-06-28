import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, Search, Plus } from 'lucide-react'
import { useAuthStore } from '../../../store/authStore.js'
import { useLogout } from '../../../hooks/auth/index.js'

// Map routes → friendly page titles
const PAGE_TITLES = {
  '/':        'Dashboard',
  '/users':   'Users',
  '/admins':  'Admins',
  '/match':   'Matches',
  '/reports': 'Reports',
  '/email':   'Email Console',
}

function getDateString() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

function getInitials(name, email) {
  if (name) {
    const parts = name.trim().split(' ')
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase()
  }
  if (email) return email[0].toUpperCase()
  return 'A'
}

export default function Header() {
  const user = useAuthStore((s) => s.user)
  const { mutate: doLogout, isPending } = useLogout()
  const location = useLocation()

  const [date] = useState(getDateString)
  const [showUser, setShowUser] = useState(false)
  const dropdownRef = useRef(null)

  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Console'
  const initials = getInitials(user?.name, user?.email)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUser(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header
      className="h-[64px] flex items-center gap-4 px-5 shrink-0 border-b"
      style={{ backgroundColor: '#1a1c23', borderColor: '#23252e' }}
    >
      {/* ── Left: page title + date ── */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex flex-col leading-none min-w-0">
          <span className="text-white text-sm font-semibold truncate">{pageTitle}</span>
          <span className="text-[11px] mt-0.5 truncate" style={{ color: '#6b7280' }}>{date}</span>
        </div>
      </div>

      {/* ── Spacer ── */}
      <div className="flex-1" />

      {/* ── Search bar ── */}
      <div
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm cursor-text transition-colors"
        style={{ backgroundColor: '#23252e', minWidth: '200px' }}
        onClick={() => {}}
      >
        <Search className="w-3.5 h-3.5 shrink-0" style={{ color: '#6b7280' }} />
        <span style={{ color: '#4b5563' }} className="flex-1 text-sm select-none">Search</span>
        <div
          className="flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium"
          style={{ backgroundColor: '#2e303a', color: '#6b7280' }}
        >
          <span>⌘</span><span>K</span>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center gap-2">
        {/* Bell */}
        <button
          className="relative w-8 h-8 flex items-center justify-center rounded-xl transition-colors hover:bg-white/5"
          style={{ color: '#9ca3af' }}
        >
          <Bell className="w-4 h-4" />
          {/* Unread dot */}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-orange-500" />
        </button>

        {/* + New button */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all shadow-md shadow-orange-500/20 cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
          <span>New</span>
        </button>

        {/* User avatar + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowUser((v) => !v)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer ring-2 ring-transparent hover:ring-orange-500/50 transition-all shadow-md shadow-orange-500/20"
            style={{
              background: 'linear-gradient(135deg, #f97316, #b45309)',
            }}
            title={user?.name ?? user?.email ?? 'Admin'}
          >
            {initials}
          </button>

          {/* Dropdown */}
          {showUser && (
            <div
              className="absolute right-0 top-10 w-52 rounded-2xl border shadow-xl z-50 py-2 overflow-hidden"
              style={{ backgroundColor: '#1e2028', borderColor: '#2e303a' }}
            >
              {/* Identity */}
              <div className="px-4 py-3 border-b" style={{ borderColor: '#2e303a' }}>
                <p className="text-white text-sm font-semibold truncate">{user?.name ?? 'Admin'}</p>
                <p className="text-[11px] truncate mt-0.5" style={{ color: '#6b7280' }}>
                  {user?.email ?? 'admin@blynque.com'}
                </p>
                <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block" />
                  Live
                </span>
              </div>

              {/* Sign out */}
              <button
                onClick={() => { setShowUser(false); doLogout() }}
                disabled={isPending}
                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isPending ? 'Signing out…' : '↪  Sign out'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
