import { Link } from 'react-router-dom';
import { useAuthGuard } from '@/stores/authStore';

export const Unauthorized = () => {
  const { isAuthenticated, role } = useAuthGuard();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          
          <p className="text-gray-600 mb-6">
            {!isAuthenticated 
              ? "You need to be logged in to access this page."
              : `You don't have permission to access this page. Your current role: ${role}`
            }
          </p>
          
          <div className="space-y-3">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                Go to Login
              </Link>
            ) : (
              <>
                <Link
                  to={role === 'admin' ? '/admin/dashboard' : '/'}
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Go to Home
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};