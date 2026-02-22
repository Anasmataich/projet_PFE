import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Grid3X3, List, Upload, Filter } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { SearchBar } from '@/components/common/SearchBar';
import { Pagination } from '@/components/common/Pagination';
import { DocumentTable } from '@/components/documents/DocumentTable';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { useDocuments } from '@/hooks/useDocuments';
import { usePermissions } from '@/hooks/usePermissions';
import { CATEGORY_LABELS, STATUS_LABELS, CONFIDENTIALITY_LABELS } from '@/utils/constants';
import type { DocumentCategory, DocumentStatus, ConfidentialityLevel } from '@/types/document.types';

export function DocumentsPage() {
  const navigate = useNavigate();
  const { canUpload } = usePermissions();
  const { documents, total, filters, isLoading, search, changePage, applyFilters, resetFilters } = useDocuments();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} document(s) au total</p>
        </div>
        <div className="flex items-center gap-2">
          {canUpload && (
            <Button onClick={() => navigate('/upload')}>
              <Upload className="h-4 w-4" /> Uploader
            </Button>
          )}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchBar placeholder="Rechercher un document…" onSearch={search} defaultValue={filters.search ?? ''} />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4" /> Filtres
            </Button>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button onClick={() => setViewMode('table')} className={`p-2 ${viewMode === 'table' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}>
                <List className="h-4 w-4" />
              </button>
              <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}>
                <Grid3X3 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="label">Catégorie</label>
                <select className="input w-44" value={filters.category ?? ''} onChange={(e) => applyFilters({ category: (e.target.value as DocumentCategory) || undefined })}>
                  <option value="">Toutes</option>
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Statut</label>
                <select className="input w-36" value={filters.status ?? ''} onChange={(e) => applyFilters({ status: (e.target.value as DocumentStatus) || undefined })}>
                  <option value="">Tous</option>
                  {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Confidentialité</label>
                <select className="input w-36" value={filters.confidentialityLevel ?? ''} onChange={(e) => applyFilters({ confidentialityLevel: (e.target.value as ConfidentialityLevel) || undefined })}>
                  <option value="">Toutes</option>
                  {Object.entries(CONFIDENTIALITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <Button variant="ghost" size="sm" onClick={resetFilters}>Réinitialiser</Button>
            </div>
          </div>
        )}
      </div>

      {viewMode === 'table' ? (
        <DocumentTable documents={documents} isLoading={isLoading} onRowClick={(doc) => navigate(`/documents/${doc.id}`)} />
      ) : (
        isLoading ? (
          <div className="flex justify-center py-16"><FileText className="h-12 w-12 text-gray-200 animate-pulse" /></div>
        ) : documents.length === 0 ? (
          <div className="text-center py-16 card">
            <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">Aucun document trouvé</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => <DocumentCard key={doc.id} document={doc} onClick={() => navigate(`/documents/${doc.id}`)} />)}
          </div>
        )
      )}

      <div className="flex justify-center">
        <Pagination page={filters.page ?? 1} total={total} limit={filters.limit ?? 20} onPageChange={changePage} />
      </div>
    </div>
  );
}
