import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { authApi } from '../api/auth.api';
import { setAccessToken } from '../utils/accessToken';
import { authReducer, initialAuthState, type AuthState } from './authReducer';
import type { LoginRequestDto, RegisterRequestDto } from '../types/auth.types';

// ── Context shape ─────────────────────────────────────────────────────────────

export interface AuthContextValue extends AuthState {
  login: (data: LoginRequestDto) => Promise<void>;
  register: (data: RegisterRequestDto) => Promise<void>;
  logout: () => Promise<void>;
  /** Convenience helper — true only when status is 'authenticated'. */
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // ── Silent refresh on mount ────────────────────────────────────────────────
  // When the page loads, the access token is gone (it's in memory, not persisted).
  // Attempt a silent refresh using the HttpOnly cookie. If it succeeds, the session
  // is restored transparently. If it fails, the user is unauthenticated.
  useEffect(() => {
    let cancelled = false;

    const initSession = async () => {
      dispatch({ type: 'INIT' });
      try {
        const { data: authData } = await authApi.refresh();
        if (cancelled) return;

        setAccessToken(authData.accessToken);

        const { data: profile } = await authApi.me();
        if (cancelled) return;

        dispatch({ type: 'SET_AUTH', payload: { user: profile, accessToken: authData.accessToken } });
      } catch {
        if (!cancelled) dispatch({ type: 'SET_UNAUTHENTICATED' });
      }
    };

    initSession();
    return () => { cancelled = true; };
  }, []);

  // ── Auth actions ───────────────────────────────────────────────────────────

  const login = useCallback(async (data: LoginRequestDto) => {
    dispatch({ type: 'LOADING' });
    const { data: authData } = await authApi.login(data);
    setAccessToken(authData.accessToken);

    const { data: profile } = await authApi.me();
    dispatch({ type: 'SET_AUTH', payload: { user: profile, accessToken: authData.accessToken } });
  }, []);

  const register = useCallback(async (data: RegisterRequestDto) => {
    dispatch({ type: 'LOADING' });
    await authApi.register(data);
    dispatch({ type: 'SET_UNAUTHENTICATED' });
  }, []);

  const logout = useCallback(async () => {
    dispatch({ type: 'LOADING' });
    try {
      await authApi.logout();
    } finally {
      setAccessToken(null);
      dispatch({ type: 'SET_UNAUTHENTICATED' });
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      isAuthenticated: state.status === 'authenticated',
      login,
      register,
      logout,
    }),
    [state, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
