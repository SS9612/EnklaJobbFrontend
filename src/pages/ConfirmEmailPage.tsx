import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import AuthCard from '../components/auth/AuthCard';
import SuccessCard from '../components/ui/SuccessCard';
import Spinner from '../components/ui/Spinner';

type ConfirmState = 'confirming' | 'success' | 'error' | 'invalid';

export default function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<ConfirmState>('confirming');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    if (!userId || !token) {
      setState('invalid');
      return;
    }

    let cancelled = false;

    authApi
      .confirmEmail({ userId, token })
      .then(() => {
        if (!cancelled) setState('success');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const msg =
          (err as { response?: { data?: { title?: string } } })?.response?.data?.title ??
          'The confirmation link is invalid or has expired.';
        setErrorMessage(msg);
        setState('error');
      });

    return () => { cancelled = true; };
  }, [searchParams]);

  if (state === 'confirming') {
    return (
      <AuthCard title="Confirming your email…">
        <Spinner />
      </AuthCard>
    );
  }

  if (state === 'success') {
    return (
      <AuthCard title="Email confirmed">
        <SuccessCard
          title="You're all set!"
          message="Your email address has been verified. You can now sign in to your account."
          cta={<Link to="/login" className="btn btn--primary">Sign in</Link>}
        />
      </AuthCard>
    );
  }

  if (state === 'invalid') {
    return (
      <AuthCard title="Invalid link">
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#555', marginBottom: '1.5rem' }}>
            This confirmation link is missing required parameters.
          </p>
          <Link to="/login" className="btn btn--secondary">Back to sign in</Link>
        </div>
      </AuthCard>
    );
  }

  // error state
  return (
    <AuthCard title="Confirmation failed">
      <div style={{ textAlign: 'center' }}>
        <p className="form-server-error" role="alert" style={{ marginBottom: '1.5rem' }}>
          {errorMessage}
        </p>
        <p style={{ color: '#555', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Confirmation links expire after 24 hours.
        </p>
        <Link to="/resend-confirmation" className="btn btn--primary">
          Request a new confirmation email
        </Link>
      </div>
    </AuthCard>
  );
}
