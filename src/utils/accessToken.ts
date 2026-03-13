/**
 * Module-level in-memory access token store.
 *
 * Why not localStorage?
 *   localStorage is readable by any JS running on the page (XSS risk).
 *   A module variable lives only in the JS heap — inaccessible to extensions
 *   or injected scripts that do not share the same module scope.
 *
 * Why not React state?
 *   React state triggers re-renders. The token is needed by the Axios interceptor,
 *   which runs outside React's render cycle. A plain module variable is the right tool.
 *
 * Trade-off: the token is lost on page refresh.
 *   This is intentional. AuthContext calls POST /auth/refresh on mount to silently
 *   restore the session using the HttpOnly cookie — the user never notices.
 */

let _accessToken: string | null = null;

export const getAccessToken = (): string | null => _accessToken;

export const setAccessToken = (token: string | null): void => {
  _accessToken = token;
};
