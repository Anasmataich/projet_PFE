import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { MFAForm } from '@/components/auth/MFAForm';
import { useAuth } from '@/hooks/useAuth';

export function LoginPage() {
  const { login, verifyMFA, pendingMFA } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const requiresMFA = await login(email, password);
      if (!requiresMFA) navigate(from, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFA = async (token: string) => {
    setIsLoading(true);
    try {
      await verifyMFA(token);
      navigate(from, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 items-center justify-center px-12">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <span className="text-3xl font-bold text-white">GED</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Plateforme Documentaire Intelligente
          </h1>
          <p className="text-primary-200 text-sm leading-relaxed">
            Système de Gestion Électronique de Documents sécurisé du Ministère de l'Éducation Nationale.
            Classez, recherchez et validez vos documents avec l'aide de l'Intelligence Artificielle.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8 lg:hidden">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-600">
              <span className="text-xl font-bold text-white">GED</span>
            </div>
          </div>

          {!pendingMFA && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 text-center">Connexion</h2>
              <p className="mt-2 mb-8 text-sm text-gray-500 text-center">Accédez à votre espace sécurisé</p>
              <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
            </>
          )}

          {pendingMFA && <MFAForm onSubmit={handleMFA} isLoading={isLoading} />}

          <p className="mt-6 text-center text-xs text-gray-400">
            Protégé par chiffrement AES-256 et authentification JWT
          </p>
        </div>
      </div>
    </div>
  );
}
