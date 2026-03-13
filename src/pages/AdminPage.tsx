import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import type { UserProfileResponseDto } from '../types/auth.types';

export default function AdminPage() {
  const navigate = useNavigate();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => api.get<UserProfileResponseDto[]>('/api/admin/users').then((r) => r.data),
  });

  return (
    <div className="page">
      <header className="page-header">
        <h1>Admin</h1>
        <button className="btn btn--secondary" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
      </header>

      <main className="page-main">
        <div className="card">
          <h2>All users</h2>
          {isLoading && <p>Loading…</p>}
          {error && <p className="form-server-error">Failed to load users.</p>}
          {users && (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Date of birth</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.firstName} {u.lastName}</td>
                    <td>{u.email}</td>
                    <td>{u.roles.join(', ')}</td>
                    <td>{u.dateOfBirth}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
