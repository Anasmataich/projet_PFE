import { useState } from 'react';
import { FileText, Clock } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { formatRelative } from '@/utils/formatters';
import { WORKFLOW_STEP_LABELS } from '@/utils/constants';
import type { WorkflowInstance } from '@/types/workflow.types';

interface ValidationCardProps {
  workflow: WorkflowInstance;
  onApprove: (documentId: string) => Promise<void>;
  onReject: (documentId: string, reason: string) => Promise<void>;
}

export function ValidationCard({ workflow: w, onApprove, onReject }: ValidationCardProps) {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isPending = w.status === 'PENDING' || w.status === 'IN_PROGRESS';

  const handleApprove = async () => {
    setIsSubmitting(true);
    try { await onApprove(w.documentId); } finally { setIsSubmitting(false); }
  };

  const handleReject = async () => {
    if (!reason.trim()) return;
    setIsSubmitting(true);
    try { await onReject(w.documentId, reason); setRejectModalOpen(false); } finally { setIsSubmitting(false); }
  };

  return (
    <>
      <div className="card p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary-50 p-2"><FileText className="h-4 w-4 text-primary-600" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">{w.documentTitle ?? 'Document'}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatRelative(w.createdAt)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Étape : <span className="font-medium">{WORKFLOW_STEP_LABELS[w.currentStep]}</span>
            </p>
          </div>
        </div>

        {isPending && (
          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={handleApprove} loading={isSubmitting} className="flex-1">Approuver</Button>
            <Button size="sm" variant="danger" onClick={() => setRejectModalOpen(true)} className="flex-1">Rejeter</Button>
          </div>
        )}
      </div>

      <Modal open={rejectModalOpen} onClose={() => setRejectModalOpen(false)} title="Raison du rejet">
        <div className="space-y-4">
          <textarea className="input min-h-[100px] resize-y" placeholder="Expliquez la raison du rejet…" value={reason} onChange={(e) => setReason(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setRejectModalOpen(false)}>Annuler</Button>
            <Button variant="danger" size="sm" loading={isSubmitting} disabled={!reason.trim()} onClick={handleReject}>Confirmer le rejet</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
