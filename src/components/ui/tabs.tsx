'use client'

import * as React from 'react'
import { Tabs as TabsPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="neumo-tabs"
      className={cn(
        'flex flex-col gap-3',
        className,
      )}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="neumo-tabs-list"
      className={cn(
        'inline-flex w-fit items-center gap-2 rounded-2xl bg-(--neumo-base) p-2 shadow-[inset_3px_3px_6px_rgba(0,0,0,var(--neumo-intensity)),inset_-3px_-3px_6px_var(--neumo-light-shadow)]',
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="neumo-tabs-trigger"
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-xl bg-(--neumo-base) px-4 py-2 text-sm font-medium text-foreground/60 whitespace-nowrap transition-all outline-none cursor-pointer',
        'shadow-none',
        'hover:text-foreground',
        'data-[state=active]:text-foreground data-[state=active]:shadow-[3px_3px_6px_rgba(0,0,0,var(--neumo-intensity)),-3px_-3px_6px_var(--neumo-light-shadow)]',
        'focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'disabled:pointer-events-none disabled:opacity-50',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="neumo-tabs-content"
      className={cn(
        'flex-1 outline-none animate-[neumo-tab-in_400ms_ease-out]',
        className,
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
