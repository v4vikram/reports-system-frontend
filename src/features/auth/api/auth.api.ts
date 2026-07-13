import { apiClient } from "@/lib/api-client";
import type { AuthUser } from "../types";

export interface AuthResponse {
  user: AuthUser;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export const authApi = {
  getMe: () => apiClient.get<AuthUser>("/api/auth/me"),
  login: (input: LoginInput) => apiClient.post<AuthResponse>("/api/auth/login", input),
  register: (input: RegisterInput) => apiClient.post<AuthResponse>("/api/auth/register", input),
  logout: () => apiClient.post<null>("/api/auth/logout"),
  forgotPassword: (input: ForgotPasswordInput) =>
    apiClient.post<null>("/api/auth/forgot-password", input),
  resetPassword: (input: ResetPasswordInput) =>
    apiClient.post<null>("/api/auth/reset-password", input),
};
