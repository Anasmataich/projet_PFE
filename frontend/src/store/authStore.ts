import { create } from 'zustand';
import type { AuthUser, UserRole } from '@/types/auth.types';
import { authService } from '@/services/authService';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingMFA: { userId: string; pendingToken: string } | null;

  setUser: (user: AuthUser | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  verifyMFA: (totpToken: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  hasRole: (...roles: UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: true,
  pendingMFA: null,

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

  login: async (email, password) => {
    const result = await authService.login({ email, password });

    if (result.requiresMFA) {
      set({ pendingMFA: { userId: result.userId, pendingToken: result.pendingToken! } });
      return true;
    }

    if (result.tokens) {
      localStorage.setItem('access_token', result.tokens.accessToken);
      localStorage.setItem('refresh_token', result.tokens.refreshToken);
      const user = await authService.getMe();
      set({
        user: {
          userId: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName ?? undefined,
          lastName: user.lastName ?? undefined,
          mfaEnabled: user.mfaEnabled,
        },
        isAuthenticated: true,
        isLoading: false,
        pendingMFA: null,
      });
    }
    return false;
  },

  verifyMFA: async (totpToken) => {
    const { pendingMFA } = get();
    if (!pendingMFA) throw new Error('No pending MFA');
    const tokens = await authService.verifyMFA(pendingMFA.userId, totpToken, pendingMFA.pendingToken);
    localStorage.setItem('access_token', tokens.accessToken);
    localStorage.setItem('refresh_token', tokens.refreshToken);
    const user = await authService.getMe();
    set({
      user: {
        userId: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        mfaEnabled: user.mfaEnabled,
      },
      isAuthenticated: true,
      isLoading: false,
      pendingMFA: null,
    });
  },

  logout: async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, isAuthenticated: false, isLoading: false, pendingMFA: null });
  },

  loadUser: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const user = await authService.getMe();
      set({
        user: {
          userId: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName ?? undefined,
          lastName: user.lastName ?? undefined,
          mfaEnabled: user.mfaEnabled,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  hasRole: (...roles) => {
    const { user } = get();
    if (!user) return false;
    return roles.includes(user.role);
  },
}));
