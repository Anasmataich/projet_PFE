import { useState } from 'react';
import { Settings, Lock, Shield } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import { ROLE_LABELS } from '@/utils/constants';
import { validatePassword } from '@/utils/validators';
import toast from 'react-hot-toast';

export function SettingsPage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState('');

  const handleChangePassword = async () => {
    setError('');
    if (!currentPassword) { setError('Le mot de passe actuel est requis'); return; }
    const pwErr = validatePassword(newPassword);
    if (pwErr) { setError(pwErr); return; }
    if (newPassword !== confirmPassword) { setError('Les mots de passe ne correspondent pas'); return; }

    setIsChanging(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      toast.success('Mot de passe mis à jour');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Erreur');
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Settings className="h-6 w-6 text-primary-600" />
          Paramètres
        </h1>
        <p className="text-sm text-gray-500 mt-1">Gérez votre compte et vos préférences</p>
      </div>

      {/* Profile info */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Informations du compte</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoRow label="Email" value={user?.email ?? '—'} />
          <InfoRow label="Rôle" value={user?.role ? ROLE_LABELS[user.role] : '—'} />
          <InfoRow label="Prénom" value={user?.firstName ?? '—'} />
          <InfoRow label="Nom" value={user?.lastName ?? '—'} />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Shield className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">
            MFA : {user?.mfaEnabled ? <span className="font-medium text-green-600">Activée</span> : <span className="text-gray-400">Désactivée</span>}
          </span>
        </div>
      </div>

      {/* Change password */}
      <div className="card p-6 space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Lock className="h-5 w-5" /> Changer le mot de passe
        </h2>

        {error && <Alert variant="error">{error}</Alert>}

        <div className="space-y-3">
          <div>
            <label className="label">Mot de passe actuel</label>
            <input type="password" className="input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div>
            <label className="label">Nouveau mot de passe</label>
            <input type="password" className="input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div>
            <label className="label">Confirmer le mot de passe</label>
            <input type="password" className="input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button loading={isChanging} onClick={handleChangePassword}>
            Mettre à jour le mot de passe
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}
