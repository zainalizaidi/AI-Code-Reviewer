export default function LoadingSkeleton({ className = '' }) {
  return <div className={`shimmer rounded-lg ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-xl p-6 space-y-4">
      <LoadingSkeleton className="h-4 w-1/3" />
      <LoadingSkeleton className="h-8 w-1/2" />
      <LoadingSkeleton className="h-3 w-2/3" />
    </div>
  )
}

export function ReviewSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="glass rounded-xl p-5 space-y-3">
          <div className="flex gap-3">
            <LoadingSkeleton className="h-5 w-16" />
            <LoadingSkeleton className="h-5 w-24" />
          </div>
          <LoadingSkeleton className="h-4 w-full" />
          <LoadingSkeleton className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  )
}
