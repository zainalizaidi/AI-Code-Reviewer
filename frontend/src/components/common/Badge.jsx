export default function Badge({ label, severity }) {
  const map = {
    critical: 'bg-red-900/30 text-red-400 border-red-800/40',
    high: 'bg-orange-900/30 text-orange-400 border-orange-800/40',
    medium: 'bg-yellow-900/30 text-yellow-400 border-yellow-800/40',
    low: 'bg-blue-900/30 text-blue-400 border-blue-800/40',
    info: 'bg-indigo-900/30 text-indigo-400 border-indigo-800/40',
    success: 'bg-green-900/30 text-green-400 border-green-800/40',
  }

  const cls = map[severity] || map.info

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium border ${cls}`}>
      {label}
    </span>
  )
}
