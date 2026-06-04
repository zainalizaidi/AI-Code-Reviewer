import { useState } from 'react'
import { ChevronDown, ChevronRight, AlertTriangle, Bug, Zap, Eye, Lightbulb } from 'lucide-react'
import Badge from '../common/Badge'
import { motion, AnimatePresence } from 'framer-motion'

const SECTION_CONFIG = {
  bugs: { label: 'Bugs', icon: Bug, color: 'text-red-400' },
  vulnerabilities: { label: 'Vulnerabilities', icon: AlertTriangle, color: 'text-orange-400' },
  performance_issues: { label: 'Performance', icon: Zap, color: 'text-yellow-400' },
  code_smells: { label: 'Code Smells', icon: Eye, color: 'text-purple-400' },
  suggestions: { label: 'Suggestions', icon: Lightbulb, color: 'text-blue-400' },
}

function IssueItem({ item, type }) {
  const [open, setOpen] = useState(false)
  const severity = item.severity || item.impact || item.priority || 'info'

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/3 transition-colors">
        {open ? <ChevronDown size={14} className="text-muted flex-shrink-0" />
               : <ChevronRight size={14} className="text-muted flex-shrink-0" />}
        <span className="text-sm text-white font-body flex-1">{item.title}</span>
        <Badge label={severity} severity={severity} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}>
            <div className="px-4 pb-4 pt-1 border-t border-border">
              <p className="text-sm text-subtle font-body leading-relaxed">{item.description}</p>
              {item.line && (
                <p className="text-xs text-muted mt-2 font-mono">Line: {item.line}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function IssueList({ review }) {
  const sections = ['bugs', 'vulnerabilities', 'performance_issues', 'code_smells', 'suggestions']

  return (
    <div className="space-y-5">
      {sections.map((key) => {
        const items = review[key] || []
        if (!items.length) return null
        const { label, icon: Icon, color } = SECTION_CONFIG[key]

        return (
          <div key={key} className="glass rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Icon size={16} className={color} />
              <h3 className="font-display font-semibold text-white text-sm">{label}</h3>
              <span className="ml-auto text-xs text-muted font-body bg-surface px-2 py-0.5 rounded-full border border-border">
                {items.length}
              </span>
            </div>
            <div className="space-y-2">
              {items.map((item, i) => <IssueItem key={i} item={item} type={key} />)}
            </div>
          </div>
        )
      })}

      {/* Readability */}
      {review.readability && (
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Eye size={16} className="text-indigo-400" />
            <h3 className="font-display font-semibold text-white text-sm">Readability</h3>
            <span className="ml-auto text-accent font-display font-bold text-sm">
              {review.readability.score}/10
            </span>
          </div>
          <p className="text-sm text-subtle font-body leading-relaxed">{review.readability.comments}</p>
        </div>
      )}
    </div>
  )
}
