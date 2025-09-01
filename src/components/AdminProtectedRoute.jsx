import { Navigate, useLocation } from 'react-router-dom';

// Admin-only guard: checks for adminToken in localStorage
export default function AdminProtectedRoute({ children }) {
  const location = useLocation();
  const adminToken = localStorage.getItem('adminToken');
  if (!adminToken) {
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    );
  }
  return children;
}
