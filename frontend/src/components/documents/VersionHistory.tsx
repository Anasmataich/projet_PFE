import { useState, useEffect } from 'react';
import { History, Download } from 'lucide-react';
import { Spinner } from '@/components/common/Spinner';
import { formatDateTime, formatFileSize } from '@/utils/formatters';
import { documentService } from '@/services/documentService';
import type { DocumentVersion } from '@/types/document.types';

interface VersionHistoryProps {
  documentId: string;
}

export function VersionHistory({ documentId }: VersionHistoryProps) {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    documentService.getVersions(documentId)
      .then(setVersions)
      .finally(() => setIsLoading(false));
  }, [documentId]);

  if (isLoading) {
    return <div className="flex justify-center py-8"><Spinner className="text-primary-600" /></div>;
  }

  if (versions.length === 0) {
    return <p className="text-sm text-gray-500 text-center py-6">Aucune version disponible</p>;
  }

  return (
    <div className="space-y-1">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
        <History className="h-4 w-4" />
        Historique des versions
      </h3>

      <div className="relative pl-6 space-y-4">
        <div className="absolute left-2.5 top-1 bottom-1 w-px bg-gray-200" />

        {versions.map((v) => (
          <div key={v.id} className="relative flex items-start gap-3">
            <div className="absolute -left-6 top-1 h-5 w-5 rounded-full border-2 border-primary-300 bg-white flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-primary-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">Version {v.versionNumber}</span>
                <span className="text-xs text-gray-500">{formatDateTime(v.createdAt)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {v.uploaderName ?? 'Utilisateur'} — {formatFileSize(v.fileSize)}
              </p>
              {v.changeNote && <p className="text-xs text-gray-600 mt-1 italic">"{v.changeNote}"</p>}
            </div>
            <button className="rounded p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors" title="Télécharger cette version">
              <Download className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
