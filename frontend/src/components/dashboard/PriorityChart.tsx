import { motion } from 'framer-motion';
import { Card } from '../common/Card';
import { cn } from '@/utils';
import { TaskPriority } from '@/types';
import { PRIORITY_COLORS } from '@/constants';

interface PriorityChartProps {
  data: { priority: string; count: number }[];
}

export function PriorityChart({ data }: PriorityChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0) || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          Tasks by Priority
        </h3>
        <div className="space-y-3">
          {data.map((item, index) => {
            const percentage = Math.round((item.count / total) * 100);
            const colors = PRIORITY_COLORS[item.priority as TaskPriority] || PRIORITY_COLORS[TaskPriority.MEDIUM];
            return (
              <div key={item.priority}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item.priority}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {item.count} ({percentage}%)
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.6, ease: 'easeOut' }}
                    className={cn('h-full rounded-full', colors.text.replace('text-', 'bg-'))}
                  />
                </div>
              </div>
            );
          })}
          {data.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">No data available</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
