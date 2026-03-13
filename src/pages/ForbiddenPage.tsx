import { Link } from 'react-router-dom';

export default function ForbiddenPage() {
  return (
    <div className="page-center">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', margin: 0 }}>403</h1>
        <h2>Access denied</h2>
        <p style={{ color: '#555', marginBottom: '1.5rem' }}>
          You don't have permission to view this page.
        </p>
        <Link to="/dashboard" className="btn btn--primary">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
