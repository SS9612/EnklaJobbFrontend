import { forwardRef, useState } from 'react';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface PasswordFieldProps extends Omit<UseFormRegisterReturn, 'ref'> {
  label: string;
  id?: string;
  autoComplete?: string;
  error?: FieldError;
}

/**
 * Password input with an accessible show/hide toggle.
 * Integrates with react-hook-form via spread of register() return value.
 */
const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField({ label, id, autoComplete, error, ...registerProps }, ref) {
    const [visible, setVisible] = useState(false);
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="form-field">
        <label htmlFor={fieldId} className="form-label">{label}</label>
        <div className="password-wrapper">
          <input
            id={fieldId}
            type={visible ? 'text' : 'password'}
            autoComplete={autoComplete}
            className={`form-input password-input${error ? ' form-input--error' : ''}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            ref={ref}
            {...registerProps}
          />
          <button
            type="button"
            className="password-toggle"
            aria-label={visible ? 'Hide password' : 'Show password'}
            onClick={() => setVisible((v) => !v)}
          >
            <FontAwesomeIcon icon={visible ? faEyeSlash : faEye} />
          </button>
        </div>
        {error && (
          <span id={`${fieldId}-error`} className="form-error" role="alert">
            {error.message}
          </span>
        )}
      </div>
    );
  }
);

export default PasswordField;
