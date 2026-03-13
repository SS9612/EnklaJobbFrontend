import api from './axios';
import type {
  AuthResponseDto,
  LoginRequestDto,
  RegisterRequestDto,
  UserProfileResponseDto,
} from '../types/auth.types';

export const authApi = {
  /** Register a new account. Always returns 200 (even for duplicate emails). */
  register: (data: RegisterRequestDto) =>
    api.post<{ message: string }>('/api/auth/register', data),

  /** Login with email + password. Sets HttpOnly refresh token cookie. */
  login: (data: LoginRequestDto) =>
    api.post<AuthResponseDto>('/api/auth/login', data),

  /**
   * Exchange the HttpOnly cookie for a new access token.
   * No body required — the browser sends the cookie automatically.
   */
  refresh: () => api.post<AuthResponseDto>('/api/auth/refresh'),

  /**
   * Invalidate the entire refresh token family.
   * No body required — the browser sends the cookie automatically.
   */
  logout: () => api.post<void>('/api/auth/logout'),

  /** Return the currently authenticated user's profile (requires Bearer token). */
  me: () => api.get<UserProfileResponseDto>('/api/auth/me'),
};
