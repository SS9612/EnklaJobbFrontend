import type { UserProfileResponseDto } from '../types/auth.types';

// ── State ─────────────────────────────────────────────────────────────────────

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  status: AuthStatus;
  user: UserProfileResponseDto | null;
  accessToken: string | null;
}

export const initialAuthState: AuthState = {
  status: 'idle',
  user: null,
  accessToken: null,
};

// ── Actions ───────────────────────────────────────────────────────────────────

export type AuthAction =
  | { type: 'INIT' }
  | { type: 'LOADING' }
  | { type: 'SET_AUTH'; payload: { user: UserProfileResponseDto; accessToken: string } }
  | { type: 'SET_UNAUTHENTICATED' };

// ── Reducer ───────────────────────────────────────────────────────────────────
// An explicit state machine prevents impossible states (e.g. "authenticated" with
// no user, or "loading" with a stale user still set).

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'INIT':
      return { status: 'idle', user: null, accessToken: null };

    case 'LOADING':
      return { ...state, status: 'loading' };

    case 'SET_AUTH':
      return {
        status: 'authenticated',
        user: action.payload.user,
        accessToken: action.payload.accessToken,
      };

    case 'SET_UNAUTHENTICATED':
      return { status: 'unauthenticated', user: null, accessToken: null };

    default:
      return state;
  }
}
