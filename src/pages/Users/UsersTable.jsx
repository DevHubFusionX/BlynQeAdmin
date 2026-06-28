import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight, MoreHorizontal, Eye, Ban, ShieldCheck, Trash2 } from 'lucide-react'
import { C, Skeleton, Avatar, Badge, EmptyState } from './ui.jsx'

export default function UsersTable({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  usersData,
  isLoading,
  page,
  setPage,
  onViewDetails,
  onSuspendToggle,
  onDelete,
}) {
  const [openDropdownId, setOpenDropdownId] = useState(null)

  const users = Array.isArray(usersData) ? usersData : usersData?.records ?? usersData?.data ?? usersData?.users ?? []
  const hasMore = usersData?.hasMore ?? (users.length >= 10) // Fallback check

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      {/* ── Tabs & Search ── */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Tabs */}
        <div className="flex p-1 rounded-xl bg-white/3 border shrink-0" style={{ borderColor: C.border }}>
          {['all', 'suspended', 'face-id'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                setPage(1)
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Search */}
        {activeTab !== 'face-id' && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm border w-full sm:max-w-xs"
            style={{ backgroundColor: C.card, borderColor: C.border }}
          >
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name, email..."
              className="bg-transparent text-white placeholder-gray-500 outline-none text-xs w-full"
            />
          </div>
        )}
      </div>

      {/* ── Table Container ── */}
      {activeTab !== 'face-id' && (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: C.card, borderColor: C.border }}
        >
          {/* Header */}
          <div
            className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-6 py-3.5 border-b text-[10px] font-semibold uppercase tracking-widest"
            style={{ borderColor: C.border, color: C.muted }}
          >
            <span>User</span>
            <span>Email</span>
            <span>Status</span>
            <span>Joined</span>
            <span className="w-8 text-right">Actions</span>
          </div>

          {/* Rows */}
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="w-8 h-8 rounded" />
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No Users Found"
              description="No user records match your current criteria or search query."
            />
          ) : (
            <div className="divide-y" style={{ divideColor: C.border }}>
              {users.map((u, i) => {
                const name = u?.name ?? u?.displayName ?? `User ${i + 1}`
                const email = u?.email ?? '—'
                const status = u?.status ?? (u?.isSuspended ? 'suspended' : 'active')
                const joined = u?.createdAt
                  ? new Date(u.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : '—'
                const userId = u?._id ?? u?.id

                return (
                  <div
                    key={userId ?? i}
                    className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center hover:bg-white/1 transition-colors"
                  >
                    {/* User profile */}
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={name} size={8} />
                      <span className="text-sm font-semibold text-white truncate">{name}</span>
                    </div>

                    {/* Email */}
                    <span className="text-xs truncate" style={{ color: C.muted }}>
                      {email}
                    </span>

                    {/* Status */}
                    <div>
                      <Badge status={status} />
                    </div>

                    {/* Joined Date */}
                    <span className="text-xs" style={{ color: C.muted }}>
                      {joined}
                    </span>

                    {/* Actions Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdownId(openDropdownId === userId ? null : userId)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white cursor-pointer"
                      >
                        <MoreHorizontal className="w-4.5 h-4.5" />
                      </button>

                      {openDropdownId === userId && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)} />
                          <div
                            className="absolute right-0 mt-1 w-44 rounded-xl border shadow-xl z-20 p-1.5 space-y-0.5"
                            style={{ backgroundColor: C.card, borderColor: C.border }}
                          >
                            <button
                              onClick={() => {
                                setOpenDropdownId(null)
                                onViewDetails(userId)
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-2 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> View details
                            </button>
                            <button
                              onClick={() => {
                                setOpenDropdownId(null)
                                onSuspendToggle(u)
                              }}
                              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer ${
                                status === 'suspended'
                                  ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
                                  : 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                              }`}
                            >
                              {status === 'suspended' ? (
                                <>
                                  <ShieldCheck className="w-3.5 h-3.5" /> Unsuspend user
                                </>
                              ) : (
                                <>
                                  <Ban className="w-3.5 h-3.5" /> Suspend user
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setOpenDropdownId(null)
                                onDelete(u)
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-lg flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete user
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

          {/* Pagination controls */}
          <div
            className="px-6 py-4 border-t flex items-center justify-between"
            style={{ borderColor: C.border }}
          >
            <span className="text-xs" style={{ color: C.muted }}>
              Page {page}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 cursor-pointer"
                style={{ borderColor: C.border }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={!hasMore || users.length < 10}
                onClick={() => setPage(page + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 cursor-pointer"
                style={{ borderColor: C.border }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
