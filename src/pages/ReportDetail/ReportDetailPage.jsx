import { useParams, useNavigate } from 'react-router-dom'
import { useReport } from '../../hooks/reports/useReport.js'
import { C, Skeleton } from '../Users/ui.jsx'
import {
  ArrowLeft,
  Calendar,
  Clock,
  ShieldAlert,
  User,
  Mail,
  Fingerprint,
  ExternalLink,
  Shield,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

export default function ReportDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: report, isLoading, error } = useReport(id)

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        weekday: 'short',
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

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <button
          onClick={() => navigate('/reports')}
          className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to reports log
        </button>

        <div
          className="rounded-2xl border p-6 space-y-6"
          style={{ backgroundColor: C.card, borderColor: C.border }}
        >
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 pt-4">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <button
          onClick={() => navigate('/reports')}
          className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to reports log
        </button>

        <div
          className="rounded-2xl border p-12 text-center"
          style={{ backgroundColor: C.card, borderColor: C.border }}
        >
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">Report Not Found</h2>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            {error?.message ?? "The requested incident report ID is invalid or does not exist."}
          </p>
        </div>
      </div>
    )
  }

  const reporterName = report.reporter
    ? `${report.reporter.firstName ?? ''} ${report.reporter.lastName ?? ''}`.trim()
    : 'Anonymous'
  const reporterEmail = report.reporter?.email ?? 'No email'
  const photoUrl = report.reporter?.photo?.url
  const reporterId = report.reporter?._id ?? report.reporter?.id
  const status = report.status ?? 'pending'

  // Render Status Badge helper
  const renderStatusBadge = (status = 'pending') => {
    const normalized = status.toLowerCase()
    if (normalized === 'pending' || normalized === 'pendings') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400">
          <Clock className="w-3.5 h-3.5" />
          Pending Review
        </span>
      )
    }
    if (normalized === 'resolved') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
          <CheckCircle className="w-3.5 h-3.5" />
          Resolved
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-gray-500/10 text-gray-400">
        <AlertTriangle className="w-3.5 h-3.5" />
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ── Back Navigation ── */}
      <button
        onClick={() => navigate('/reports')}
        className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to reports log
      </button>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
            >
              <Shield className="w-4 h-4 text-red-500" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Report Log Details</h1>
          </div>
          <p className="text-xs mt-1" style={{ color: C.muted }}>
            ID: <span className="font-mono select-all text-gray-300">{report._id ?? report.id}</span>
          </p>
        </div>
        <div className="shrink-0">
          {renderStatusBadge(status)}
        </div>
      </div>

      {/* ── Grid Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
        
        {/* Left Column: Report incident detail card */}
        <div className="space-y-6">
          <div
            className="rounded-2xl border p-6 space-y-6"
            style={{ backgroundColor: C.card, borderColor: C.border }}
          >
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2">Description</h2>
              <div className="bg-white/3 border rounded-xl p-4 leading-relaxed text-sm text-gray-200 min-h-[120px] whitespace-pre-wrap" style={{ borderColor: C.border }}>
                {report.description || 'No detailed explanation provided for this report.'}
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-6" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 shrink-0">
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-gray-500">Filed Date</p>
                  <p className="text-xs font-semibold text-white mt-0.5">{formatDate(report.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 shrink-0">
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-gray-500">Last Updated</p>
                  <p className="text-xs font-semibold text-white mt-0.5">{formatDate(report.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Reporter profile summary card */}
        <div className="space-y-6">
          <div
            className="rounded-2xl border p-6 flex flex-col items-center text-center relative overflow-hidden"
            style={{ backgroundColor: C.card, borderColor: C.border }}
          >
            {/* Subtle glow background */}
            <div
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 blur-2xl pointer-events-none bg-orange-500"
            />

            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-5 self-start">Reporter Profile</h3>

            {photoUrl ? (
              <img
                src={photoUrl}
                alt={reporterName}
                className="w-20 h-20 rounded-full object-cover select-none border-2 border-orange-500/20 mb-4"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl select-none mb-4 shadow-lg shadow-orange-500/10"
                style={{ background: 'linear-gradient(135deg,#f97316,#b45309)' }}
              >
                {reporterName[0]?.toUpperCase() ?? 'A'}
              </div>
            )}

            <h4 className="text-base font-bold text-white">{reporterName}</h4>
            <p className="text-xs mt-1" style={{ color: C.muted }}>User Account</p>

            {/* Profile fields info list */}
            <div className="w-full mt-6 space-y-3.5 border-t pt-5 text-left" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] uppercase font-semibold tracking-wider text-gray-500 leading-none">Email</p>
                  <p className="text-xs text-white truncate font-medium mt-1">{reporterEmail}</p>
                </div>
              </div>

              {reporterId && (
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-4 h-4 text-gray-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[9px] uppercase font-semibold tracking-wider text-gray-500 leading-none">User ID</p>
                    <p className="text-xs text-white font-mono truncate mt-1 select-all">{reporterId}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Inspect User Account Button */}
            {reporterId && (
              <button
                onClick={() => navigate(`/users/${reporterId}`)}
                className="w-full mt-6 py-2.5 px-4 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <User className="w-4 h-4" />
                Inspect Account
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
