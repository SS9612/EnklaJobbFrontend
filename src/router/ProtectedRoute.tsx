import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import Spinner from '../components/ui/Spinner';

/**
 * Guards all child routes behind authentication.
 *
 * - 'idle'            → shows a spinner while the silent refresh runs on mount
 * - 'loading'         → spinner (login/logout in progress)
 * - 'unauthenticated' → redirects to /login (replace so back-button does not loop)
 * - 'authenticated'   → renders child routes via <Outlet />
 */
export default function ProtectedRoute() {
  const { status } = useAuth();

  if (status === 'idle' || status === 'loading') {
    return <Spinner fullPage />;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
