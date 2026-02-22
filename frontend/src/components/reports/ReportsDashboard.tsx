import { useState, useEffect } from 'react';
import { FileText, Users, Clock, TrendingUp } from 'lucide-react';
import { Spinner } from '@/components/common/Spinner';
import { BarChart } from './BarChart';
import { PieChart } from './PieChart';
import { reportService, type DashboardStats } from '@/services/reportService';

export function ReportsDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    reportService.getDashboardStats()
      .then(setStats)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center py-16"><Spinner size="lg" className="text-primary-600" /></div>;
  }

  if (!stats) return <p className="text-sm text-gray-500 text-center py-12">Données indisponibles</p>;

  const statCards = [
    { label: 'Total documents', value: stats.totalDocuments, icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { label: 'Utilisateurs', value: stats.totalUsers, icon: Users, color: 'text-green-600 bg-green-50' },
    { label: 'En attente', value: stats.pendingWorkflows, icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Ce mois', value: stats.documentsThisMonth, icon: TrendingUp, color: 'text-primary-600 bg-primary-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-5">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2.5 ${s.color}`}><Icon className="h-5 w-5" /></div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{s.value.toLocaleString('fr-FR')}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Répartition par catégorie</h3>
          <PieChart data={stats.categoryBreakdown.map((c) => ({ label: c.category, value: c.count }))} />
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Répartition par statut</h3>
          <BarChart data={stats.statusBreakdown.map((s) => ({ label: s.status, value: s.count }))} />
        </div>
      </div>
    </div>
  );
}
