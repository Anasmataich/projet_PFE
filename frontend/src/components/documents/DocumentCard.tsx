import { FileText, Calendar, Tag as TagIcon } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { formatRelative, formatFileSize } from '@/utils/formatters';
import { CATEGORY_LABELS, STATUS_COLORS, CONFIDENTIALITY_COLORS, CONFIDENTIALITY_LABELS } from '@/utils/constants';
import { getFileIcon } from '@/utils/helpers';
import type { Document } from '@/types/document.types';

interface DocumentCardProps {
  document: Document;
  onClick: (doc: Document) => void;
}

export function DocumentCard({ document: doc, onClick }: DocumentCardProps) {
  return (
    <div onClick={() => onClick(doc)} className="card p-5 hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-2xl">
          {getFileIcon(doc.mimeType)}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
            {doc.title}
          </h3>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_COLORS[doc.status]}`}>
              {doc.status.replace(/_/g, ' ')}
            </span>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${CONFIDENTIALITY_COLORS[doc.confidentialityLevel]}`}>
              {CONFIDENTIALITY_LABELS[doc.confidentialityLevel]}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              {CATEGORY_LABELS[doc.category]}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatRelative(doc.createdAt)}
            </span>
            <span>{formatFileSize(doc.fileSize)}</span>
          </div>

          {doc.tags.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <TagIcon className="h-3 w-3 text-gray-400" />
              {doc.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} className="text-[10px]">{tag}</Badge>
              ))}
              {doc.tags.length > 3 && <Badge className="text-[10px]">+{doc.tags.length - 3}</Badge>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
