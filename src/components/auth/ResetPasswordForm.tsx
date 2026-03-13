import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PasswordField from '../ui/PasswordField';

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(12, 'Password must be at least 12 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one digit')
      .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character'),
    confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  onSubmit: (newPassword: string) => Promise<void>;
}

export default function ResetPasswordForm({ onSubmit }: ResetPasswordFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

  const submit = async (values: ResetPasswordFormValues) => {
    setServerError(null);
    try {
      await onSubmit(values.newPassword);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { title?: string } } })?.response?.data?.title ??
        'The reset link is invalid or has expired.';
      setServerError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="auth-form">
      <PasswordField
        label="New password"
        autoComplete="new-password"
        error={errors.newPassword}
        {...register('newPassword')}
      />
      <PasswordField
        label="Confirm new password"
        autoComplete="new-password"
        error={errors.confirmNewPassword}
        {...register('confirmNewPassword')}
      />

      {serverError && (
        <p className="form-server-error" role="alert">{serverError}</p>
      )}

      <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
        {isSubmitting ? 'Resetting…' : 'Reset password'}
      </button>
    </form>
  );
}
