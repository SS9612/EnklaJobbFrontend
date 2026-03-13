import { useState } from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
  const [registered, setRegistered] = useState(false);

  if (registered) {
    return (
      <div className="page-center">
        <div className="auth-card auth-card--wide">
          <h1 className="auth-card__title">Check your email</h1>
          <p style={{ textAlign: 'center', color: '#555', marginBottom: '1.5rem' }}>
            Your account has been created. Please verify your email before signing in.
          </p>
          <Link to="/login" className="btn btn--primary" style={{ display: 'block', textAlign: 'center' }}>
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-center">
      <div className="auth-card auth-card--wide">
        <h1 className="auth-card__title">Create account</h1>
        <RegisterForm onSuccess={() => setRegistered(true)} />
        <p className="auth-card__footer">
          Already have an account?{' '}
          <Link to="/login" className="link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
