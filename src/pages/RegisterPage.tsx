import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthCard, { SignInFooter } from '../components/auth/AuthCard';
import RegisterForm from '../components/auth/RegisterForm';
import SuccessCard from '../components/ui/SuccessCard';

export default function RegisterPage() {
  const [registered, setRegistered] = useState(false);

  if (registered) {
    return (
      <AuthCard title="Check your email" wide>
        <SuccessCard
          title="Account created!"
          message="We've sent a confirmation link to your email address. Click it to activate your account before signing in."
          cta={<Link to="/login" className="btn btn--primary">Go to sign in</Link>}
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Create account" wide footer={<SignInFooter />}>
      <RegisterForm onSuccess={() => setRegistered(true)} />
    </AuthCard>
  );
}
