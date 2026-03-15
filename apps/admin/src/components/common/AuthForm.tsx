/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthIntegration, useAuthStore } from '@/stores/authStore';
import { Eye, EyeOff } from 'lucide-react';

type AuthPage = 'login' | 'register' | 'forgot' | 'change';

const config: Record<AuthPage, any> = {
  login: {
    title: 'Welcome Back',
    subtitle: 'Enter your credentials to access your account',
    fields: ['email', 'password'],
    submitText: 'Sign in',
    altText: "Don't have an account?",
    altLinkText: 'Sign up',
    altLink: '/register',
    showGoogle: true,
  },
  register: {
    title: 'Create Account',
    subtitle: 'Sign up to get started with our platform',
    fields: ['name', 'email', 'password'],
    submitText: 'Create Account',
    altText: 'Already have an account?',
    altLinkText: 'Login',
    altLink: '/login',
    showGoogle: true,
  },
  forgot: {
    title: 'Reset Password',
    subtitle: 'Enter your email and we’ll send you a reset link',
    fields: ['email'],
    submitText: 'Send Reset Link',
    altText: 'Remember your password?',
    altLinkText: 'Back to Login',
    altLink: '/login',
    showGoogle: false,
  },
  change: {
    title: 'Set New Password',
    subtitle: 'Enter your new secure password',
    fields: ['newPassword'],
    submitText: 'Update Password',
    altText: 'Back to',
    altLinkText: 'Sign in',
    altLink: '/login',
    showGoogle: false,
  },
};

export const AuthForm: React.FC<{ page: AuthPage }> = ({ page }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { handleLogin, error, isLoading, clearError } = useAuthIntegration();
  const { session } = useAuthStore();

  const current = config[page];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    clearError();
    setFormError(null)
    setShowEmailConfirmation(false);

    if (page === 'login') {
      handleLogin(email, password);
      return;
    }

    // ... your existing API logic (unchanged)
    const apiUrl = import.meta.env.VITE_API_URL;
    const body: any = {
      action: page === 'register' ? 'register' : page === 'forgot' ? 'forgot-password' : 'update-password',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    };

    if (email) body.email = email;
    if (password) body.password = password;
    if (newPassword) body.new_password = newPassword;
    if (session?.access_token) body.access_token = session.access_token;
    if (page === 'register' && name) body.options.data = { full_name: name };
    if (page === 'register') body.role = 'vendor';

    fetch(`${apiUrl}/api/v1/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(async res => {
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error?.message || json.message || 'Request failed');
        }

        return json;
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then(() => {
        setShowEmailConfirmation(true);
        if (page === 'change') {
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        }
      })
      .catch(err => {
        console.error(err);
        clearError();   // reset any previous error
        setFormError(err.message || 'Request failed');
      });
  };

  const handleGoogleSignIn = async () => {
    clearError();

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/v1/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'google-login',
          role: 'vendor',
          options: { redirectTo: `${window.location.origin}/auth/callback` },
        }),
      });

      const result: { data: { url: string; provider: string }; error?: { message: string; code: string } } = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error?.message || 'Google sign-in failed');
      }

      window.location.href = result.data.url;
    } catch (err) {
      console.error(err);
    }
  };

  // const handleFacebookSignIn = async () => {
  //   clearError();

  //   try {
  //     const apiUrl = import.meta.env.VITE_API_URL;
  //     const response = await fetch(`${apiUrl}/api/v1/auth`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         action: 'facebook-login',
  //         options: { redirectTo: `${window.location.origin}/auth/callback` },
  //       }),
  //     });

  //     const result: { data: { url: string; provider: string }; error?: { message: string; code: string } } = await response.json();

  //     if (!response.ok || result.error) {
  //       throw new Error(result.error?.message || 'Facebook sign-in failed');
  //     }

  //     window.location.href = result.data.url;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <div className="min-h-screen lg:h-full w-full bg-gray-50 flex items-center justify-center px-4 py-8 lg:overflow-y-auto">
      <div className="w-full max-w-lg"> {/* ← Wider form */}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{current.title}</h1>
          {current.subtitle && (
            <p className="mt-2 text-gray-600">{current.subtitle}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name */}
          {current.fields.includes('name') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}

          {/* Email */}
          {current.fields.includes('email') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}

          {/* Password */}
          {current.fields.includes('password') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          {/* New Password */}
          {current.fields.includes('newPassword') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          {/* Remember me + Forgot password (only on login) */}
          {page === 'login' && (
            <div className="flex items-center justify-between">
              {/* <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                Remember me
              </label> */}
              <div></div>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>
          )}

          {/* Error / Success */}
          {(error || formError) && !showEmailConfirmation && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              {(formError || error)}
            </div>
          )}
          {showEmailConfirmation && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700 text-center">
              {page === 'register'
                ? 'Check your email to confirm your account.'
                : page === 'forgot'
                ? 'Check your email for password reset instructions.'
                : 'Password updated successfully! You can now sign in.'}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-50"
          >
            {isLoading ? 'Please wait...' : current.submitText}
          </button>

          {/* Divider + Social Buttons */}
          {current.showGoogle && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-50 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium text-gray-700 transition cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>

                {/* <button
                  onClick={handleFacebookSignIn}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button> */}
              </div>
            </>
          )}

          {/* Footer Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            {current.altText}{' '}
            <Link to={current.altLink} className="font-semibold text-blue-600 hover:text-blue-700">
              {current.altLinkText}
            </Link>
          </p>

          </form>
      </div>
    </div>
  );
};