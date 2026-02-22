import { useState, useEffect } from 'react';
import { FileText, Upload, Clock, Users, ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@/components/common/Spinner';
import { Button } from '@/components/common/Button';
import { PieChart } from '@/components/reports/PieChart';
import { BarChart } from '@/components/reports/BarChart';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { reportService, type DashboardStats } from '@/services/reportService';
import { documentService } from '@/services/documentService';
import { DocumentCard } from '@/components/documents/DocumentCard';
import type { Document } from '@/types/document.types';

export function DashboardPage() {
  const { user } = useAuth();
  const { canUpload } = usePermissions();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentDocs, setRecentDocs] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      reportService.getDashboardStats(),
      documentService.list({ page: 1, limit: 5 }).then((r) => r.data),
    ])
      .then(([s, docs]) => {
        setStats(s);
        setRecentDocs(docs);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center py-24"><Spinner size="lg" className="text-primary-600" /></div>;
  }

  const cards = [
    { label: 'Documents', value: stats?.totalDocuments ?? 0, icon: FileText, color: 'text-blue-600 bg-blue-50', to: '/documents' },
    { label: 'Ce mois-ci', value: stats?.documentsThisMonth ?? 0, icon: TrendingUp, color: 'text-green-600 bg-green-50', to: '/documents' },
    { label: 'En attente', value: stats?.pendingWorkflows ?? 0, icon: Clock, color: 'text-amber-600 bg-amber-50', to: '/workflow' },
    { label: 'Utilisateurs', value: stats?.totalUsers ?? 0, icon: Users, color: 'text-primary-600 bg-primary-50', to: '/users' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-sm text-gray-500 mt-1">
            Bienvenue, {user?.firstName ?? user?.email?.split('@')[0]}
          </p>
        </div>
        {canUpload && (
          <Button onClick={() => navigate('/upload')}>
            <Upload className="h-4 w-4" /> Nouveau document
          </Button>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} onClick={() => navigate(c.to)} className="card p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2.5 ${c.color}`}><Icon className="h-5 w-5" /></div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{c.value.toLocaleString('fr-FR')}</p>
                  <p className="text-xs text-gray-500">{c.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      {stats && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Documents par catégorie</h3>
            <PieChart data={stats.categoryBreakdown.map((c) => ({ label: c.category, value: c.count }))} />
          </div>
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Documents par statut</h3>
            <BarChart data={stats.statusBreakdown.map((s) => ({ label: s.status, value: s.count }))} />
          </div>
        </div>
      )}

      {/* Recent documents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Documents récents</h2>
          <button onClick={() => navigate('/documents')} className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium">
            Voir tout <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        {recentDocs.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8 card">Aucun document récent</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentDocs.map((doc) => (
              <DocumentCard key={doc.id} document={doc} onClick={() => navigate(`/documents/${doc.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
