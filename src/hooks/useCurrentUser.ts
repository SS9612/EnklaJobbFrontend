import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { useAuth } from '../auth/useAuth';

export const CURRENT_USER_QUERY_KEY = ['currentUser'] as const;

/**
 * Fetches the current user's profile from GET /auth/me.
 * Only runs when the auth status is 'authenticated' — avoids unnecessary
 * 401 responses when the user is not logged in.
 */
export function useCurrentUser() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: () => authApi.me().then((r) => r.data),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
