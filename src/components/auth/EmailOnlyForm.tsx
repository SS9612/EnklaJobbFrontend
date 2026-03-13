import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormField from '../ui/FormField';

const schema = z.object({
  email: z.string().email('A valid email address is required'),
});

type EmailFormValues = z.infer<typeof schema>;

interface EmailOnlyFormProps {
  submitLabel: string;
  submittingLabel?: string;
  /** Called with the email value on submit; should throw on server error. */
  onSubmit: (email: string) => Promise<void>;
  onSuccess: (email: string) => void;
}

/**
 * Single email input + submit button.
 * Shared by ForgotPasswordForm and ResendConfirmationForm.
 */
export default function EmailOnlyForm({
  submitLabel,
  submittingLabel,
  onSubmit,
  onSuccess,
}: EmailOnlyFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormValues>({ resolver: zodResolver(schema) });

  const submit = async (values: EmailFormValues) => {
    setServerError(null);
    try {
      await onSubmit(values.email);
      onSuccess(values.email);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { title?: string } } })?.response?.data?.title ??
        'Something went wrong. Please try again.';
      setServerError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="auth-form">
      <FormField
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email}
        {...register('email')}
      />

      {serverError && (
        <p className="form-server-error" role="alert">{serverError}</p>
      )}

      <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
        {isSubmitting ? (submittingLabel ?? 'Sending…') : submitLabel}
      </button>
    </form>
  );
}
