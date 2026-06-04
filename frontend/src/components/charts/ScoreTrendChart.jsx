import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-lg px-3 py-2 text-xs font-body">
        <p className="text-muted mb-1">{label}</p>
        <p className="text-accent font-semibold">Score: {payload[0]?.value}/10</p>
        {payload[0]?.payload?.language && (
          <p className="text-subtle">{payload[0].payload.language}</p>
        )}
      </div>
    )
  }
  return null
}

export default function ScoreTrendChart({ data = [] }) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-muted text-sm font-body">
      No score data yet
    </div>
  )

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'DM Sans' }}
          axisLine={false} tickLine={false} />
        <YAxis domain={[0, 10]} tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'DM Sans' }}
          axisLine={false} tickLine={false} width={28} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={7} stroke="rgba(110,231,183,0.15)" strokeDasharray="4 4" />
        <Line type="monotone" dataKey="score" stroke="#6ee7b7" strokeWidth={2}
          dot={{ fill: '#6ee7b7', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#6ee7b7', strokeWidth: 0 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
