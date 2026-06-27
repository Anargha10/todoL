import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  title = 'No items found',
  description = 'Get started by creating a new item.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-4 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
        {icon || <Inbox className="h-8 w-8 text-slate-400" />}
      </div>
      <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mb-4 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
      {action}
    </motion.div>
  );
}
