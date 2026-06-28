import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReports } from '../../hooks/reports/useReports.js'
import { C, Skeleton, EmptyState } from '../Users/ui.jsx'
import {
  ShieldAlert,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Inbox
} from 'lucide-react'

export default function ReportsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'pending'
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  // Fetch paginated reports
  const queryParams = {
    page,
    limit: 10,
    ...(activeTab === 'pending' ? { status: 'pendings' } : {})
  }
  const { data: reportsData, isLoading } = useReports(queryParams)

  // Fetch a quick summary count for the metrics bar
  const { data: allReportsSummary } = useReports({ limit: 1 })
  const { data: pendingReportsSummary } = useReports({ status: 'pendings', limit: 1 })

  // Extract records from the envelope
  const records = reportsData?.records ?? reportsData?.data ?? reportsData?.reports ?? (Array.isArray(reportsData) ? reportsData : [])

  // Client-side search filtering (filtering by description or reporter name)
  const filteredRecords = records.filter((item) => {
    const desc = (item?.description ?? '').toLowerCase()
    const firstName = (item?.reporter?.firstName ?? '').toLowerCase()
    const lastName = (item?.reporter?.lastName ?? '').toLowerCase()
    const email = (item?.reporter?.email ?? '').toLowerCase()
    const query = searchQuery.toLowerCase()

    return desc.includes(query) || firstName.includes(query) || lastName.includes(query) || email.includes(query)
  })

  // Pagination helpers
  const pagination = reportsData?.pagination
  const hasNext = pagination ? pagination.hasNext : (records.length >= 10)
  const hasPrev = page > 1
  const totalRecords = pagination?.total ?? (activeTab === 'all' ? allReportsSummary?.pagination?.total : pendingReportsSummary?.pagination?.total) ?? records.length

  const pendingCount = pendingReportsSummary?.pagination?.total ?? 0
  const allCount = allReportsSummary?.pagination?.total ?? 0

  // Format Date Helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateStr
    }
  }

  // Render Status Badge
  const renderStatus = (status = 'pending') => {
    const normalized = status.toLowerCase()
    if (normalized === 'pending' || normalized === 'pendings') {
      return (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Pending
        </span>
      )
    }
    if (normalized === 'resolved') {
      return (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Resolved
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-gray-500/10 text-gray-400">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Abuse &amp; Report Logs</h1>
          <p className="text-sm mt-1" style={{ color: C.muted }}>
            Review, investigate, and act on safety violations and user reports.
          </p>
        </div>
      </div>

      {/* ── Metrics Bar ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Total Reports */}
        <div
          className="relative flex items-center gap-4 p-5 rounded-2xl border overflow-hidden"
          style={{ backgroundColor: C.card, borderColor: C.border }}
        >
          <div
            className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
            style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}
          >
            <ShieldAlert className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white tabular-nums">{allCount}</p>
            <p className="text-xs font-medium" style={{ color: C.muted }}>Total Logged Reports</p>
          </div>
        </div>

        {/* Card 2: Pending Reports */}
        <div
          className="relative flex items-center gap-4 p-5 rounded-2xl border overflow-hidden"
          style={{ backgroundColor: C.card, borderColor: C.border }}
        >
          <div
            className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
            style={{ backgroundColor: pendingCount > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)' }}
          >
            <AlertTriangle className={`w-6 h-6 ${pendingCount > 0 ? 'text-red-500' : 'text-emerald-500'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-white tabular-nums">{pendingCount}</p>
              {pendingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
            </div>
            <p className="text-xs font-medium" style={{ color: C.muted }}>Pending Actions</p>
          </div>
        </div>

        {/* Card 3: Action Rate */}
        <div
          className="relative flex items-center gap-4 p-5 rounded-2xl border overflow-hidden"
          style={{ backgroundColor: C.card, borderColor: C.border }}
        >
          <div
            className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
          >
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white tabular-nums">
              {allCount > 0 ? `${Math.round(((allCount - pendingCount) / allCount) * 100)}%` : '100%'}
            </p>
            <p className="text-xs font-medium" style={{ color: C.muted }}>Resolution Rate</p>
          </div>
        </div>
      </div>

      {/* ── Controls Row ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Tabs */}
        <div className="flex p-1 rounded-xl bg-white/3 border shrink-0 w-fit" style={{ borderColor: C.border }}>
          {[
            { id: 'all', label: 'All Reports', count: allCount },
            { id: 'pending', label: 'Pending Queue', count: pendingCount }
          ].map((tab) => {
            const isSelected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setPage(1)
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                  isSelected ? 'bg-orange-600 text-orange-100' : 'bg-white/5 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Search by reporter, reason..."
            className="w-full bg-white/3 border text-xs text-white rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-500"
            style={{ borderColor: C.border }}
          />
        </div>
      </div>

      {/* ── Table / Grid Area ── */}
      {isLoading ? (
        <div
          className="rounded-2xl border p-6 space-y-4"
          style={{ backgroundColor: C.card, borderColor: C.border }}
        >
          <div className="flex justify-between border-b pb-4" style={{ borderColor: C.border }}>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      ) : filteredRecords.length === 0 ? (
        <div
          className="rounded-2xl border"
          style={{ backgroundColor: C.card, borderColor: C.border }}
        >
          <EmptyState
            icon={Inbox}
            title={searchQuery ? 'No matching reports' : 'All clear'}
            description={searchQuery ? 'Try adjusting your search terms.' : 'No safety incident reports in this queue.'}
          />
        </div>
      ) : (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: C.card, borderColor: C.border }}
        >
          {/* Table Header */}
          <div
            className="grid grid-cols-[2.5fr_3fr_1.5fr_1.2fr_1fr] gap-4 px-5 py-3.5 border-b text-[10px] font-semibold uppercase tracking-widest"
            style={{ borderColor: C.border, color: C.muted }}
          >
            <span>Reporter</span>
            <span>Reason / Description</span>
            <span>Filed Date</span>
            <span>Status</span>
            <span className="text-right">Action</span>
          </div>

          {/* Rows */}
          <div className="divide-y" style={{ divideColor: C.border }}>
            {filteredRecords.map((item) => {
              const reporterName = item?.reporter
                ? `${item.reporter.firstName ?? ''} ${item.reporter.lastName ?? ''}`.trim()
                : 'Anonymous'
              const reporterEmail = item?.reporter?.email ?? 'No email'
              const photoUrl = item?.reporter?.photo?.url
              const reportId = item?._id ?? item?.id

              return (
                <div
                  key={reportId}
                  className="grid grid-cols-[2.5fr_3fr_1.5fr_1.2fr_1fr] gap-4 px-5 py-4 items-center hover:bg-white/2 transition-colors group"
                >
                  {/* Column 1: Reporter Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={reporterName}
                        className="w-9 h-9 rounded-full object-cover shrink-0 select-none border border-white/10"
                      />
                    ) : (
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 select-none"
                        style={{ background: 'linear-gradient(135deg,#f97316,#b45309)' }}
                      >
                        {reporterName[0]?.toUpperCase() ?? 'A'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{reporterName}</p>
                      <p className="text-[11px] truncate" style={{ color: C.muted }}>{reporterEmail}</p>
                    </div>
                  </div>

                  {/* Column 2: Description */}
                  <div className="min-w-0 pr-4">
                    <p className="text-xs text-gray-300 font-medium line-clamp-2 leading-relaxed">
                      {item.description || 'No detailed description provided.'}
                    </p>
                  </div>

                  {/* Column 3: Filed Date */}
                  <div className="text-xs text-gray-400 font-medium">
                    {formatDate(item.createdAt)}
                  </div>

                  {/* Column 4: Status */}
                  <div>
                    {renderStatus(item.status)}
                  </div>

                  {/* Column 5: Action Button */}
                  <div className="text-right">
                    <button
                      onClick={() => navigate(`/reports/${reportId}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-orange-500 hover:text-white text-gray-300 text-xs font-semibold rounded-lg transition-all cursor-pointer group-hover:bg-white/10"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Inspect
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination Footer */}
          {totalRecords > 0 && (
            <div
              className="p-4 border-t flex items-center justify-between"
              style={{ borderColor: C.border }}
            >
              <span className="text-xs" style={{ color: C.muted }}>
                Showing page {page} of {Math.ceil(totalRecords / 10) || 1} ({records.length} items loaded)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={!hasPrev}
                  onClick={() => setPage(page - 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 cursor-pointer transition-colors"
                  style={{ borderColor: C.border }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={!hasNext}
                  onClick={() => setPage(page + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 cursor-pointer transition-colors"
                  style={{ borderColor: C.border }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
