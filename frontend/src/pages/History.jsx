import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { reviewService } from '../services/reviewService'
import { ReviewSkeleton } from '../components/common/LoadingSkeleton'
import ScoreMeter from '../components/review/ScoreMeter'
import IssueList from '../components/review/IssueList'
import FixedCodeViewer from '../components/review/FixedCodeViewer'
import { LANGUAGES, formatDate, formatTime, getScoreColor } from '../utils/constants'
import { Search, Filter, ChevronDown, ChevronUp, Trash2, History as HistoryIcon } from 'lucide-react'
import toast from 'react-hot-toast'

function ReviewRow({ review, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const scoreColor = getScoreColor(review.score ?? 5)

  return (
    <div className="glass rounded-xl overflow-hidden">
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/2 transition-colors">
        {/* Score circle */}
        <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-display font-bold text-sm"
          style={{ borderColor: scoreColor, color: scoreColor }}>
          {review.score ?? '?'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-body text-white font-medium">{review.language}</span>
            <span className="text-xs text-muted font-body">·</span>
            <span className="text-xs text-muted font-body">{formatDate(review.created_at)}</span>
            <span className="text-xs text-muted font-body">{formatTime(review.created_at)}</span>
          </div>
          <p className="text-xs text-subtle font-body truncate">{review.summary || 'No summary available'}</p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={(e) => { e.stopPropagation(); onDelete(review.id) }}
            className="text-muted hover:text-danger transition-colors p-1 rounded">
            <Trash2 size={14} />
          </button>
          {expanded ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="border-t border-border p-5 space-y-5">
              <div className="flex items-center gap-6">
                <ScoreMeter score={review.score ?? 5} size={90} />
                <p className="text-sm text-subtle font-body leading-relaxed flex-1">{review.summary}</p>
              </div>

              {/* Original code snippet */}
              <div>
                <p className="text-xs text-muted font-body uppercase tracking-wider mb-2">Original Code</p>
                <div className="code-block p-4 max-h-48 overflow-auto">
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap">{review.original_code}</pre>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <IssueList review={review} />
                <FixedCodeViewer code={review.fixed_code} language={review.language} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function History() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [langFilter, setLangFilter] = useState('')

  const fetchReviews = () => {
    const params = {}
    if (langFilter) params.language = langFilter
    reviewService.getReviews(params)
      .then(setReviews)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchReviews() }, [langFilter])

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return
    try {
      await reviewService.deleteReview(id)
      setReviews(r => r.filter(x => x.id !== id))
      toast.success('Deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const filtered = reviews.filter(r =>
    !search || r.language.toLowerCase().includes(search.toLowerCase()) ||
    (r.summary || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-7">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <HistoryIcon size={26} className="text-accent" />
          Review History
        </h1>
        <p className="text-subtle font-body mt-1">{reviews.length} total reviews</p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews..."
            className="input-field pl-9 text-sm" />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <select value={langFilter} onChange={(e) => setLangFilter(e.target.value)}
            className="input-field pl-9 text-sm w-44 cursor-pointer appearance-none"
            style={{ background: '#111118' }}>
            <option value="">All languages</option>
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </motion.div>

      {/* List */}
      {loading ? <ReviewSkeleton /> : (
        filtered.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <HistoryIcon size={32} className="text-muted mx-auto mb-3" />
            <p className="text-white font-display font-semibold mb-1">No reviews yet</p>
            <p className="text-muted text-sm font-body">Submit your first code review to see it here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((review, i) => (
              <motion.div key={review.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}>
                <ReviewRow review={review} onDelete={handleDelete} />
              </motion.div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
