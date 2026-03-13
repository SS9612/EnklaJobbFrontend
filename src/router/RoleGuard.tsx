import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

interface RoleGuardProps {
  /** The role (or roles) required to access the child routes. */
  requiredRoles: string | string[];
}

/**
 * Restricts child routes to users who hold at least one of the required roles.
 * Must be nested inside a <ProtectedRoute> so the user is guaranteed to be
 * authenticated before this check runs.
 *
 * Non-matching users are redirected to /forbidden rather than /login because
 * they are authenticated — just not authorized for this resource.
 */
export default function RoleGuard({ requiredRoles }: RoleGuardProps) {
  const { user } = useAuth();
  const required = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  const hasRole = user?.roles.some((r: string) => required.includes(r)) ?? false;

  if (!hasRole) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
