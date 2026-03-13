import type { InputHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

export default function FormField({ label, error, id, ...props }: FormFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="form-field">
      <label htmlFor={fieldId} className="form-label">
        {label}
      </label>
      <input
        id={fieldId}
        className={`form-input${error ? ' form-input--error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${fieldId}-error`} className="form-error" role="alert">
          {error.message}
        </span>
      )}
    </div>
  );
}
