import { motion } from 'framer-motion';
import { CheckSquare, Clock, AlertTriangle, TrendingUp, Zap, Activity } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { PriorityChart } from '../components/dashboard/PriorityChart';
import { StatusChart } from '../components/dashboard/StatusChart';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { Skeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { useDashboardStats } from '../hooks/useAnalytics';
import { useAnalytics } from '../hooks/useAnalytics';

export function DashboardPage() {
  const { data: stats, isLoading: statsLoading, isError: statsError } = useDashboardStats();
  const { data: analytics, isLoading: analyticsLoading, isError: analyticsError } = useAnalytics();

  const isLoading = statsLoading || analyticsLoading;
  const isError = statsError || analyticsError;

  if (isError) {
    return (
      <EmptyState
        title="Failed to load dashboard"
        description="There was an error loading the dashboard data. Please try again."
      />
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Overview of your tasks and productivity</p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" count={4} />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Tasks" value={stats.totalTasks} icon={CheckSquare} color="blue" delay={0} />
          <StatCard title="Completed Today" value={stats.completedToday} icon={TrendingUp} color="emerald" delay={0.1} />
          <StatCard title="Pending" value={stats.pendingTasks} icon={Clock} color="amber" delay={0.2} />
          <StatCard title="Overdue" value={stats.overdueTasks} icon={AlertTriangle} color="rose" delay={0.3} />
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {isLoading ? (
          <>
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </>
        ) : analytics ? (
          <>
            <div className="lg:col-span-2">
              <PriorityChart data={analytics.tasksByPriority} />
            </div>
            <StatusChart data={analytics.tasksByStatus} />
          </>
        ) : null}
      </div>

      {isLoading ? (
        <Skeleton className="h-80" />
      ) : analytics ? (
        <RecentActivity activities={analytics.recentActivity} />
      ) : null}
    </div>
  );
}
