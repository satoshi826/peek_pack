import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/*
 * ========================================
 * Flex Component
 * ========================================
 */

const flexVariants = cva(
  'flex',
  {
    variants: {
      direction: {
        'row': 'flex-row',
        'col': 'flex-col',
        'row-reverse': 'flex-row-reverse',
        'col-reverse': 'flex-col-reverse',
      },
      align: {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
        baseline: 'items-baseline',
      },
      justify: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
      },
      wrap: {
        'wrap': 'flex-wrap',
        'wrap-reverse': 'flex-wrap-reverse',
        'nowrap': 'flex-nowrap',
      },
      gap: {
        0: 'gap-0',
        1: 'gap-1',
        2: 'gap-2',
        3: 'gap-3',
        4: 'gap-4',
        5: 'gap-5',
        6: 'gap-6',
        8: 'gap-8',
        10: 'gap-10',
        12: 'gap-12',
      },
    },
    defaultVariants: {
      direction: 'row',
    },
  },
)

interface FlexProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof flexVariants> {
  as?: React.ElementType
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(({ direction, align, justify, wrap, gap, className, 'as': Component = 'div', ...props }, ref) => {
  return (
    <Component
      ref={ref}
      className={cn(
        flexVariants({ direction,
          align,
          justify,
          wrap,
          gap }),
        className,
      )}
      {...props}
    />
  )
})
Flex.displayName = 'Flex'

/*
 * ========================================
 * Grid Component
 * ========================================
 */

const gridVariants = cva(
  'grid',
  {
    variants: {
      cols: {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        6: 'grid-cols-6',
        12: 'grid-cols-12',
      },
      mdCols: {
        1: 'md:grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4',
        6: 'md:grid-cols-6',
        12: 'md:grid-cols-12',
      },
      lgCols: {
        1: 'lg:grid-cols-1',
        2: 'lg:grid-cols-2',
        3: 'lg:grid-cols-3',
        4: 'lg:grid-cols-4',
        6: 'lg:grid-cols-6',
        12: 'lg:grid-cols-12',
      },
      gap: {
        0: 'gap-0',
        1: 'gap-1',
        2: 'gap-2',
        3: 'gap-3',
        4: 'gap-4',
        5: 'gap-5',
        6: 'gap-6',
        8: 'gap-8',
        10: 'gap-10',
        12: 'gap-12',
      },
    },
  },
)

interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof gridVariants> {}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(({ cols, mdCols, lgCols, gap, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        gridVariants({ cols,
          mdCols,
          lgCols,
          gap }),
        className,
      )}
      {...props}
    />
  )
})
Grid.displayName = 'Grid'

/*
 * ========================================
 * Stack Component
 * ========================================
 */

const stackVariants = cva(
  '',
  {
    variants: {
      spacing: {
        0: 'space-y-0',
        1: 'space-y-1',
        2: 'space-y-2',
        3: 'space-y-3',
        4: 'space-y-4',
        5: 'space-y-5',
        6: 'space-y-6',
        8: 'space-y-8',
        10: 'space-y-10',
        12: 'space-y-12',
      },
    },
  },
)

interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof stackVariants> {}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(({ spacing, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        stackVariants({ spacing }),
        className,
      )}
      {...props}
    />
  )
})
Stack.displayName = 'Stack'

/*
 * ========================================
 * Container Component
 * ========================================
 */

const containerVariants = cva(
  '',
  {
    variants: {
      maxWidth: {
        'sm': 'max-w-sm',
        'md': 'max-w-md',
        'lg': 'max-w-lg',
        'xl': 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
        'full': 'max-w-full',
      },
      center: {
        true: 'mx-auto',
        false: '',
      },
    },
    defaultVariants: {
      maxWidth: '6xl',
      center: true,
    },
  },
)

interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof containerVariants> {}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({ maxWidth, center, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        containerVariants({ maxWidth,
          center }),
        className,
      )}
      {...props}
    />
  )
})
Container.displayName = 'Container'
