import { Navigate, useLocation } from 'react-router-dom';
import { useAuthGuard } from '@/stores/authStore';
import Loader from '@/components/common/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'vendor')[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['admin', 'vendor'],
  redirectTo = '/login'
}) => {
  const { isAuthenticated, isLoading, role } = useAuthGuard();
  const location = useLocation();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};