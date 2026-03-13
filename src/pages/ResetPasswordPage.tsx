import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import AuthCard from '../components/auth/AuthCard';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';
import SuccessCard from '../components/ui/SuccessCard';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [success, setSuccess] = useState(false);

  const userId = searchParams.get('userId');
  const token = searchParams.get('token');

  // Missing params — the user arrived without a valid link.
  if (!userId || !token) {
    return (
      <AuthCard title="Invalid link">
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#555', marginBottom: '1.5rem' }}>
            This password reset link is missing required parameters.
          </p>
          <Link to="/forgot-password" className="btn btn--primary">
            Request a new reset link
          </Link>
        </div>
      </AuthCard>
    );
  }

  if (success) {
    return (
      <AuthCard title="Password reset">
        <SuccessCard
          title="Password updated"
          message="Your password has been reset successfully. Sign in with your new password."
          cta={<Link to="/login" className="btn btn--primary">Sign in</Link>}
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Reset password">
      <ResetPasswordForm
        onSubmit={async (newPassword) => {
          await authApi.resetPassword({
            userId,
            token,
            newPassword,
            confirmNewPassword: newPassword,
          });
          setSuccess(true);
        }}
      />
    </AuthCard>
  );
}
