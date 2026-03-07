export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ErrorResponse {
  code: string;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
  path: string;
  timestamp: string;
  errors?: string[];
}

