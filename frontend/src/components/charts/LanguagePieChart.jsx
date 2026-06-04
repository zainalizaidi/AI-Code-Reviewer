import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { LANG_COLORS } from '../../utils/constants'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-lg px-3 py-2 text-xs font-body">
        <p className="text-white font-semibold">{payload[0].name}</p>
        <p className="text-accent">{payload[0].value} reviews ({payload[0].payload.percentage}%)</p>
      </div>
    )
  }
  return null
}

export default function LanguagePieChart({ data = [] }) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-muted text-sm font-body">
      No data yet
    </div>
  )

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="language"
          cx="50%" cy="50%" outerRadius={80} innerRadius={45}
          paddingAngle={3} strokeWidth={0}>
          {data.map((_, i) => (
            <Cell key={i} fill={LANG_COLORS[i % LANG_COLORS.length]} opacity={0.85} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'DM Sans' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
