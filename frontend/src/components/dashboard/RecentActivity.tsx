import { motion } from 'framer-motion';
import { Card } from '../common/Card';
import { formatDateTime } from '@/utils';
import { CheckCircle, Plus, Edit, Trash2 } from 'lucide-react';

interface Activity {
  action: string;
  taskTitle: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'created':
        return <Plus className="h-4 w-4 text-blue-500" />;
      case 'updated':
        return <Edit className="h-4 w-4 text-amber-500" />;
      case 'deleted':
        return <Trash2 className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-slate-400" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'completed':
        return 'Completed';
      case 'created':
        return 'Created';
      case 'updated':
        return 'Updated';
      case 'deleted':
        return 'Deleted';
      default:
        return action;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    >
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {activities.slice(0, 10).map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
              className="flex items-start gap-3 rounded-lg p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <div className="mt-0.5 rounded-full bg-slate-100 p-1.5 dark:bg-slate-800">
                {getActionIcon(activity.action)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800 dark:text-slate-200">
                  <span className="font-medium">{getActionLabel(activity.action)}</span>{' '}
                  <span className="text-slate-500 dark:text-slate-400">{activity.taskTitle}</span>
                </p>
                <p className="text-xs text-slate-400">{formatDateTime(activity.timestamp)}</p>
              </div>
            </motion.div>
          ))}
          {activities.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
