import { cn } from '@/utils';
import { TaskPriority, TaskStatus } from '@/types';
import { PRIORITY_COLORS, STATUS_COLORS } from '@/constants';

interface BadgeProps {
  variant?: 'priority' | 'status' | 'default' | 'category';
  value: string;
  className?: string;
}

export function Badge({ variant = 'default', value, className }: BadgeProps) {
  if (variant === 'priority') {
    const colors = PRIORITY_COLORS[value as TaskPriority] || PRIORITY_COLORS[TaskPriority.MEDIUM];
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
          colors.bg,
          colors.text,
          colors.border,
          className
        )}
      >
        {value}
      </span>
    );
  }

  if (variant === 'status') {
    const colors = STATUS_COLORS[value as TaskStatus] || STATUS_COLORS[TaskStatus.TODO];
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
          colors.bg,
          colors.text,
          className
        )}
      >
        <span className={cn('h-1.5 w-1.5 rounded-full', colors.dot)} />
        {value}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        className
      )}
    >
      {value}
    </span>
  );
}
