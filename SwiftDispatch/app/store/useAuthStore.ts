import { create } from 'zustand';
import { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User, token: string) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  setUser: (user, token) =>
    set({ user, token, isAuthenticated: true, isLoading: false }),

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  logout: () =>
    set({ user: null, token: null, isAuthenticated: false }),

  setLoading: (loading) => set({ isLoading: loading }),
}));
