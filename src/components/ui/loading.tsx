import { cn } from '@/lib/utils'

type LoadingProps = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const sizeMap = {
  sm: 'size-5 border-2',
  md: 'size-8 border-[3px]',
  lg: 'size-12 border-4',
} as const

export function Loading({ className, size = 'md', label }: LoadingProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-12', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-muted-foreground/20 border-t-muted-foreground',
          sizeMap[size],
        )}
      />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  )
}
