import { useState, useEffect } from 'react';
import { Download, Eye, ExternalLink } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { formatDate, formatFileSize } from '@/utils/formatters';
import { CATEGORY_LABELS, STATUS_COLORS, CONFIDENTIALITY_COLORS, CONFIDENTIALITY_LABELS, STATUS_LABELS } from '@/utils/constants';
import { documentService } from '@/services/documentService';
import type { Document } from '@/types/document.types';
import toast from 'react-hot-toast';

interface DocumentViewerProps {
  document: Document;
}

export function DocumentViewer({ document: doc }: DocumentViewerProps) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loadingUrl, setLoadingUrl] = useState(false);

  useEffect(() => {
    setDownloadUrl(null);
  }, [doc.id]);

  const handleDownload = async () => {
    setLoadingUrl(true);
    try {
      const url = await documentService.getDownloadUrl(doc.id);
      setDownloadUrl(url);
      window.open(url, '_blank');
    } catch {
      toast.error('Erreur lors du téléchargement');
    } finally {
      setLoadingUrl(false);
    }
  };

  const isPdf = doc.mimeType === 'application/pdf';
  const isImage = doc.mimeType.startsWith('image/');

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{doc.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{doc.fileName}</p>
        </div>
        <div className="flex gap-2">
          {downloadUrl && (isPdf || isImage) && (
            <Button variant="secondary" size="sm" onClick={() => window.open(downloadUrl, '_blank')}>
              <Eye className="h-4 w-4" /> Prévisualiser
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={handleDownload} loading={loadingUrl}>
            <Download className="h-4 w-4" /> Télécharger
          </Button>
        </div>
      </div>

      {downloadUrl && isPdf && (
        <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-100">
          <iframe src={downloadUrl} className="w-full h-[500px]" title="Aperçu du document" />
        </div>
      )}
      {downloadUrl && isImage && (
        <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center p-4">
          <img src={downloadUrl} alt={doc.title} className="max-w-full max-h-[500px] object-contain" />
        </div>
      )}
      {!downloadUrl && !loadingUrl && (
        <div className="flex flex-col items-center justify-center py-16 rounded-lg border-2 border-dashed border-gray-200">
          <ExternalLink className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">Cliquez sur "Télécharger" pour accéder au document</p>
        </div>
      )}
      {loadingUrl && (
        <div className="flex justify-center py-8"><Spinner size="lg" className="text-primary-600" /></div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoItem label="Catégorie" value={CATEGORY_LABELS[doc.category]} />
        <InfoItem label="Statut">
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[doc.status]}`}>
            {STATUS_LABELS[doc.status]}
          </span>
        </InfoItem>
        <InfoItem label="Confidentialité">
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${CONFIDENTIALITY_COLORS[doc.confidentialityLevel]}`}>
            {CONFIDENTIALITY_LABELS[doc.confidentialityLevel]}
          </span>
        </InfoItem>
        <InfoItem label="Taille" value={formatFileSize(doc.fileSize)} />
        <InfoItem label="Version" value={`v${doc.currentVersion}`} />
        <InfoItem label="Créé le" value={formatDate(doc.createdAt)} />
      </div>

      {doc.description && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{doc.description}</p>
        </div>
      )}

      {doc.tags.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
          <div className="flex flex-wrap gap-1.5">
            {doc.tags.map((t) => <Badge key={t}>{t}</Badge>)}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      {children ?? <p className="text-sm font-medium text-gray-900">{value}</p>}
    </div>
  );
}
