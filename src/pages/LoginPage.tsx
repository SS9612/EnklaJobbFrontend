import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, skip the login page.
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div className="page-center">
      <div className="auth-card">
        <h1 className="auth-card__title">Sign in</h1>
        <LoginForm onSuccess={() => navigate('/dashboard', { replace: true })} />
        <p className="auth-card__footer">
          Don't have an account?{' '}
          <Link to="/register" className="link">Create one</Link>
        </p>
      </div>
    </div>
  );
}
