import { cn } from "@/lib/utils"

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'card' | 'list' | 'grid' | 'form' | 'text'
  count?: number
  rows?: number
  cols?: number
  aspectRatio?: string
  className?: string
}

export function Loading({
  variant = 'text',
  count = 1,
  rows = 1,
  cols = 1,
  aspectRatio,
  className,
  ...props
}: LoadingProps) {
  // Base skeleton element
  const Skeleton = ({ className: skeletonClassName, ...skeletonProps }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
      className={cn("animate-pulse rounded-md bg-muted", skeletonClassName)}
      {...skeletonProps}
    />
  )

  // Text skeleton with varying widths
  if (variant === 'text') {
    return (
      <div className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "h-4",
              i % 3 === 0 ? "w-full" : i % 3 === 1 ? "w-3/4" : "w-1/2"
            )}
          />
        ))}
      </div>
    )
  }

  // Grid of items
  if (variant === 'grid') {
    return (
      <div 
        className={cn(
          "grid gap-4",
          {
            'grid-cols-1': cols === 1,
            'grid-cols-2 md:grid-cols-3': cols === 3,
            'grid-cols-2 md:grid-cols-4': cols === 4,
          },
          className
        )}
        {...props}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-3">
            {aspectRatio && (
              <Skeleton className={`w-full aspect-[${aspectRatio}]`} />
            )}
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  // Form fields
  if (variant === 'form') {
    return (
      <div className={cn("space-y-4", className)} {...props}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    )
  }

  // Card layout
  if (variant === 'card') {
    return (
      <div className={cn("rounded-lg border bg-card p-4", className)} {...props}>
        {aspectRatio && (
          <Skeleton className={`w-full aspect-[${aspectRatio}] mb-4`} />
        )}
        <div className="space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          {Array.from({ length: rows - 1 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    )
  }

  // List layout
  if (variant === 'list') {
    return (
      <div className={cn("space-y-4", className)} {...props}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-4 rounded-lg border bg-card p-4"
          >
            {aspectRatio && (
              <Skeleton className={`shrink-0 aspect-[${aspectRatio}] w-20`} />
            )}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return null
} 