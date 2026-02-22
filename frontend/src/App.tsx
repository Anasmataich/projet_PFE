import { useEffect, Component, type ReactNode, type ErrorInfo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppRouter } from '@/router/AppRouter';
import { useAuthStore } from '@/store/authStore';

function ErrorBoundaryFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <p className="text-5xl font-bold text-red-500 mb-4">Oops</p>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Une erreur inattendue s'est produite</h1>
        <p className="text-sm text-gray-500 mb-6">Veuillez rafraîchir la page ou contacter l'administrateur.</p>
        <button onClick={() => window.location.reload()} className="btn-primary">
          Rafraîchir la page
        </button>
      </div>
    </div>
  );
}

interface EBProps { children: ReactNode }
interface EBState { hasError: boolean }

class ErrorBoundary extends Component<EBProps, EBState> {
  constructor(props: EBProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(): EBState { return { hasError: true }; }
  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Production: send to error monitoring service
  }
  render() {
    return this.state.hasError ? <ErrorBoundaryFallback /> : this.props.children;
  }
}

function AuthLoader({ children }: { children: ReactNode }) {
  const loadUser = useAuthStore((s) => s.loadUser);
  useEffect(() => { loadUser(); }, [loadUser]);
  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthLoader>
          <AppRouter />
        </AuthLoader>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { borderRadius: '12px', background: '#1e293b', color: '#f8fafc', fontSize: '14px' },
            success: { iconTheme: { primary: '#22c55e', secondary: '#f8fafc' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#f8fafc' } },
          }}
        />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
