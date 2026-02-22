import { useState, useEffect, useCallback } from 'react';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';
import { Table, type Column } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { Alert } from '@/components/common/Alert';
import { Pagination } from '@/components/common/Pagination';
import { SearchBar } from '@/components/common/SearchBar';
import { reportService } from '@/services/reportService';
import { ROLE_LABELS } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';
import { validateEmail, validatePassword } from '@/utils/validators';
import type { User, UserFilters } from '@/types/user.types';
import type { UserRole, UserStatus } from '@/types/auth.types';
import toast from 'react-hot-toast';

export function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<UserFilters>({ page: 1, limit: 20 });
  const [isLoading, setIsLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await reportService.getUsers(filters);
      setUsers(res.data);
      setTotal(res.total);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const columns: Column<User>[] = [
    {
      key: 'user',
      header: 'Utilisateur',
      render: (u) => (
        <div>
          <p className="text-sm font-medium text-gray-900">
            {u.firstName || u.lastName ? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() : u.email.split('@')[0]}
          </p>
          <p className="text-xs text-gray-500">{u.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rôle',
      render: (u) => <Badge variant="info">{ROLE_LABELS[u.role]}</Badge>,
    },
    {
      key: 'status',
      header: 'Statut',
      render: (u) => (
        <Badge variant={u.status === 'ACTIVE' ? 'success' : u.status === 'SUSPENDED' ? 'danger' : 'warning'}>
          {u.status}
        </Badge>
      ),
    },
    {
      key: 'mfa',
      header: 'MFA',
      render: (u) => <Badge variant={u.mfaEnabled ? 'success' : 'default'}>{u.mfaEnabled ? 'Activé' : 'Désactivé'}</Badge>,
    },
    {
      key: 'created',
      header: 'Inscription',
      render: (u) => <span className="text-xs">{formatDate(u.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-24',
      render: (u) => (
        <div className="flex gap-1">
          <button onClick={(e) => { e.stopPropagation(); setEditUser(u); }} className="rounded p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteUser(u); }} className="rounded p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleCreate = async (data: { email: string; password: string; role: string; firstName?: string; lastName?: string }) => {
    try {
      await reportService.createUser(data);
      toast.success('Utilisateur créé');
      setCreateOpen(false);
      load();
    } catch {
      toast.error('Erreur lors de la création');
    }
  };

  const handleUpdate = async (id: string, data: Record<string, unknown>) => {
    try {
      await reportService.updateUser(id, data);
      toast.success('Utilisateur mis à jour');
      setEditUser(null);
      load();
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    try {
      await reportService.deleteUser(deleteUser.id);
      toast.success('Utilisateur supprimé');
      setDeleteUser(null);
      load();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <Users className="h-6 w-6 text-primary-600" />
            Gestion des utilisateurs
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} utilisateur(s)</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" /> Nouvel utilisateur
        </Button>
      </div>

      <div className="card p-4 flex gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <SearchBar placeholder="Rechercher…" onSearch={(s) => setFilters({ ...filters, search: s, page: 1 })} />
        </div>
        <select className="input w-44" value={filters.role ?? ''} onChange={(e) => setFilters({ ...filters, role: (e.target.value as UserRole) || undefined, page: 1 })}>
          <option value="">Tous les rôles</option>
          {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <Table columns={columns} data={users} isLoading={isLoading} rowKey={(u) => u.id} emptyMessage="Aucun utilisateur" />

      <div className="flex justify-center">
        <Pagination page={filters.page ?? 1} total={total} limit={filters.limit ?? 20} onPageChange={(p) => setFilters({ ...filters, page: p })} />
      </div>

      {/* Create modal */}
      <UserFormModal open={createOpen} onClose={() => setCreateOpen(false)} onSubmit={handleCreate} title="Nouvel utilisateur" />

      {/* Edit modal */}
      {editUser && (
        <EditUserModal user={editUser} open onClose={() => setEditUser(null)} onSubmit={(d) => handleUpdate(editUser.id, d)} />
      )}

      {/* Delete modal */}
      <Modal open={!!deleteUser} onClose={() => setDeleteUser(null)} title="Confirmer la suppression">
        <p className="text-sm text-gray-600 mb-5">Supprimer l'utilisateur <strong>{deleteUser?.email}</strong> ? Cette action est irréversible.</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setDeleteUser(null)}>Annuler</Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>Supprimer</Button>
        </div>
      </Modal>
    </div>
  );
}

function UserFormModal({ open, onClose, onSubmit, title }: {
  open: boolean; onClose: () => void; title: string;
  onSubmit: (data: { email: string; password: string; role: string; firstName?: string; lastName?: string }) => Promise<void>;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>('CONSULTANT');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    const emailErr = validateEmail(email);
    if (emailErr) { setError(emailErr); return; }
    const pwErr = validatePassword(password);
    if (pwErr) { setError(pwErr); return; }

    setLoading(true);
    try {
      await onSubmit({ email, password, role, firstName: firstName || undefined, lastName: lastName || undefined });
      setEmail(''); setPassword(''); setRole('CONSULTANT'); setFirstName(''); setLastName('');
    } catch (err) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Prénom</label><input className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
          <div><label className="label">Nom</label><input className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
        </div>
        <div><label className="label">Email *</label><input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><label className="label">Mot de passe *</label><input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <div>
          <label className="label">Rôle *</label>
          <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
            {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" size="sm" onClick={onClose}>Annuler</Button>
          <Button size="sm" loading={loading} onClick={handleSubmit}>Créer</Button>
        </div>
      </div>
    </Modal>
  );
}

function EditUserModal({ user, open, onClose, onSubmit }: {
  user: User; open: boolean; onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}) {
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState<UserStatus>(user.status);
  const [firstName, setFirstName] = useState(user.firstName ?? '');
  const [lastName, setLastName] = useState(user.lastName ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await onSubmit({ role, status, firstName: firstName || null, lastName: lastName || null });
    } catch (err) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Modifier ${user.email}`}>
      <div className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Prénom</label><input className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
          <div><label className="label">Nom</label><input className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
        </div>
        <div>
          <label className="label">Rôle</label>
          <select className="input" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
            {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Statut</label>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value as UserStatus)}>
            <option value="ACTIVE">Actif</option>
            <option value="INACTIVE">Inactif</option>
            <option value="SUSPENDED">Suspendu</option>
            <option value="PENDING">En attente</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" size="sm" onClick={onClose}>Annuler</Button>
          <Button size="sm" loading={loading} onClick={handleSubmit}>Enregistrer</Button>
        </div>
      </div>
    </Modal>
  );
}
