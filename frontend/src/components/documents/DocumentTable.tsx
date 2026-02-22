import { Table, type Column } from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { formatDate, formatFileSize } from '@/utils/formatters';
import { CATEGORY_LABELS, STATUS_COLORS, CONFIDENTIALITY_COLORS, CONFIDENTIALITY_LABELS } from '@/utils/constants';
import type { Document } from '@/types/document.types';

interface DocumentTableProps {
  documents: Document[];
  isLoading: boolean;
  onRowClick: (doc: Document) => void;
}

export function DocumentTable({ documents, isLoading, onRowClick }: DocumentTableProps) {
  const columns: Column<Document>[] = [
    {
      key: 'title',
      header: 'Titre',
      render: (doc) => (
        <div>
          <p className="font-medium text-gray-900 truncate max-w-xs">{doc.title}</p>
          <p className="text-xs text-gray-500">{doc.fileName}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Catégorie',
      render: (doc) => <span className="text-xs">{CATEGORY_LABELS[doc.category]}</span>,
    },
    {
      key: 'status',
      header: 'Statut',
      render: (doc) => (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_COLORS[doc.status]}`}>
          {doc.status.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'confidentialityLevel',
      header: 'Confidentialité',
      render: (doc) => (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${CONFIDENTIALITY_COLORS[doc.confidentialityLevel]}`}>
          {CONFIDENTIALITY_LABELS[doc.confidentialityLevel]}
        </span>
      ),
    },
    {
      key: 'size',
      header: 'Taille',
      render: (doc) => formatFileSize(doc.fileSize),
    },
    {
      key: 'tags',
      header: 'Tags',
      render: (doc) => (
        <div className="flex gap-1 flex-wrap">
          {doc.tags.slice(0, 2).map((t) => <Badge key={t} className="text-[10px]">{t}</Badge>)}
          {doc.tags.length > 2 && <Badge className="text-[10px]">+{doc.tags.length - 2}</Badge>}
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (doc) => formatDate(doc.createdAt),
    },
  ];

  return <Table columns={columns} data={documents} isLoading={isLoading} rowKey={(d) => d.id} onRowClick={onRowClick} emptyMessage="Aucun document trouvé" />;
}
