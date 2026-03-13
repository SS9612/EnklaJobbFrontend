import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const isAdmin = user?.roles.includes('Admin') ?? false;

  return (
    <div className="page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <button className="btn btn--secondary" onClick={handleLogout}>
          Sign out
        </button>
      </header>

      <main className="page-main">
        <div className="card">
          <h2>Welcome, {user?.firstName} {user?.lastName}</h2>
          <dl className="user-details">
            <dt>Email</dt>
            <dd>{user?.email}</dd>
            <dt>Date of birth</dt>
            <dd>{user?.dateOfBirth}</dd>
            <dt>Role{(user?.roles.length ?? 0) > 1 ? 's' : ''}</dt>
            <dd>{user?.roles.join(', ')}</dd>
            <dt>Account created</dt>
            <dd>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</dd>
            <dt>Last login</dt>
            <dd>{user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '—'}</dd>
          </dl>
        </div>

        {isAdmin && (
          <div className="card card--admin">
            <h3>Admin panel</h3>
            <p>You have the Admin role.</p>
            <button className="btn btn--primary" onClick={() => navigate('/admin')}>
              Go to Admin
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
