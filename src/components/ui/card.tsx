import * as React from 'react'

import { cn } from '@/lib/utils'

const cardVariants = {
  raised:
    'shadow-[6px_6px_12px_rgba(0,0,0,var(--neumo-intensity)),-6px_-6px_12px_var(--neumo-light-shadow)]',
  inset:
    'shadow-[inset_4px_4px_8px_rgba(0,0,0,var(--neumo-intensity)),inset_-4px_-4px_8px_var(--neumo-light-shadow)]',
} as const

type CardVariant = keyof typeof cardVariants

function Card({
  className,
  variant = 'raised',
  ...props
}: React.ComponentProps<'div'> & { variant?: CardVariant }) {
  return (
    <div
      data-slot="neumo-card"
      data-variant={variant}
      className={cn(
        'bg-(--neumo-base) text-card-foreground flex flex-col gap-6 rounded-2xl py-6',
        cardVariants[variant],
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="neumo-card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=neumo-card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="neumo-card-title"
      className={cn(
        'leading-none font-semibold',
        className,
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="neumo-card-description"
      className={cn(
        'text-muted-foreground text-sm',
        className,
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="neumo-card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="neumo-card-content"
      className={cn(
        'px-6',
        className,
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="neumo-card-footer"
      className={cn(
        'flex items-center px-6 [.border-t]:pt-6',
        className,
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
