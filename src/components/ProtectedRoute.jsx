import { Navigate, useLocation } from 'react-router-dom';

// Simple guard: checks for user token in localStorage
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
