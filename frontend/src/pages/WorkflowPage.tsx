import { GitBranch } from 'lucide-react';
import { WorkflowBoard } from '@/components/workflow/WorkflowBoard';

export function WorkflowPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <GitBranch className="h-6 w-6 text-primary-600" />
          Workflows de validation
        </h1>
        <p className="text-sm text-gray-500 mt-1">Gérez les flux de validation des documents</p>
      </div>
      <WorkflowBoard />
    </div>
  );
}
