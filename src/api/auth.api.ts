import api from './axios';
import type {
  AuthResponseDto,
  ConfirmEmailRequestDto,
  ForgotPasswordRequestDto,
  LoginRequestDto,
  MessageResponseDto,
  RegisterRequestDto,
  ResendConfirmationRequestDto,
  ResetPasswordRequestDto,
  UserProfileResponseDto,
} from '../types/auth.types';

export const authApi = {
  /** Register a new account. Always returns 200 (even for duplicate emails). */
  register: (data: RegisterRequestDto) =>
    api.post<MessageResponseDto>('/api/auth/register', data),

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

  /** Confirm email using the userId + token from the confirmation email link. */
  confirmEmail: (data: ConfirmEmailRequestDto) =>
    api.post<MessageResponseDto>('/api/auth/confirm-email', data),

  /**
   * Re-send the email confirmation link.
   * Always returns 200 regardless of whether the email exists.
   */
  resendConfirmation: (data: ResendConfirmationRequestDto) =>
    api.post<MessageResponseDto>('/api/auth/resend-confirmation', data),

  /**
   * Request a password reset email.
   * Always returns 200 regardless of whether the email exists.
   */
  forgotPassword: (data: ForgotPasswordRequestDto) =>
    api.post<MessageResponseDto>('/api/auth/forgot-password', data),

  /** Reset the password using the userId + token from the reset email link. */
  resetPassword: (data: ResetPasswordRequestDto) =>
    api.post<MessageResponseDto>('/api/auth/reset-password', data),
};
