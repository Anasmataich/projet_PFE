import { BarChart3 } from 'lucide-react';
import { ReportsDashboard } from '@/components/reports/ReportsDashboard';

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <BarChart3 className="h-6 w-6 text-primary-600" />
          Rapports & Statistiques
        </h1>
        <p className="text-sm text-gray-500 mt-1">Vue d'ensemble analytique de la plateforme</p>
      </div>
      <ReportsDashboard />
    </div>
  );
}
