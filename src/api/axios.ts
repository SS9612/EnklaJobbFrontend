import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, setAccessToken } from '../utils/accessToken';
import type { AuthResponseDto } from '../types/auth.types';

// Tracks whether a token refresh is already in flight so concurrent 401s
// are queued rather than each triggering their own refresh request.
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token!);
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: '/',
  // withCredentials ensures the browser includes cookies (refresh token) even on
  // cross-origin requests in production. In dev the Vite proxy makes all calls
  // same-origin, so this is a no-op there but correct to have for production.
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor ───────────────────────────────────────────────────────
// Attach the in-memory access token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor ──────────────────────────────────────────────────────
// On 401: attempt a silent token refresh using the HttpOnly cookie, then
// replay the original request. If the refresh also fails, clear state and
// redirect to /login.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const is401 = error.response?.status === 401;
    const alreadyRetried = original._retry === true;
    // Never intercept the refresh call itself — prevents infinite retry loops.
    const isRefreshCall = original.url?.includes('/api/auth/refresh');

    if (is401 && !alreadyRetried && !isRefreshCall) {
      if (isRefreshing) {
        // Another refresh is already in-flight; queue this request to be replayed
        // once that refresh completes.
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          original.headers['Authorization'] = `Bearer ${newToken}`;
          return api(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post<AuthResponseDto>('/api/auth/refresh');
        setAccessToken(data.accessToken);
        processQueue(null, data.accessToken);
        original.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessToken(null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
