import { useState } from 'react';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { TaskFilters as TaskFiltersType, TaskStatus, TaskPriority, TaskCategory } from '@/types';
import { STATUS_OPTIONS, PRIORITY_OPTIONS, CATEGORY_OPTIONS, SORT_OPTIONS } from '@/constants';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { debounce } from '@/utils';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onChange: (filters: TaskFiltersType) => void;
}

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = debounce((search: string) => {
    onChange({ ...filters, search, page: 1 });
  }, 300);

  const hasActiveFilters = filters.status || filters.priority || filters.category;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            defaultValue={filters.search || ''}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="w-full rounded-xl border-2 border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 transition-all focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={showFilters ? 'primary' : 'outline'}
            size="md"
            leftIcon={<SlidersHorizontal className="h-4 w-4" />}
            onClick={() => setShowFilters(!showFilters)}
            className={hasActiveFilters ? 'border-primary-500 text-primary-600' : ''}
          >
            Filters
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="md"
              leftIcon={<X className="h-4 w-4" />}
              onClick={() => onChange({ search: filters.search, sortBy: filters.sortBy, sortOrder: filters.sortOrder, page: 1, limit: filters.limit })}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200/60 bg-white/50 p-4 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/50 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            label="Status"
            value={filters.status || ''}
            onChange={(e) => onChange({ ...filters, status: (e.target.value as TaskStatus) || undefined, page: 1 })}
            options={[{ label: 'All Statuses', value: '' }, ...STATUS_OPTIONS]}
          />
          <Select
            label="Priority"
            value={filters.priority || ''}
            onChange={(e) => onChange({ ...filters, priority: (e.target.value as TaskPriority) || undefined, page: 1 })}
            options={[{ label: 'All Priorities', value: '' }, ...PRIORITY_OPTIONS]}
          />
          <Select
            label="Category"
            value={filters.category || ''}
            onChange={(e) => onChange({ ...filters, category: (e.target.value as TaskCategory) || undefined, page: 1 })}
            options={[{ label: 'All Categories', value: '' }, ...CATEGORY_OPTIONS]}
          />
          <Select
            label="Sort By"
            value={`${filters.sortBy || 'createdAt'}_${filters.sortOrder || 'desc'}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('_') as [string, 'asc' | 'desc'];
              onChange({ ...filters, sortBy, sortOrder });
            }}
            options={SORT_OPTIONS.flatMap((opt) => [
              { label: `${opt.label} (Newest)`, value: `${opt.value}_desc` },
              { label: `${opt.label} (Oldest)`, value: `${opt.value}_asc` },
            ])}
          />
        </div>
      )}
    </div>
  );
}
