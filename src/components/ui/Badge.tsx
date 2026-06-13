import { cn } from '@/lib/utils/cn'

type Variant = 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple' | 'orange' | 'teal'

const variants: Record<Variant, string> = {
  blue:   'bg-blue-100 text-blue-800',
  green:  'bg-teal-100 text-teal-800',
  yellow: 'bg-amber-100 text-amber-800',
  red:    'bg-rose-100 text-rose-700',
  gray:   'bg-stone-100 text-stone-600',
  purple: 'bg-violet-100 text-violet-700',
  orange: 'bg-orange-100 text-orange-700',
  teal:   'bg-teal-100 text-teal-700',
}

export function Badge({ children, variant = 'gray', className }: {
  children: React.ReactNode
  variant?: Variant
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full', variants[variant], className)}>
      {children}
    </span>
  )
}
