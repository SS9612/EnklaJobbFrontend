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
