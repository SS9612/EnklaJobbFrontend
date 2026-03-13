import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthCardProps {
  title: string;
  wide?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Shared card shell used by every authentication page.
 * Centralises the page-center + auth-card layout so no page duplicates it.
 */
export default function AuthCard({ title, wide, children, footer }: AuthCardProps) {
  return (
    <div className="page-center">
      <div className={`auth-card${wide ? ' auth-card--wide' : ''}`}>
        <h1 className="auth-card__title">{title}</h1>
        {children}
        {footer && <p className="auth-card__footer">{footer}</p>}
      </div>
    </div>
  );
}

/** Helper for the common "Already have an account? Sign in" footer. */
export function SignInFooter() {
  return (
    <>
      Already have an account?{' '}
      <Link to="/login" className="link">Sign in</Link>
    </>
  );
}

/** Helper for the common "Don't have an account? Create one" footer. */
export function SignUpFooter() {
  return (
    <>
      Don't have an account?{' '}
      <Link to="/register" className="link">Create one</Link>
    </>
  );
}
