import { motion } from 'framer-motion';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

import { Task,  } from '@/types';
import { isOverdue, formatDate } from '@/utils';
import { Calendar, ArrowRight, Trash2, Copy,  } from 'lucide-react';
import { CATEGORY_COLORS } from '@/constants';
import { useNavigate } from 'react-router-dom';

interface TaskTableProps {
  tasks: Task[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function TaskTable({ tasks, selectedIds, onSelect, onSelectAll, onDelete, onDuplicate }: TaskTableProps) {
  const navigate = useNavigate();
  const allSelected = tasks.length > 0 && tasks.every((t) => selectedIds.includes(t.id));

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white dark:border-slate-700/50 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 dark:border-slate-600"
                />
              </th>
              <th className="px-4 py-3">Task</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {tasks.map((task) => {
              const overdue = isOverdue(task.dueDate, task.status);
              const selected = selectedIds.includes(task.id);
              return (
                <motion.tr
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${selected ? 'bg-primary-50/50 dark:bg-primary-950/20' : ''}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => onSelect(task.id)}
                      className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 dark:border-slate-600"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="cursor-pointer" onClick={() => navigate(`/tasks/${task.id}`)}>
                      <p className="font-medium text-slate-900 dark:text-white">{task.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{task.description}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="status" value={task.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="priority" value={task.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[task.category]}`}>
                      {task.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(task.dueDate)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigate(`/tasks/${task.id}`)}>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onDuplicate(task.id)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500" onClick={() => onDelete(task.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
