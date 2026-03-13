import { Link } from 'react-router-dom';
import AuthCard from '../components/auth/AuthCard';

export default function ForbiddenPage() {
  return (
    <AuthCard title="403">
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ marginTop: 0 }}>Access denied</h2>
        <p style={{ color: '#555', marginBottom: '1.5rem' }}>
          You don't have permission to view this page.
        </p>
        <Link to="/dashboard" className="btn btn--primary">
          Back to dashboard
        </Link>
      </div>
    </AuthCard>
  );
}
