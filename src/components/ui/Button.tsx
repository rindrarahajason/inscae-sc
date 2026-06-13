import { cn } from '@/lib/utils/cn'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary:   'bg-violet-700 text-white hover:bg-violet-600 shadow-sm',
  secondary: 'bg-white text-stone-700 border-2 border-stone-200 hover:bg-stone-50',
  danger:    'bg-rose-500 text-white hover:bg-rose-600',
  ghost:     'text-stone-500 hover:bg-stone-100',
}

const sizes: Record<Size, string> = {
  sm:  'px-3 py-1.5 text-xs rounded-lg',
  md:  'px-4 py-2 text-sm rounded-xl',
  lg:  'px-6 py-3 text-base rounded-full',
}

export function Button({ children, variant = 'primary', size = 'md', className, disabled, onClick, type = 'button' }: {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  className?: string
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-2 font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </button>
  )
}
