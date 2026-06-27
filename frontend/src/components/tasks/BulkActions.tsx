import { Button } from '../common/Button';
import { Trash2, Check, X } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  onBulkComplete: () => void;
  onBulkDelete: () => void;
  onClear: () => void;
}

export function BulkActions({ selectedCount, onBulkComplete, onBulkDelete, onClear }: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-primary-200 bg-primary-50/80 px-4 py-3 backdrop-blur-sm dark:border-primary-800 dark:bg-primary-950/30">
      <span className="text-sm font-medium text-primary-800 dark:text-primary-300">
        {selectedCount} selected
      </span>
      <div className="ml-auto flex gap-2">
        <Button variant="ghost" size="sm" leftIcon={<X className="h-4 w-4" />} onClick={onClear}>
          Clear
        </Button>
        <Button variant="secondary" size="sm" leftIcon={<Check className="h-4 w-4" />} onClick={onBulkComplete}>
          Complete
        </Button>
        <Button variant="danger" size="sm" leftIcon={<Trash2 className="h-4 w-4" />} onClick={onBulkDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}
