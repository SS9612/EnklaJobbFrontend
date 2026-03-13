import type { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

interface SuccessCardProps {
  title: string;
  message: string;
  cta: ReactNode;
}

/**
 * Full-page success state shown after confirm-email, reset-password, etc.
 * Renders inside the auth-card shell — wrap in <AuthCard> if needed, or
 * use standalone when replacing an entire page.
 */
export default function SuccessCard({ title, message, cta }: SuccessCardProps) {
  return (
    <div className="success-card">
      <div className="success-card__icon" aria-hidden="true">
        <FontAwesomeIcon icon={faCircleCheck} />
      </div>
      <h2 className="success-card__title">{title}</h2>
      <p className="success-card__message">{message}</p>
      <div className="success-card__cta">{cta}</div>
    </div>
  );
}
