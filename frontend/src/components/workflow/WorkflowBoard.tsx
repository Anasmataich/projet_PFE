import { useState, useEffect } from 'react';
import { GitBranch } from 'lucide-react';
import { Spinner } from '@/components/common/Spinner';
import { Button } from '@/components/common/Button';
import { documentService } from '@/services/documentService';
import { workflowService } from '@/services/workflowService';
import { WORKFLOW_STATUS_LABELS, WORKFLOW_STEP_LABELS } from '@/utils/constants';
import { formatRelative } from '@/utils/formatters';
import type { Document } from '@/types/document.types';
import type { WorkflowInstance } from '@/types/workflow.types';
import toast from 'react-hot-toast';

interface DocWithWorkflow {
  document: Document;
  workflow: WorkflowInstance | null;
}

export function WorkflowBoard() {
  const [items, setItems] = useState<DocWithWorkflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const { data: docs } = await documentService.list({ status: 'EN_ATTENTE', limit: 50 });
      const results: DocWithWorkflow[] = [];
      for (const doc of docs) {
        try {
          const wf = await workflowService.getStatus(doc.id);
          results.push({ document: doc, workflow: wf });
        } catch {
          results.push({ document: doc, workflow: null });
        }
      }
      setItems(results);
    } catch {
      toast.error('Erreur lors du chargement des workflows');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (documentId: string) => {
    try {
      await workflowService.approve(documentId);
      toast.success('Document approuvé');
      load();
    } catch {
      toast.error("Erreur lors de l'approbation");
    }
  };

  const handleReject = async (documentId: string, reason: string) => {
    try {
      await workflowService.reject(documentId, reason);
      toast.success('Document rejeté');
      load();
    } catch {
      toast.error('Erreur lors du rejet');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-16"><Spinner size="lg" className="text-primary-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <GitBranch className="h-5 w-5 text-primary-600" />
        <h2 className="text-lg font-bold text-gray-900">Documents en attente de validation</h2>
        <span className="ml-auto text-sm text-gray-500">{items.length} document(s)</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-500 card">
          <GitBranch className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-sm">Aucun document en attente de validation</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(({ document: doc, workflow }) => (
            <WorkflowDocCard
              key={doc.id}
              document={doc}
              workflow={workflow}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WorkflowDocCard({ document: doc, workflow, onApprove, onReject }: {
  document: Document;
  workflow: WorkflowInstance | null;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
}) {
  const [rejectReason, setRejectReason] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);
    try { await onApprove(doc.id); } finally { setIsSubmitting(false); }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setIsSubmitting(true);
    try { await onReject(doc.id, rejectReason); setShowReject(false); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span>{formatRelative(doc.createdAt)}</span>
            {workflow && (
              <span className="text-primary-600 font-medium">
                {WORKFLOW_STEP_LABELS[workflow.currentStep]} — {WORKFLOW_STATUS_LABELS[workflow.status]}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <Button size="sm" onClick={handleApprove} loading={isSubmitting}>Approuver</Button>
          <Button size="sm" variant="danger" onClick={() => setShowReject(true)}>Rejeter</Button>
        </div>
      </div>

      {showReject && (
        <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
          <textarea
            className="input min-h-[80px] resize-y"
            placeholder="Raison du rejet…"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowReject(false)}>Annuler</Button>
            <Button variant="danger" size="sm" loading={isSubmitting} disabled={!rejectReason.trim()} onClick={handleReject}>
              Confirmer le rejet
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
