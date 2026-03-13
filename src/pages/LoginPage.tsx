import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import AuthCard, { SignUpFooter } from '../components/auth/AuthCard';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <AuthCard title="Sign in" footer={<SignUpFooter />}>
      <LoginForm onSuccess={() => navigate('/dashboard', { replace: true })} />
    </AuthCard>
  );
}
