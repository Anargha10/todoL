import { cn } from '@/utils';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-shimmer rounded-xl bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%]',
            'dark:from-slate-800 dark:via-slate-700 dark:to-slate-800',
            className
          )}
        />
      ))}
    </>
  );
}
