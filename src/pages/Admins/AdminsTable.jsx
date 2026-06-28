import { useState } from 'react'
import { Search, MoreHorizontal, Key } from 'lucide-react'
import { C, Skeleton, Avatar, Badge, EmptyState } from '../Users/ui.jsx'

export default function AdminsTable({
  admins = [],
  isLoading,
  onOpenCreate,
  onOpenInvite,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [openDropdownId, setOpenDropdownId] = useState(null)

  // Filter admins locally based on search
  const filteredAdmins = admins.filter(admin => {
    const name = (admin?.name ?? '').toLowerCase()
    const email = (admin?.email ?? '').toLowerCase()
    const query = searchQuery.toLowerCase()
    return name.includes(query) || email.includes(query)
  })

  const getRoleLabel = (roleId) => {
    if (roleId === '6a30215aa55aafcc197488a8') return 'Super Admin'
    return 'Console Operator'
  }

  return (
    <div className="space-y-4">
      {/* ── Search & Actions Bar ── */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm border w-full sm:max-w-xs"
          style={{ backgroundColor: C.card, borderColor: C.border }}
        >
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email..."
            className="bg-transparent text-white placeholder-gray-500 outline-none text-xs w-full"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenCreate}
          className="w-full sm:w-auto px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/10 transition-all cursor-pointer whitespace-nowrap"
        >
          + Add Admin
        </button>
      </div>

      {/* ── Table Container ── */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: C.card, borderColor: C.border }}
      >
        {/* Header */}
        <div
          className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1.5fr_auto] gap-4 px-6 py-3.5 border-b text-[10px] font-semibold uppercase tracking-widest"
          style={{ borderColor: C.border, color: C.muted }}
        >
          <span>Administrator</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span>Date Created</span>
          <span className="w-8 text-right">Actions</span>
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1.5fr_auto] gap-4 items-center">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="w-8 h-8 rounded" />
              </div>
            ))}
          </div>
        ) : filteredAdmins.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No Admins Found"
            description="No administrator records match your current search query."
          />
        ) : (
          <div className="divide-y animate-fadeIn" style={{ divideColor: C.border }}>
            {filteredAdmins.map((admin) => {
              const name = admin?.name ?? 'Admin Account'
              const email = admin?.email ?? '—'
              const role = getRoleLabel(admin?.roleId)
              const status = admin?.status ?? 'active'
              const joined = admin?.createdAt
                ? new Date(admin.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : '—'
              const adminId = admin?._id ?? admin?.id

              return (
                <div
                  key={adminId}
                  className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1.5fr_auto] gap-4 px-6 py-4 items-center hover:bg-white/1 transition-colors"
                >
                  {/* Avatar + Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={name} size={8} />
                    <span className="text-sm font-semibold text-white truncate">{name}</span>
                  </div>

                  {/* Email */}
                  <span className="text-xs truncate" style={{ color: C.muted }}>
                    {email}
                  </span>

                  {/* Role */}
                  <span className="text-xs text-gray-300 font-medium truncate">
                    {role}
                  </span>

                  {/* Status */}
                  <div>
                    <Badge status={status} />
                  </div>

                  {/* Date Created */}
                  <span className="text-xs" style={{ color: C.muted }}>
                    {joined}
                  </span>

                  {/* Actions Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdownId(openDropdownId === adminId ? null : adminId)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white cursor-pointer"
                    >
                      <MoreHorizontal className="w-4.5 h-4.5" />
                    </button>

                    {openDropdownId === adminId && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)} />
                        <div
                          className="absolute right-0 mt-1 w-48 rounded-xl border shadow-xl z-20 p-1.5 space-y-0.5"
                          style={{ backgroundColor: C.card, borderColor: C.border }}
                        >
                          <button
                            onClick={() => {
                              setOpenDropdownId(null)
                              onOpenInvite(adminId)
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-2 cursor-pointer"
                          >
                            <Key className="w-3.5 h-3.5" /> Copy invitation key
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
