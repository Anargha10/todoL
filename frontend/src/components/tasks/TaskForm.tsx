import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Modal } from '../common/Modal';
import { Task, TaskInput, TaskPriority, TaskStatus, TaskCategory } from '@/types';
import { STATUS_OPTIONS, PRIORITY_OPTIONS, CATEGORY_OPTIONS } from '@/constants';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Max 200 characters'),
  description: z.string().min(1, 'Description is required').max(2000, 'Max 2000 characters'),
  priority: z.nativeEnum(TaskPriority),
  status: z.nativeEnum(TaskStatus),
  category: z.nativeEnum(TaskCategory),
  dueDate: z.string().min(1, 'Due date is required'),
  estimatedHours: z.number().min(0).max(1000),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskInput) => void;
  initialData?: Task;
  isSubmitting?: boolean;
}

export function TaskForm({ isOpen, onClose, onSubmit, initialData, isSubmitting }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          dueDate: initialData.dueDate.slice(0, 16),
        }
      : {
          title: '',
          description: '',
          priority: TaskPriority.MEDIUM,
          status: TaskStatus.TODO,
          category: TaskCategory.PERSONAL,
          dueDate: new Date().toISOString().slice(0, 16),
          estimatedHours: 1,
        },
  });

  const handleFormSubmit = (data: TaskFormData) => {
    const formattedData: TaskInput = {
      ...data,
      dueDate: new Date(data.dueDate).toISOString(),
    };
    onSubmit(formattedData);
    if (!initialData) reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Task' : 'Create Task'} maxWidth="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input label="Title" {...register('title')} error={errors.title?.message} placeholder="Enter task title" />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition-all focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            placeholder="Enter task description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Priority" {...register('priority')} options={PRIORITY_OPTIONS} error={errors.priority?.message} />
          <Select label="Status" {...register('status')} options={STATUS_OPTIONS} error={errors.status?.message} />
          <Select label="Category" {...register('category')} options={CATEGORY_OPTIONS} error={errors.category?.message} />
          <Input
            label="Due Date"
            type="datetime-local"
            {...register('dueDate')}
            error={errors.dueDate?.message}
          />
        </div>
        <Input
          label="Estimated Hours"
          type="number"
          {...register('estimatedHours', { valueAsNumber: true })}
          error={errors.estimatedHours?.message}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {initialData ? 'Update' : 'Create'} Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
