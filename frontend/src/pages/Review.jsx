import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { reviewService } from '../services/reviewService'
import CodeEditor from '../components/editor/CodeEditor'
import LanguageSelector from '../components/editor/LanguageSelector'
import ScoreMeter from '../components/review/ScoreMeter'
import IssueList from '../components/review/IssueList'
import FixedCodeViewer from '../components/review/FixedCodeViewer'
import { Cpu, Sparkles, RotateCcw, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

function AnalyzingOverlay() {
  const steps = ['Parsing code structure...', 'Detecting bugs & vulnerabilities...', 'Analyzing performance...', 'Generating optimized version...']
  const [step, setStep] = useState(0)

  useState(() => {
    const id = setInterval(() => setStep(s => (s + 1) % steps.length), 1800)
    return () => clearInterval(id)
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
          <Cpu size={28} className="text-accent animate-pulse-slow" />
        </div>
        <div className="absolute inset-0 rounded-2xl border border-accent/20 animate-ping opacity-30" />
      </div>
      <div className="text-center">
        <p className="font-display font-semibold text-white text-lg mb-2">Analyzing your code</p>
        <motion.p key={step} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted font-body">
          {steps[step]}
        </motion.p>
      </div>
      <div className="flex gap-1.5 mt-2">
        {steps.map((_, i) => (
          <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= step ? 'w-6 bg-accent' : 'w-1.5 bg-border'}`} />
        ))}
      </div>
    </motion.div>
  )
}

export default function Review() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async () => {
    if (!code.trim()) { toast.error('Please enter some code'); return }
    if (!language) { toast.error('Please select a language'); return }
    setLoading(true)
    setResult(null)
    try {
      const data = await reviewService.createReview({ language, original_code: code })
      setResult(data)
      toast.success('Review complete!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Review failed. Check your API key.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => { setResult(null); setCode(''); setLanguage('') }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-muted text-xs font-body mb-2">
          <span>Tools</span><ChevronRight size={11} /><span className="text-accent">Code Review</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-white">AI Code Review</h1>
        <p className="text-subtle font-body mt-1">Paste your code and get instant AI-powered analysis</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-5">
            {/* Language + Submit row */}
            <div className="flex gap-4 items-end">
              <div className="w-52">
                <label className="text-xs text-muted font-body uppercase tracking-wider mb-2 block">Language</label>
                <LanguageSelector value={language} onChange={setLanguage} />
              </div>
              <button onClick={handleSubmit} disabled={loading || !code.trim() || !language}
                className="btn-primary flex items-center gap-2 h-[46px] px-6">
                <Sparkles size={15} />
                Analyze Code
              </button>
            </div>

            <CodeEditor value={code} onChange={setCode} language={language} />

            <div className="flex items-center gap-4 pt-1">
              <div className="flex gap-3 text-xs text-muted font-body">
                {['Bugs', 'Vulnerabilities', 'Performance', 'Suggestions'].map(t => (
                  <span key={t} className="flex items-center gap-1.5 bg-surface border border-border px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />{t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="space-y-6">

            {/* Result Header */}
            {loading ? <AnalyzingOverlay /> : (
              <>
                <div className="glass rounded-xl p-6">
                  <div className="flex items-start gap-6">
                    <ScoreMeter score={result.score ?? 5} size={110} />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="font-display font-bold text-white text-lg">Review Complete</h2>
                        <span className="text-xs font-body bg-surface border border-border px-2 py-0.5 rounded-full text-muted">
                          {result.language}
                        </span>
                      </div>
                      <p className="text-subtle text-sm font-body leading-relaxed mb-4">
                        {result.summary}
                      </p>
                      <div className="flex gap-4 text-xs font-body">
                        <span className="text-red-400">{(result.bugs || []).length} bugs</span>
                        <span className="text-orange-400">{(result.vulnerabilities || []).length} vulnerabilities</span>
                        <span className="text-yellow-400">{(result.performance_issues || []).length} perf issues</span>
                        <span className="text-blue-400">{(result.suggestions || []).length} suggestions</span>
                      </div>
                    </div>
                    <button onClick={handleReset}
                      className="btn-ghost flex items-center gap-2 text-sm">
                      <RotateCcw size={14} /> New Review
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <IssueList review={result} />
                  <FixedCodeViewer code={result.fixed_code} language={result.language} />
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loading && !result && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AnalyzingOverlay />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
