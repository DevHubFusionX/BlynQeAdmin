import { useState } from 'react'
import { 
  useMatchCount, 
  useMatchHistory, 
  useLikes, 
  useSentLikes 
} from '../../hooks/match/index.js'
import StatsHeader from './StatsHeader.jsx'
import ConnectionCard from './ConnectionCard.jsx'
import ConnectionInspector from './ConnectionInspector.jsx'
import SimulateMatchModal from './SimulateMatchModal.jsx'
import { C, Skeleton, EmptyState } from '../Users/ui.jsx'
import { ChevronLeft, ChevronRight, Activity, Flame, Heart, ThumbsUp, PlusCircle } from 'lucide-react'

export default function MatchPage() {
  const [activeTab, setActiveTab] = useState('matches') // 'matches' | 'received-likes' | 'sent-likes'
  const [page, setPage] = useState(1)
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [simOpen, setSimOpen] = useState(false)

  // Fetch count
  const { data: countData, isLoading: countLoading } = useMatchCount()

  // Fetch lists depending on active tab
  const params = { page: String(page), limit: '10' }
  const matchesQuery = useMatchHistory(params)
  const receivedQuery = useLikes(params)
  const sentQuery = useSentLikes(params)

  // Reset selected connection and page when active tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setPage(1)
    setSelectedConnection(null)
  }

  // Get active query state
  const getActiveQuery = () => {
    if (activeTab === 'matches') return matchesQuery
    if (activeTab === 'received-likes') return receivedQuery
    return sentQuery
  }

  const activeQuery = getActiveQuery()
  const listData = activeQuery.data
  const isLoading = activeQuery.isLoading

  // Helper to extract the list array from the API response envelope
  const extractArray = (obj) => {
    if (!obj) return []
    if (Array.isArray(obj)) return obj
    if (Array.isArray(obj.records)) return obj.records
    if (Array.isArray(obj.data)) return obj.data
    if (Array.isArray(obj.matches)) return obj.matches
    if (Array.isArray(obj.history)) return obj.history
    if (Array.isArray(obj.likes)) return obj.likes
    for (const val of Object.values(obj)) {
      if (Array.isArray(val)) return val
    }
    return []
  }

  const items = extractArray(listData)

  console.log(`[Matches Debug] Active Tab: ${activeTab}, listData:`, listData, 'extracted items:', items)

  const hasMore = listData?.pagination 
    ? listData.pagination.hasNext 
    : (listData?.hasMore ?? (items.length >= 10))

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Matches &amp; Likes Logs</h1>
          <p className="text-sm mt-1" style={{ color: C.muted }}>
            Audit matching parameters, likes database logs, and simulate connections.
          </p>
        </div>
        <button
          onClick={() => setSimOpen(true)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Simulate Interaction
        </button>
      </div>

      {/* ── Metric Stats Row ── */}
      <StatsHeader matchData={countData} isLoading={countLoading} />

      {/* ── Split Layout Directory ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
        
        {/* Left Side: Directory Grid + Tabs */}
        <div className="space-y-4">
          
          {/* Tabs header */}
          <div className="flex p-1 rounded-xl bg-white/3 border shrink-0 w-fit" style={{ borderColor: C.border }}>
            {[
              { id: 'matches', label: 'Matches', icon: Flame },
              { id: 'received-likes', label: 'Received Likes', icon: Heart },
              { id: 'sent-likes', label: 'Sent Likes', icon: ThumbsUp }
            ].map((tab) => {
              const Icon = tab.icon
              const isSelected = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Cards Area */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-4 rounded-2xl border space-y-4" style={{ backgroundColor: C.card, borderColor: C.border }}>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20 rounded-full" />
                    <Skeleton className="h-3.5 w-16" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border" style={{ backgroundColor: C.card, borderColor: C.border }}>
              <EmptyState
                icon={Activity}
                title={`No ${activeTab.replace('-', ' ')} found`}
                description="This database queue is currently empty."
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((item, i) => {
                const connId = item?._id ?? item?.id ?? i
                const isSelected = selectedConnection?._id === connId || selectedConnection?.id === connId
                return (
                  <ConnectionCard
                    key={connId}
                    connection={item}
                    type={activeTab === 'matches' ? 'match' : 'like'}
                    selected={isSelected}
                    onClick={() => setSelectedConnection(item)}
                  />
                )
              })}
            </div>
          )}

          {/* Pagination bar */}
          {items.length > 0 && (
            <div
              className="p-4 border rounded-2xl flex items-center justify-between"
              style={{ backgroundColor: C.card, borderColor: C.border }}
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
                  disabled={listData?.pagination ? !listData.pagination.hasNext : (!hasMore || items.length < 10)}
                  onClick={() => setPage(page + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 cursor-pointer"
                  style={{ borderColor: C.border }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Connection Inspector */}
        <div className="lg:sticky lg:top-4 h-[calc(100vh-140px)]">
          <ConnectionInspector
            connection={selectedConnection}
            type={activeTab === 'matches' ? 'match' : 'like'}
          />
        </div>
      </div>

      {/* ── Simulation Modal ── */}
      {simOpen && (
        <SimulateMatchModal
          open={simOpen}
          onClose={() => setSimOpen(false)}
        />
      )}
    </div>
  )
}
