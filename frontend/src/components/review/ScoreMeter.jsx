import { getScoreColor, getScoreLabel } from '../../utils/constants'

export default function ScoreMeter({ score, size = 120 }) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const filled = (score / 10) * circumference
  const color = getScoreColor(score)
  const label = getScoreLabel(score)
  const cx = size / 2
  const cy = size / 2

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative score-ring">
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={cx} cy={cy} r={radius} fill="none"
            stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle cx={cx} cy={cy} r={radius} fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - filled}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.3s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-bold text-white leading-none"
            style={{ fontSize: size * 0.22, color }}>
            {score}
          </span>
          <span className="text-muted font-body" style={{ fontSize: size * 0.1 }}>/10</span>
        </div>
      </div>
      <span className="text-sm font-body font-medium" style={{ color }}>{label}</span>
    </div>
  )
}
