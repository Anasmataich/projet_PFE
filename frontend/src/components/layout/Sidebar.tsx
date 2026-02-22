import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Upload, GitBranch, Search, Users,
  Shield, BarChart3, Settings, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useUiStore } from '@/store/uiStore';
import { usePermissions } from '@/hooks/usePermissions';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  show?: boolean;
}

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const { canManageUsers, canViewAudit, canViewReports, canUseAITools, canUpload, canApproveWorkflow } = usePermissions();
  const location = useLocation();

  const navItems: NavItem[] = [
    { to: '/', label: 'Tableau de bord', icon: LayoutDashboard },
    { to: '/documents', label: 'Documents', icon: FileText },
    { to: '/upload', label: 'Uploader', icon: Upload, show: canUpload },
    { to: '/workflow', label: 'Workflows', icon: GitBranch, show: canApproveWorkflow },
    { to: '/ai', label: 'Outils IA', icon: Search, show: canUseAITools },
    { to: '/reports', label: 'Rapports', icon: BarChart3, show: canViewReports },
    { to: '/audit', label: 'Audit', icon: Shield, show: canViewAudit },
    { to: '/users', label: 'Utilisateurs', icon: Users, show: canManageUsers },
    { to: '/settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-[72px]'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-sm">
          GED
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 truncate">GED Plateforme</p>
            <p className="text-[10px] text-gray-500 truncate">Ministère de l'Éducation</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems
          .filter((item) => item.show !== false)
          .map((item) => {
            const Icon = item.icon;
            const isActive = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-gray-200 p-3">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-2 rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 transition-colors"
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          {sidebarOpen && <span>Réduire</span>}
        </button>
      </div>
    </aside>
  );
}
