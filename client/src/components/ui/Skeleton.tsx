export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-secondary bg-bg-quaternary ${className}`}
      aria-hidden="true"
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-surface p-5">
      <Skeleton className="h-10 w-10 rounded-secondary" />
      <Skeleton className="mt-4 h-7 w-20" />
      <Skeleton className="mt-2 h-4 w-24" />
      <Skeleton className="mt-3 h-4 w-full" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-surface p-5">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="mt-6 h-64 w-full" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-16 rounded-full" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}
