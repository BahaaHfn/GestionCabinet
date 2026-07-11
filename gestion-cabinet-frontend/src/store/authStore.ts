import { create } from 'zustand';
import api from '../api';
import { LoginRequest, AuthResponse, RegisterRequest } from '../types';

interface AuthState {
  user: AuthResponse | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  registerUser: (data: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  init: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const authData = response.data;
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(authData));
      set({ user: authData, loading: false });
      return true;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Login failed';
      set({ error: errMsg, loading: false });
      return false;
    }
  },

  registerUser: async (data) => {
    set({ loading: true, error: null });
    try {
      await api.post('/auth/register', data);
      set({ loading: false });
      return true;
    } catch (err: any) {
      const errMsg = err.response?.data || err.message || 'Registration failed';
      set({ error: typeof errMsg === 'string' ? errMsg : 'Registration failed', loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null });
  },

  init: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as AuthResponse;
        set({ user });
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }
}));
