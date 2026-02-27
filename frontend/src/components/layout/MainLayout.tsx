import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useUiStore } from '@/store/uiStore';
import { cn } from '@/utils/helpers';

export function MainLayout() {
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const location = useLocation();

  // Fermer sidebar sur mobile lors de navigation
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen?.(false);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Overlay mobile ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen?.(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <Sidebar />

      {/* ── Contenu principal ── */}
      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-300 ease-in-out',
          // Desktop : décalage selon sidebar
          sidebarOpen ? 'lg:ml-[260px]' : 'lg:ml-[72px]',
          // Mobile : pas de décalage (sidebar en overlay)
          'ml-0'
        )}
      >
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>

        {/* ── Footer minimal ── */}
        <footer className="border-t border-slate-200/80 bg-white px-6 py-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              © {new Date().getFullYear()} — Direction des Systèmes d'Information · Ministère de l'Éducation Nationale
            </span>
            <span className="hidden sm:block">GED Plateforme v1.0.0 · ISO/IEC 27001</span>
          </div>
        </footer>
      </div>
    </div>
  );
}