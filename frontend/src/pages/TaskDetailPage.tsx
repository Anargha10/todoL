import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Edit2, Trash2, Check } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { Skeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { TaskForm } from '../components/tasks/TaskForm';
import { Dialog } from '../components/common/Dialog';
import { useTask } from '../hooks/useTasks';
import { useToast } from '../hooks/useTheme';
import { useTasks } from '../hooks/useTasks';
import { TaskStatus } from '../types';
import { formatDateTime, isOverdue } from '../utils';
import { CATEGORY_COLORS } from '../constants';

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { task, isLoading, isError, updateTask, isUpdating } = useTask(id!);
  const { deleteTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (isError || !task) {
    return (
      <EmptyState
        title="Task not found"
        description="The task you're looking for doesn't exist or has been removed."
        action={
          <Button variant="primary" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/tasks')}>
            Back to Tasks
          </Button>
        }
      />
    );
  }

  const overdue = isOverdue(task.dueDate, task.status);

  const handleStatusToggle = () => {
    const newStatus = task.status === TaskStatus.COMPLETED ? TaskStatus.TODO : TaskStatus.COMPLETED;
    updateTask({ status: newStatus });
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (id) {
      deleteTask(id);
      showToast('Task deleted', 'success');
      navigate('/tasks');
    }
    setShowDeleteDialog(false);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/tasks')} className="mb-4">
          Back to Tasks
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="priority" value={task.priority} />
                <Badge variant="status" value={task.status} />
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[task.category]}`}>
                  {task.category}
                </span>
                {overdue && (
                  <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950/30 dark:text-red-400">
                    Overdue
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{task.title}</h1>
            </div>
            <div className="flex gap-2">
              <Button
                variant={task.status === TaskStatus.COMPLETED ? 'secondary' : 'primary'}
                size="sm"
                leftIcon={task.status === TaskStatus.COMPLETED ? <Check className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                onClick={handleStatusToggle}
                isLoading={isUpdating}
              >
                {task.status === TaskStatus.COMPLETED ? 'Mark Incomplete' : 'Complete'}
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Edit2 className="h-4 w-4" />} onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="text-red-500" leftIcon={<Trash2 className="h-4 w-4" />} onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>

          <p className="mb-6 text-slate-600 dark:text-slate-400">{task.description}</p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
              <Calendar className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Due Date</p>
                <p className={`text-sm font-medium ${overdue ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                  {formatDateTime(task.dueDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
              <Clock className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Estimated Hours</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{task.estimatedHours}h</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
              <Calendar className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Created</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{formatDateTime(task.createdAt)}</p>
              </div>
            </div>
          </div>

          {task.completedAt && (
            <div className="mt-4 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/20">
              <p className="text-sm text-emerald-700 dark:text-emerald-400">
                Completed on {formatDateTime(task.completedAt)}
              </p>
            </div>
          )}
        </Card>
      </motion.div>

      <TaskForm
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSubmit={(data) => {
          updateTask(data);
          setIsEditing(false);
        }}
        initialData={task}
        isSubmitting={isUpdating}
      />

      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
