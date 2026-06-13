import { cn } from '@/lib/utils/cn'

export function StatCard({ label, value, icon, trend, color = 'violet' }: {
  label: string
  value: string | number
  icon: string
  trend?: string
  color?: 'violet' | 'amber' | 'teal' | 'rose'
}) {
  const colors = {
    violet: 'bg-violet-50 border-violet-200',
    amber:  'bg-amber-50 border-amber-200',
    teal:   'bg-teal-50 border-teal-200',
    rose:   'bg-rose-50 border-rose-200',
  }
  const valueColors = {
    violet: 'text-violet-700',
    amber:  'text-amber-700',
    teal:   'text-teal-700',
    rose:   'text-rose-600',
  }

  return (
    <div className={cn('rounded-2xl border-2 p-5', colors[color])}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={cn('text-4xl font-black', valueColors[color])}>{value}</p>
      {trend && <p className="text-xs text-stone-400 font-semibold mt-1">{trend}</p>}
    </div>
  )
}
