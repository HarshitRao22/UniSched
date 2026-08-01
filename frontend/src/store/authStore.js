import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set, get) => ({
  admin: authService.getCurrentAdmin(),
  isLoggedIn: authService.isLoggedIn(),
  loading: false,
  error: null,

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(username, password);
      set({
        admin: response.admin,
        isLoggedIn: true,
        loading: false,
        error: null,
      });
      return { success: true, message: response.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Login failed';
      set({
        isLoggedIn: false,
        loading: false,
        error: errorMessage,
      });
      return { success: false, message: errorMessage };
    }
  },

  logout: () => {
    authService.logout();
    set({
      admin: null,
      isLoggedIn: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
