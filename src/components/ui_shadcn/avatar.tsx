import Image from 'next/image'
import { cn } from '@/lib/utils'

function Avatar({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="avatar"
      className={cn(
        'relative flex size-8 shrink-0 overflow-hidden rounded-full',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function AvatarImage({
  className,
  src,
  alt = '',
}: {
  className?: string
  src?: string
  alt?: string
}) {
  if (!src) return null
  return (
    <Image
      data-slot="avatar-image"
      src={src}
      alt={alt}
      fill
      sizes="80px"
      className={cn('aspect-square object-cover z-10', className)}
    />
  )
}

function AvatarFallback({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="avatar-fallback"
      className={cn(
        'bg-muted flex size-full items-center justify-center rounded-full',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Avatar, AvatarImage, AvatarFallback }
