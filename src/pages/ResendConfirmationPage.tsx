import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import AuthCard from '../components/auth/AuthCard';
import EmailOnlyForm from '../components/auth/EmailOnlyForm';
import SuccessCard from '../components/ui/SuccessCard';

export default function ResendConfirmationPage() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <AuthCard title="Email sent">
        <SuccessCard
          title="Check your inbox"
          message="If that address is registered and unconfirmed, a new confirmation link has been sent."
          cta={<Link to="/login" className="btn btn--secondary">Back to sign in</Link>}
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Resend confirmation"
      footer={
        <>
          Already confirmed?{' '}
          <Link to="/login" className="link">Sign in</Link>
        </>
      }
    >
      <p style={{ color: '#555', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
        Enter your email address and we'll send you a new confirmation link.
      </p>
      <EmailOnlyForm
        submitLabel="Send confirmation email"
        submittingLabel="Sending…"
        onSubmit={(email) => authApi.resendConfirmation({ email }).then(() => undefined)}
        onSuccess={() => setSent(true)}
      />
    </AuthCard>
  );
}
