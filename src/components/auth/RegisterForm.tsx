import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../auth/useAuth';
import FormField from '../ui/FormField';
import DateOfBirthPicker from '../ui/DateOfBirthPicker';
import { REGISTERABLE_ROLES, type UserRole } from '../../types/auth.types';

// ── Zod schema — mirrors backend RegisterRequestValidator ─────────────────────
const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    email: z.string().email('A valid email address is required'),
    password: z
      .string()
      .min(12, 'Password must be at least 12 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one digit')
      .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    dateOfBirth: z
      .string()
      .min(1, 'Date of birth is required')
      .refine((v) => new Date(v) < new Date(), { message: 'Date of birth must be in the past' })
      .refine((v) => new Date(v) >= new Date('1900-01-01'), { message: 'Date of birth is not valid' }),
    role: z.enum(['Ungdom', 'Vårdnadshavare', 'Rekryterare'] as const, {
      error: 'Please select a role',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    try {
      await registerUser({ ...values, role: values.role as UserRole });
      onSuccess?.();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { title?: string } } })?.response?.data?.title ??
        'Registration failed. Please try again.';
      setServerError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="auth-form">
      <FormField
        label="First name"
        type="text"
        autoComplete="given-name"
        error={errors.firstName}
        {...register('firstName')}
      />
      <FormField
        label="Last name"
        type="text"
        autoComplete="family-name"
        error={errors.lastName}
        {...register('lastName')}
      />

      <FormField
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email}
        {...register('email')}
      />

      {/* DOB uses Controller so the three-select picker can manage its own state
          while still being driven by react-hook-form's value / validation. */}
      <Controller
        name="dateOfBirth"
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <DateOfBirthPicker
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error}
          />
        )}
      />

      <div className="form-field">
        <label htmlFor="role" className="form-label">Role</label>
        <select
          id="role"
          className={`form-input${errors.role ? ' form-input--error' : ''}`}
          {...register('role')}
        >
          <option value="">— Select a role —</option>
          {REGISTERABLE_ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        {errors.role && (
          <span className="form-error" role="alert">{errors.role.message}</span>
        )}
      </div>

      <FormField
        label="Password"
        type="password"
        autoComplete="new-password"
        error={errors.password}
        {...register('password')}
      />
      <FormField
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword}
        {...register('confirmPassword')}
      />

      {serverError && (
        <p className="form-server-error" role="alert">{serverError}</p>
      )}

      <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
}
