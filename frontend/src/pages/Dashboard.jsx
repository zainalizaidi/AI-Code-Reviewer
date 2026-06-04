import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { reviewService } from '../services/reviewService'
import { useAuth } from '../context/AuthContext'
import { CardSkeleton } from '../components/common/LoadingSkeleton'
import WeeklyActivityChart from '../components/charts/WeeklyActivityChart'
import LanguagePieChart from '../components/charts/LanguagePieChart'
import ScoreTrendChart from '../components/charts/ScoreTrendChart'
import { getScoreColor, formatDate } from '../utils/constants'
import {
  Code2, TrendingUp, TrendingDown, Minus, ShieldAlert,
  Bug, Zap, ArrowRight, BarChart2, Activity
} from 'lucide-react'

const FADE = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay }
})

function StatCard({ icon: Icon, label, value, sub, accent = false }) {
  return (
    <motion.div {...FADE(0.05)}
      className="glass-hover rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center
          ${accent ? 'bg-accent/15 border border-accent/20' : 'bg-surface border border-border'}`}>
          <Icon size={16} className={accent ? 'text-accent' : 'text-muted'} />
        </div>
      </div>
      <p className="text-2xl font-display font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-muted font-body">{label}</p>
      {sub && <p className="text-xs text-subtle font-body mt-1">{sub}</p>}
    </motion.div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reviewService.getDashboard()
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  const TrendIcon = data?.stats?.score_trend === 'up' ? TrendingUp
    : data?.stats?.score_trend === 'down' ? TrendingDown : Minus

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div {...FADE()}>
        <h1 className="font-display text-3xl font-bold text-white">
          Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'},{' '}
          <span className="text-accent">{user?.username}</span>
        </h1>
        <p className="text-subtle font-body mt-1">Here's your code quality overview</p>
      </motion.div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Code2} label="Total Reviews" value={data?.stats?.total_reviews ?? 0} accent />
          <StatCard icon={BarChart2} label="Avg Score" value={`${data?.stats?.average_score ?? 0}/10`}
            sub={<span className="flex items-center gap-1">
              <TrendIcon size={11} className={
                data?.stats?.score_trend === 'up' ? 'text-accent' :
                data?.stats?.score_trend === 'down' ? 'text-danger' : 'text-muted'} />
              {data?.stats?.score_trend}
            </span>} />
          <StatCard icon={Activity} label="This Week" value={data?.stats?.reviews_this_week ?? 0} />
          <StatCard icon={Code2} label="Top Language" value={data?.stats?.most_used_language || '—'} />
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity */}
        <motion.div {...FADE(0.1)} className="glass rounded-xl p-6 lg:col-span-2">
          <h2 className="font-display font-semibold text-white text-sm mb-5 flex items-center gap-2">
            <Activity size={15} className="text-accent" />
            Weekly Activity
          </h2>
          {loading ? <div className="shimmer h-48 rounded-lg" /> :
            <WeeklyActivityChart data={data?.weekly_activity || []} />}
        </motion.div>

        {/* Language Distribution */}
        <motion.div {...FADE(0.15)} className="glass rounded-xl p-6">
          <h2 className="font-display font-semibold text-white text-sm mb-5 flex items-center gap-2">
            <Code2 size={15} className="text-accent" />
            Languages
          </h2>
          {loading ? <div className="shimmer h-48 rounded-lg" /> :
            <LanguagePieChart data={data?.language_distribution || []} />}
        </motion.div>
      </div>

      {/* Score trend + Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div {...FADE(0.2)} className="glass rounded-xl p-6 lg:col-span-2">
          <h2 className="font-display font-semibold text-white text-sm mb-5 flex items-center gap-2">
            <TrendingUp size={15} className="text-accent" />
            Score Trend
          </h2>
          {loading ? <div className="shimmer h-48 rounded-lg" /> :
            <ScoreTrendChart data={data?.recent_scores || []} />}
        </motion.div>

        {/* Issue Overview */}
        <motion.div {...FADE(0.25)} className="glass rounded-xl p-6">
          <h2 className="font-display font-semibold text-white text-sm mb-5">Issues Found</h2>
          {loading ? <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="shimmer h-12 rounded-lg" />)}</div> : (
            <div className="space-y-3">
              {[
                { label: 'Vulnerabilities', value: data?.issue_overview?.vulnerabilities ?? 0, icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-900/20' },
                { label: 'Bugs', value: data?.issue_overview?.bugs ?? 0, icon: Bug, color: 'text-orange-400', bg: 'bg-orange-900/20' },
                { label: 'Performance', value: data?.issue_overview?.performance ?? 0, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-900/20' },
              ].map(({ label, value, icon: I, color, bg }) => (
                <div key={label} className={`flex items-center gap-3 p-3 rounded-lg ${bg} border border-white/5`}>
                  <I size={15} className={color} />
                  <span className="text-sm font-body text-subtle flex-1">{label}</span>
                  <span className={`font-display font-bold text-sm ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          )}

          <Link to="/review"
            className="mt-5 flex items-center justify-center gap-2 w-full btn-primary text-sm">
            New Review <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
