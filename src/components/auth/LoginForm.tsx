import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../auth/useAuth';
import FormField from '../ui/FormField';
import PasswordField from '../ui/PasswordField';
import type { ApiErrorResponse, LoginRequestDto } from '../../types/auth.types';

const loginSchema = z.object({
  email: z.string().email('A valid email address is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setEmailNotConfirmed(false);
    try {
      await login(values as LoginRequestDto);
      onSuccess?.();
    } catch (err: unknown) {
      const data = (err as { response?: { data?: ApiErrorResponse } })?.response?.data;

      // Detect the machine-readable error code so we can show a targeted resend link
      // rather than just a generic error message.
      if (data?.errorCode === 'EMAIL_NOT_CONFIRMED') {
        setEmailNotConfirmed(true);
        setServerError(data.title ?? 'Account not yet confirmed. Please verify your email.');
        return;
      }

      setServerError(data?.title ?? 'Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="auth-form">
      <FormField
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email}
        {...register('email')}
      />
      <PasswordField
        label="Password"
        autoComplete="current-password"
        error={errors.password}
        {...register('password')}
      />

      <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
        <Link to="/forgot-password" className="link" style={{ fontSize: '0.875rem' }}>
          Forgot password?
        </Link>
      </div>

      {serverError && (
        <div>
          <p className="form-server-error" role="alert">{serverError}</p>
          {emailNotConfirmed && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', textAlign: 'center' }}>
              <Link to="/resend-confirmation" className="link">
                Resend confirmation email
              </Link>
            </p>
          )}
        </div>
      )}

      <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
