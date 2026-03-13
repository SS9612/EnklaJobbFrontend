import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import AuthCard from '../components/auth/AuthCard';
import EmailOnlyForm from '../components/auth/EmailOnlyForm';
import SuccessCard from '../components/ui/SuccessCard';

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  if (sentTo) {
    return (
      <AuthCard title="Check your email">
        <SuccessCard
          title="Reset link sent"
          message={`If ${sentTo} is registered, a password reset link has been sent. Check your inbox and follow the instructions.`}
          cta={<Link to="/login" className="btn btn--secondary">Back to sign in</Link>}
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot password"
      footer={
        <>
          Remembered it?{' '}
          <Link to="/login" className="link">Sign in</Link>
        </>
      }
    >
      <p style={{ color: '#555', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
        Enter your email address and we'll send you a link to reset your password.
      </p>
      <EmailOnlyForm
        submitLabel="Send reset link"
        submittingLabel="Sending…"
        onSubmit={(email) => authApi.forgotPassword({ email }).then(() => undefined)}
        onSuccess={(email) => setSentTo(email)}
      />
    </AuthCard>
  );
}
