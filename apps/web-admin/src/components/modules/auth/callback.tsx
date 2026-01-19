import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface ErrorState {
  error: string;
  errorCode: string;
  errorDescription: string;
}

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { initializeAuth, role, isAuthenticated } = useAuthStore();
  const [error, setError] = useState<ErrorState | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Parse query parameters from URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));

        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const error = hashParams.get('error');
        const errorCode = hashParams.get('error_code');
        const errorDescription = hashParams.get('error_description');
        const role = searchParams.get('role');
        // Handle error case
        if (error && errorCode && errorDescription) {
          setError({
            error,
            errorCode,
            errorDescription: decodeURIComponent(errorDescription),
          });
          navigate(`/login?error=${encodeURIComponent(error)}`);
          return;
        }

        // Handle token-based authentication
        if (accessToken && refreshToken) {
          const apiUrl = import.meta.env.VITE_API_URL;
          const response = await fetch(`${apiUrl}/api/v1/auth/user`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            let userRole = userData.user.user_metadata?.role || userData.role;
            if (!userRole && role) {
              // Call backend to set role
              const setRoleResponse = await fetch(`${apiUrl}/api/v1/auth/user`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ role: role }),
              });

              if (!setRoleResponse.ok) {
                console.warn("Failed to set role");
              } else {
                userRole = role; // update local role
              }
            }
            useAuthStore.setState({
              user: userData.user,
              session: {
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
              },
              role: userData.user.user_metadata?.role || userData.role,
              isAuthenticated: true,
            });
          } else {
            throw new Error('Failed to fetch user data');
          }
        }

        // Initialize auth state from storage
        await initializeAuth();

        // Redirect based on role after a short delay
        setTimeout(() => {
          if (isAuthenticated && role) {
            if (role === 'admin') {
              navigate('/admin/dashboard');
            } else if (role === 'vendor') {
              navigate('/');
            } else {
              navigate('/login');
            }
          } else {
            navigate('/');
          }
        }, 2000);
      } catch (err) {
        console.error('Callback error:', err);
        setError({
          error: 'callback_failed',
          errorCode: '500',
          errorDescription: 'An error occurred during authentication',
        });
        navigate('/login?error=callback_failed');
      }
    };

    handleCallback();
  }, [searchParams, navigate, initializeAuth, role, isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error ? (
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Authentication Failed
              </h1>
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm">
                  {error.errorDescription} (Error Code: {error.errorCode})
                </p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Authentication Successful
              </h1>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-green-600 text-sm">
                  You have been successfully authenticated. Redirecting to dashboard...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};