/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import NodeCache from 'node-cache';
import { corsHeaders, verifyJWT } from '@/_libs/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: true, persistSession: false } }
);

const cache = new NodeCache({ stdTTL: 600 }); // 10-minute cache for user roles

type AuthAction = 'login' | 'register' | 'logout' | 'forgot-password' | 'update-password' | 'resend-confirmation' | 'google-login' | 'facebook-login';

type AuthRequest = {
  action: AuthAction;
  email?: string;
  password?: string;
  new_password?: string;
  refresh_token?: string;
  role?: 'admin' | 'vendor' | 'customer';
  options?: {
    redirectTo?: string;
    data?: Record<string, any>;
  };
};

const allowedRedirectDomains = [
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.NEXT_PUBLIC_DASHBOARD_URL,
  "http://localhost:3001"
].filter(Boolean);

const validateRedirectUrl = (url?: string): boolean => {
  if (!url) return false;
  try {
    const parsedUrl = new URL(url);
    return allowedRedirectDomains.some((domain) => parsedUrl.origin === domain);
  } catch {
    return false;
  }
};

export async function POST(request: NextRequest) {
  const { action, email, password, new_password, refresh_token, role, options }: AuthRequest = await request.json();

  // Input validation
  if (['login', 'register'].includes(action) && (!email || !password)) {
    return NextResponse.json(
      { data: {}, error: { message: 'Email and password are required', code: 'invalid_input' } },
      { status: 400, headers: corsHeaders }
    );
  }

  if (action === 'register' && role === 'admin') {
    return NextResponse.json(
      { data: {}, error: { message: 'Admin registration not allowed', code: 'invalid_role' } },
      { status: 400, headers: corsHeaders }
    );
  }

  // if (['login', 'register'].includes(action) && !['admin', 'vendor', 'customer'].includes(role || '')) {
  //   return NextResponse.json(
  //     { data: {}, error: { message: 'Invalid role', code: 'invalid_role' } },
  //     { status: 400, headers: corsHeaders }
  //   );
  // }

  if (action === 'forgot-password' && !email) {
    return NextResponse.json(
      { data: {}, error: { message: 'Email is required', code: 'invalid_input' } },
      { status: 400, headers: corsHeaders }
    );
  }

  if (action === 'update-password' && !new_password) {
    return NextResponse.json(
      { data: {}, error: { message: 'New password is required', code: 'invalid_input' } },
      { status: 400, headers: corsHeaders }
    );
  }

  // Password strength validation
  if (
    ['register', 'update-password'].includes(action) &&
    ((typeof password === 'string' && password.length < 8) ||
      (typeof new_password === 'string' && new_password.length < 8))
  ) {
    return NextResponse.json(
      { data: {}, error: { message: 'Password must be at least 8 characters', code: 'invalid_password' } },
      { status: 400, headers: corsHeaders }
    );
  }

  // Redirect URL validation
  if (options?.redirectTo && !validateRedirectUrl(options.redirectTo)) {
    return NextResponse.json(
      { data: {}, error: { message: 'Invalid redirect URL', code: 'invalid_redirect' } },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    switch (action) {
      case 'login': {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email!, password: password! });
        if (error) throw error;

        // Check role from users table or cache
        const cacheKey = `user_role_${data.user.id}`;
        let userRole = cache.get(cacheKey) as 'admin' | 'vendor' | 'customer' | undefined;

        if (!userRole) {
          const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('role')
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            await supabase.auth.signOut();
            return NextResponse.json(
              { data: {}, error: { message: 'Invalid role for user', code: 'invalid_role' } },
              { status: 403, headers: corsHeaders }
            );
          }
          userRole = userProfile.role;
          cache.set(cacheKey, userRole);
        }

        return NextResponse.json(
          {
            data: {
              user: { id: data.user.id, email: data.user.email },
              session: {
                access_token: data.session?.access_token,
                refresh_token: data.session?.refresh_token,
                expires_at: data.session?.expires_at,
              },
              role: userRole,
            },
            error: null,
          },
          { headers: corsHeaders }
        );
      }

      case 'google-login': {
        let redirectTo = options?.redirectTo || `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;
        const redirectUrl = new URL(redirectTo, process.env.NEXT_PUBLIC_SITE_URL);
        console.log("Adding role to redirect URL:", role);
        if (role) {

          redirectUrl.searchParams.set('role', role);
        }
        redirectTo = redirectUrl.toString();
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo,
            queryParams: {
              access_type: 'offline', // to get refresh_token
              prompt: 'consent',
            },
          },
        });

        if (error) throw error;

        return NextResponse.json(
          {
            data: {
              url: data.url,
              provider: 'google',
            },
            error: null,
          },
          { headers: corsHeaders }
        );
      }

      case 'facebook-login': {
        const redirectTo = options?.redirectTo || `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'facebook',
          options: {
            redirectTo,
            queryParams: {
              access_type: 'offline', // to get refresh_token
              prompt: 'consent',
            },
          },
        });
        if (error) throw error;

        return NextResponse.json(
          {
            data: {
              url: data.url,
              provider: 'facebook',
            },
            error: null,
          },
          { headers: corsHeaders }
        );
      }

      case 'register': {
        const { data, error } = await supabase.auth.signUp({
          email: email!,
          password: password!,
          options: {
            emailRedirectTo: options?.redirectTo || `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
            data: { role, ...options?.data },
          },
        });
        if (error) throw error;

        return NextResponse.json(
          {
            data: {
              user: { id: data.user?.id, email: data.user?.email },
              session: data.session
                ? {
                  access_token: data.session.access_token,
                  refresh_token: data.session.refresh_token,
                  expires_at: data.session.expires_at,
                }
                : null,
              role,
            },
            error: null,
          },
          { headers: corsHeaders }
        );
      }

      case 'resend-confirmation': {
        const { data, error } = await supabase.auth.resend({
          type: 'signup',
          email: email!,
          options: {
            emailRedirectTo: options?.redirectTo || `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
          },
        });
        if (error) throw error;

        return NextResponse.json(
          {
            data: {
              message: 'Confirmation email resent',
              email: data.user,
            },
            error: null,
          },
          { headers: corsHeaders }
        );
      }

      case 'forgot-password': {
        const { error } = await supabase.auth.resetPasswordForEmail(email!, {
          redirectTo: options?.redirectTo || `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`,
        });
        if (error) throw error;

        return NextResponse.json(
          {
            data: { message: 'Password reset link sent' },
            error: null,
          },
          { headers: corsHeaders }
        );
      }

      case 'update-password': {
        // Verify token if provided
        let user;
        if (refresh_token) {
          const { user: verifiedUser, response } = await verifyJWT(refresh_token);
          if (response) {
            return NextResponse.json(
              { data: {}, error: { message: 'Invalid refresh token', code: 'invalid_token' } },
              { status: 401, headers: corsHeaders }
            );
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          user = verifiedUser;
        }

        const { data, error } = await supabase.auth.updateUser(
          { password: new_password! },
          { emailRedirectTo: options?.redirectTo || '' }
        );
        if (error) throw error;

        return NextResponse.json(
          {
            data: {
              message: 'Password updated',
              user: { id: data.user?.id, email: data.user?.email },
            },
            error: null,
          },
          { headers: corsHeaders }
        );
      }

      case 'logout': {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return NextResponse.json(
          { data: { message: 'Logged out' }, error: null },
          { headers: corsHeaders }
        );
      }

      default:
        return NextResponse.json(
          { data: {}, error: { message: 'Invalid action', code: 'invalid_action' } },
          { status: 400, headers: corsHeaders }
        );
    }
  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || 'An unexpected error occurred',
          code: error.code || 'unknown_error',
        },
      },
      { status: error.status || 500, headers: corsHeaders }
    );
  }
}
