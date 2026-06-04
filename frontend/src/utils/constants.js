export const LANGUAGES = [
  'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C', 'C#',
  'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'SQL', 'Bash',
  'HTML', 'CSS', 'React', 'Vue', 'Dart', 'R', 'Scala', 'Other'
]

export const SEVERITY_COLORS = {
  critical: '#f87171',
  high: '#fb923c',
  medium: '#fbbf24',
  low: '#60a5fa',
}

export const SCORE_COLORS = {
  excellent: '#6ee7b7',
  good: '#86efac',
  average: '#fbbf24',
  poor: '#f87171',
}

export function getScoreColor(score) {
  if (score >= 8) return '#6ee7b7'
  if (score >= 6) return '#86efac'
  if (score >= 4) return '#fbbf24'
  return '#f87171'
}

export function getScoreLabel(score) {
  if (score >= 9) return 'Excellent'
  if (score >= 7) return 'Good'
  if (score >= 5) return 'Average'
  if (score >= 3) return 'Poor'
  return 'Critical'
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}

export function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  })
}

export const LANG_COLORS = [
  '#6ee7b7', '#60a5fa', '#f59e0b', '#f87171', '#a78bfa',
  '#34d399', '#38bdf8', '#fb923c', '#e879f9', '#4ade80'
]
