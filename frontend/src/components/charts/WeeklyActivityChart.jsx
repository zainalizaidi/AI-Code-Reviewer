import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-lg px-3 py-2 text-xs font-body">
        <p className="text-white font-semibold mb-1">{label}</p>
        <p className="text-accent">Reviews: {payload[0]?.value}</p>
        {payload[1]?.value > 0 && <p className="text-yellow-400">Avg Score: {payload[1].value}</p>}
      </div>
    )
  }
  return null
}

export default function WeeklyActivityChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'DM Sans' }}
          axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'DM Sans' }}
          axisLine={false} tickLine={false} width={28} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="count" fill="#6ee7b7" radius={[4, 4, 0, 0]} opacity={0.85}
          name="Reviews" />
      </BarChart>
    </ResponsiveContainer>
  )
}
