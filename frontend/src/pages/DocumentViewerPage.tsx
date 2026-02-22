import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, GitBranch } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Spinner } from '@/components/common/Spinner';
import { Modal } from '@/components/common/Modal';
import { DocumentViewer } from '@/components/documents/DocumentViewer';
import { VersionHistory } from '@/components/documents/VersionHistory';
import { documentService } from '@/services/documentService';
import { workflowService } from '@/services/workflowService';
import { usePermissions } from '@/hooks/usePermissions';
import type { Document } from '@/types/document.types';
import toast from 'react-hot-toast';

export function DocumentViewerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canDelete } = usePermissions();
  const [doc, setDoc] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'versions'>('details');

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    documentService.getById(id)
      .then(setDoc)
      .catch(() => { toast.error('Document introuvable'); navigate('/documents'); })
      .finally(() => setIsLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await documentService.remove(id);
      toast.success('Document supprimé');
      navigate('/documents');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleSubmitWorkflow = async () => {
    if (!id) return;
    try {
      await workflowService.submit(id);
      toast.success('Document soumis pour validation');
      const updated = await documentService.getById(id);
      setDoc(updated);
    } catch {
      toast.error('Erreur lors de la soumission');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-24"><Spinner size="lg" className="text-primary-600" /></div>;
  }

  if (!doc) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/documents')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" /> Retour aux documents
        </button>
        <div className="flex items-center gap-2">
          {doc.status === 'BROUILLON' && (
            <Button variant="secondary" size="sm" onClick={handleSubmitWorkflow}>
              <GitBranch className="h-4 w-4" /> Soumettre
            </Button>
          )}
          {canDelete && (
            <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
              <Trash2 className="h-4 w-4" /> Supprimer
            </Button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'details' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Détails
          </button>
          <button
            onClick={() => setActiveTab('versions')}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'versions' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Historique des versions
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'details' && <DocumentViewer document={doc} />}
          {activeTab === 'versions' && <VersionHistory documentId={doc.id} />}
        </div>
      </div>

      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirmer la suppression">
        <p className="text-sm text-gray-600 mb-5">
          Êtes-vous sûr de vouloir supprimer le document <strong>"{doc.title}"</strong> ? Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowDeleteModal(false)}>Annuler</Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>Supprimer</Button>
        </div>
      </Modal>
    </div>
  );
}
