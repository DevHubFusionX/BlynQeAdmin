import { Heart, Star, ThumbsUp, Flame } from 'lucide-react'
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

export default function StatsHeader({ matchData, isLoading }) {
  const totalMatches = matchData?.match ?? matchData?.matches ?? matchData?.total ?? matchData?.count ?? 0
  const totalLikes = matchData?.like ?? matchData?.likes ?? 0
  const superLikes = matchData?.superLike ?? matchData?.superLikes ?? 0
  const dislikes = matchData?.dislike ?? matchData?.dislikes ?? 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatItem
        icon={Flame}
        color="#f97316"
        label="Total Matches"
        value={totalMatches}
        isLoading={isLoading}
      />
      <StatItem
        icon={ThumbsUp}
        color="#38bdf8"
        label="Likes Logged"
        value={totalLikes}
        isLoading={isLoading}
      />
      <StatItem
        icon={Star}
        color="#a78bfa"
        label="Super Likes"
        value={superLikes}
        isLoading={isLoading}
      />
      <StatItem
        icon={Heart}
        color="#ef4444"
        label="Dislikes Logged"
        value={dislikes}
        isLoading={isLoading}
      />
    </div>
  )
}
