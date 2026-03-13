import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../auth/useAuth';
import FormField from '../ui/FormField';
import type { LoginRequestDto } from '../../types/auth.types';

// ── Zod schema — mirrors backend LoginRequestValidator ────────────────────────
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      await login(values as LoginRequestDto);
      onSuccess?.();
    } catch (err: unknown) {
      // Extract the backend ProblemDetails title or fall back to a generic message.
      const msg =
        (err as { response?: { data?: { title?: string } } })?.response?.data?.title ??
        'Login failed. Please check your credentials.';
      setServerError(msg);
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
      <FormField
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password}
        {...register('password')}
      />

      {serverError && (
        <p className="form-server-error" role="alert">
          {serverError}
        </p>
      )}

      <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
