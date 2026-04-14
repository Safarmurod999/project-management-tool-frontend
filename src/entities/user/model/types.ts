export interface User {
  id: string;
  email: string;
  name: string;
  role: {
    id: string;
    name: string;
    code: string;
  };
  permissions: {
    id: string;
    name: string;
    code: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface RegisterResponse {
  success: boolean;
  status: number;
  data: User;
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
