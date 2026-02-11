import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*=\'size-\'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none cursor-pointer bg-[var(--neumo-base)] text-foreground',
  {
    variants: {
      variant: {
        default:
          'shadow-[4px_4px_8px_rgba(0,0,0,var(--neumo-intensity)),-4px_-4px_8px_var(--neumo-light-shadow)] hover:shadow-[10px_10px_20px_rgba(0,0,0,var(--neumo-intensity)),-10px_-10px_20px_var(--neumo-light-shadow)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,var(--neumo-intensity)),inset_-4px_-4px_8px_var(--neumo-light-shadow)]',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-xl gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-2xl px-6 has-[>svg]:px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'>
  & VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild
    ? Slot
    : 'button'

  return (
    <Comp
      data-slot="neumo-button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant,
        size,
        className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
