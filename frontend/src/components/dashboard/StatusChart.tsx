import { motion } from 'framer-motion';
import { Card } from '../common/Card';
import { TaskStatus } from '@/types';
import { STATUS_COLORS } from '@/constants';

interface StatusChartProps {
  data: { status: string; count: number }[];
}

export function StatusChart({ data }: StatusChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0) || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          Tasks by Status
        </h3>
        <div className="flex flex-wrap gap-3">
          {data.map((item, index) => {
            const percentage = Math.round((item.count / total) * 100);
            const colors = STATUS_COLORS[item.status as TaskStatus] || STATUS_COLORS[TaskStatus.TODO];
            return (
              <motion.div
                key={item.status}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                className="flex flex-1 min-w-[120px] flex-col items-center rounded-xl p-4"
                style={{ backgroundColor: 'transparent' }}
              >
                <div className={`mb-2 rounded-full p-2 ${colors.bg}`}>
                  <div className={`h-2 w-2 rounded-full ${colors.dot}`} />
                </div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {item.count}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{item.status}</span>
                <span className="text-xs text-slate-400">{percentage}%</span>
              </motion.div>
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
