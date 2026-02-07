export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  status: number;
  data: string; // JWT access token
}

export interface RefreshTokenResponse {
  success: boolean;
  status: number;
  data: string; // JWT access token
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}
