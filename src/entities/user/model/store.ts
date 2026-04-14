import { create } from 'zustand';
import type { AuthState } from './types';

export const useAuthStore = create<AuthState>((set) => {
  // Check if user has a valid token in localStorage
  const token = localStorage.getItem('access_token');
  const isAuthenticated = !!token;
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return {
    user: user,
    isAuthenticated,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    logout: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      set({ user: null, isAuthenticated: false });
    },
  };
});
