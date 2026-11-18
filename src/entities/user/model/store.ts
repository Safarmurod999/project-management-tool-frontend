import { create } from 'zustand';
import { disconnectSocket } from '@/shared/api/socket';
import type { AuthState, User } from './types';

export const useAuthStore = create<AuthState>((set) => {
  // Check if user has a valid token in localStorage
  const token = localStorage.getItem('access_token');
  const isAuthenticated = !!token;
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return {
    user: user,
    users: [],
    isAuthenticated,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setUsers: (users: User[]) => set({ users }),
    logout: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      // Drop the authenticated realtime connection
      disconnectSocket();
      set({ user: null, isAuthenticated: false });
    },
  };
});
