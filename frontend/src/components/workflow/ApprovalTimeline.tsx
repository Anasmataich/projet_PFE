import { FileText, Clock } from 'lucide-react';
import { WORKFLOW_STATUS_LABELS, WORKFLOW_STEP_LABELS } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatters';
import type { WorkflowInstance } from '@/types/workflow.types';

interface ApprovalTimelineProps {
  workflow: WorkflowInstance;
}

export function ApprovalTimeline({ workflow }: ApprovalTimelineProps) {
  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <FileText className="h-4 w-4" /> Détails du workflow
      </h3>

      <div className="rounded-lg bg-gray-50 p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Statut</span>
          <span className="font-medium text-gray-900">{WORKFLOW_STATUS_LABELS[workflow.status]}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Étape actuelle</span>
          <span className="font-medium text-gray-900">{WORKFLOW_STEP_LABELS[workflow.currentStep]}</span>
        </div>
        {workflow.initiatorName && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Initié par</span>
            <span className="font-medium text-gray-900">{workflow.initiatorName}</span>
          </div>
        )}
        {workflow.assigneeName && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Assigné à</span>
            <span className="font-medium text-gray-900">{workflow.assigneeName}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Date</span>
          <span className="flex items-center gap-1 text-gray-900"><Clock className="h-3.5 w-3.5" />{formatDateTime(workflow.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
