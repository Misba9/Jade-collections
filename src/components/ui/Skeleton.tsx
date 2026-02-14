import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div
    className={cn('animate-pulse rounded-md bg-stone-200', className)}
    aria-hidden
  />
);

/** Product card skeleton for grids */
export const ProductCardSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="aspect-[3/4] w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-6 w-1/3" />
  </div>
);
