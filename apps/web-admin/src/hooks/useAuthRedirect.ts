import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthGuard } from '@/stores/authStore';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role } = useAuthGuard();

  useEffect(() => {
    if (isAuthenticated && role) {
      // Check if we have a redirect path from the location state
      const from = location.state?.from?.pathname;
      
      if (from && from !== '/login') {
        navigate(from, { replace: true });
      } else {
        // Default redirects based on role
        if (role === 'admin') {
          navigate('/', { replace: true });
        } else if (role === 'vendor') {
          navigate('/', { replace: true });
        }
      }
    }
  }, [isAuthenticated, role, navigate, location]);
};
