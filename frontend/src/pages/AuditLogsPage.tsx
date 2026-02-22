import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import { AuditFilters } from '@/components/audit/AuditFilters';
import { AuditLogTable } from '@/components/audit/AuditLogTable';
import { Pagination } from '@/components/common/Pagination';
import { useAudit } from '@/hooks/useAudit';
import type { AuditFilters as AuditFiltersType } from '@/types/audit.types';

export function AuditLogsPage() {
  const { logs, total, isLoading, fetchLogs } = useAudit();
  const [filters, setFilters] = useState<AuditFiltersType>({ page: 1, limit: 25 });

  useEffect(() => { fetchLogs(filters); }, [fetchLogs, filters]);

  const handleApply = (f: AuditFiltersType) => {
    setFilters({ ...filters, ...f });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Shield className="h-6 w-6 text-primary-600" />
          Journal d'audit
        </h1>
        <p className="text-sm text-gray-500 mt-1">Traçabilité des actions sur la plateforme</p>
      </div>

      <AuditFilters onApply={handleApply} />
      <AuditLogTable logs={logs} isLoading={isLoading} />

      <div className="flex justify-center">
        <Pagination page={filters.page ?? 1} total={total} limit={filters.limit ?? 25} onPageChange={(p) => setFilters({ ...filters, page: p })} />
      </div>
    </div>
  );
}
