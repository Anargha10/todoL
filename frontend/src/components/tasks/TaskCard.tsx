import { motion } from 'framer-motion';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Task, TaskStatus } from '@/types';
import { isOverdue, isDueSoon, formatDate } from '@/utils';
import { Calendar, Clock, ArrowRight, Trash2, Copy } from 'lucide-react';
import { PRIORITY_COLORS, CATEGORY_COLORS } from '@/constants';
import { useNavigate } from 'react-router-dom';

interface TaskCardProps {
  task: Task;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onSelect?: (id: string) => void;
  selected?: boolean;
}

export function TaskCard({ task, onDelete, onDuplicate, onSelect, selected }: TaskCardProps) {
  const navigate = useNavigate();
  const overdue = isOverdue(task.dueDate, task.status);
  const dueSoon = isDueSoon(task.dueDate, task.status);
  const priorityColor = PRIORITY_COLORS[task.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -2 }}
    >
      <Card
        className={`relative p-5 cursor-pointer transition-all ${
          selected ? 'ring-2 ring-primary-500' : ''
        }`}
        onClick={() => onSelect ? onSelect(task.id) : navigate(`/tasks/${task.id}`)}
      >
        {overdue && (
          <div className="absolute top-0 right-0 rounded-bl-xl rounded-tr-xl bg-red-500 px-2 py-1 text-xs font-medium text-white">
            Overdue
          </div>
        )}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="priority" value={task.priority} />
              <Badge variant="status" value={task.status} />
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[task.category]}`}>
                {task.category}
              </span>
            </div>
            <h3 className="mb-1 text-base font-semibold text-slate-900 dark:text-white truncate">
              {task.title}
            </h3>
            <p className="mb-3 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {task.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className={`flex items-center gap-1 ${overdue ? 'text-red-500' : dueSoon ? 'text-amber-500' : ''}`}>
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(task.dueDate)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {task.estimatedHours}h
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/tasks/${task.id}`);
              }}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            {onDuplicate && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(task.id);
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
