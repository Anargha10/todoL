import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LayoutGrid, List, Download } from 'lucide-react';
import { Button } from '../components/common/Button';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskTable } from '../components/tasks/TaskTable';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskForm } from '../components/tasks/TaskForm';
import { BulkActions } from '../components/tasks/BulkActions';
import { Pagination } from '../components/common/Pagination';
import { Skeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Dialog } from '../components/common/Dialog';
import { useTasks } from '../hooks/useTasks';
import { useToast } from '../hooks/useTheme';
import { TaskInput, TaskFilters as TaskFiltersType } from '../types';
import { downloadCSV } from '../utils';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

type ViewMode = 'grid' | 'list';

export function TasksPage() {
  const [filters, setFilters] = useState<TaskFiltersType>({ page: 1, limit: 12 });
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteIds, setDeleteIds] = useState<string[] | null>(null);
  const { showToast } = useToast();

  const { tasks, pagination, isLoading, createTask, updateTask, deleteTask, duplicateTask, bulkDelete, bulkComplete } = useTasks(filters);

  useKeyboardShortcuts([
    { key: 'n', ctrl: true, handler: () => setIsFormOpen(true) },
    { key: 'g', ctrl: true, handler: () => setViewMode('grid') },
    { key: 'l', ctrl: true, handler: () => setViewMode('list') },
  ]);

  const handleCreate = (data: TaskInput) => {
    createTask(data);
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteTask(deleteId);
      setDeleteId(null);
    }
  };

  const handleBulkDelete = () => {
    setDeleteIds(selectedIds);
  };

  const confirmBulkDelete = () => {
    if (deleteIds) {
      bulkDelete(deleteIds);
      setDeleteIds(null);
      setSelectedIds([]);
    }
  };

  const handleBulkComplete = () => {
    bulkComplete(selectedIds);
    setSelectedIds([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const selectAll = () => {
    if (selectedIds.length === tasks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tasks.map((t) => t.id));
    }
  };

  const handleExport = () => {
    const rows = [
      ['Title', 'Description', 'Priority', 'Status', 'Category', 'Due Date', 'Estimated Hours'],
      ...tasks.map((t) => [t.title, t.description, t.priority, t.status, t.category, t.dueDate, String(t.estimatedHours)]),
    ];
    downloadCSV('tasks.csv', rows);
    showToast('Tasks exported to CSV', 'success');
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tasks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage and track all your tasks</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="md" leftIcon={<Download className="h-4 w-4" />} onClick={handleExport}>
            Export
          </Button>
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700">
            <button onClick={() => setViewMode('grid')} className={`rounded-l-lg p-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`rounded-r-lg p-2 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
              <List className="h-4 w-4" />
            </button>
          </div>
          <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>
            New Task
          </Button>
        </div>
      </motion.div>

      <TaskFilters filters={filters} onChange={setFilters} />

      <BulkActions
        selectedCount={selectedIds.length}
        onBulkComplete={handleBulkComplete}
        onBulkDelete={handleBulkDelete}
        onClear={() => setSelectedIds([])}
      />

      {isLoading ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-48" count={6} />
          </div>
        ) : (
          <Skeleton className="h-64" />
        )
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description="Create your first task to get started."
          action={
            <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>
              Create Task
            </Button>
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={handleDelete}
                onDuplicate={duplicateTask}
                onSelect={toggleSelect}
                selected={selectedIds.includes(task.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <TaskTable
          tasks={tasks}
          selectedIds={selectedIds}
          onSelect={toggleSelect}
          onSelectAll={selectAll}
          onDelete={handleDelete}
          onDuplicate={duplicateTask}
        />
      )}

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalCount={pagination.totalCount}
          onPageChange={handlePageChange}
        />
      )}

      <TaskForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleCreate} isSubmitting={false} />

      <Dialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      <Dialog
        isOpen={!!deleteIds}
        onClose={() => setDeleteIds(null)}
        onConfirm={confirmBulkDelete}
        title="Delete Tasks"
        description={`Are you sure you want to delete ${deleteIds?.length} tasks? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
