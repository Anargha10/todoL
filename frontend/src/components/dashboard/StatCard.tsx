import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '../common/Card';
import { cn } from '@/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  color: 'blue' | 'emerald' | 'amber' | 'rose' | 'purple';
  delay?: number;
}

export function StatCard({ title, value, icon: Icon, trend, color, delay = 0 }: StatCardProps) {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
            {trend !== undefined && (
              <p className={cn('mt-1 text-sm', trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
                {trend >= 0 ? '+' : ''}{trend}% from last week
              </p>
            )}
          </div>
          <div className={cn('rounded-xl p-2.5', colorStyles[color])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
