// ── Request DTOs (mirror backend FluentValidation rules) ────────────────────

export type UserRole = 'Ungdom' | 'Vårdnadshavare' | 'Rekryterare';

export const REGISTERABLE_ROLES: UserRole[] = ['Ungdom', 'Vårdnadshavare', 'Rekryterare'];

export interface RegisterRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  /** ISO 8601 date string: YYYY-MM-DD */
  dateOfBirth: string;
  role: UserRole;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface ConfirmEmailRequestDto {
  userId: string;
  /** Base64Url-encoded email confirmation token */
  token: string;
}

export interface ResendConfirmationRequestDto {
  email: string;
}

export interface ForgotPasswordRequestDto {
  email: string;
}

export interface ResetPasswordRequestDto {
  userId: string;
  /** Base64Url-encoded password reset token */
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

// ── Response DTOs (mirror backend response shape) ────────────────────────────

export interface UserProfileResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  /** ISO 8601 date string: YYYY-MM-DD */
  dateOfBirth: string;
  roles: string[];
  createdAt: string;
  lastLoginAt: string | null;
}

export interface AuthResponseDto {
  accessToken: string;
  accessTokenExpiresAt: string;
  user: UserProfileResponseDto;
}

export interface MessageResponseDto {
  message: string;
}

// ── Error shapes ──────────────────────────────────────────────────────────────

/** Machine-readable error codes included in ProblemDetails from the backend. */
export type AuthErrorCode = 'EMAIL_NOT_CONFIRMED';

/** Shape of backend ProblemDetails / validation errors returned by the API. */
export interface ApiErrorResponse {
  status: number;
  title: string;
  errorCode?: AuthErrorCode;
  errors?: Record<string, string[]>;
  instance?: string;
}
