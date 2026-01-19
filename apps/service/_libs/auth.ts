// app/api/_lib/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: true, persistSession: false } }
);

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-requested-with, x-store-id',
  'Access-Control-Max-Age': '86400',  // Cache preflight response for 24 hours
};

export interface AuthenticatedUser {
  id: string;
  email: string | undefined;
  role: 'admin' | 'vendor' | 'customer';
}

export async function getAuthenticatedUser(request: NextRequest): Promise<{
  user: AuthenticatedUser | null;
  response: NextResponse | null;
}> {
  // Use headers set by middleware
  const userId = request.headers.get('x-user-id');
  const role = request.headers.get('x-user-role') as 'admin' | 'vendor' | 'customer' | null;

  if (!userId || !role || !['admin', 'vendor', 'customer'].includes(role)) {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'Unauthorized: Invalid user or role' },
        { status: 401, headers: corsHeaders }
      ),
    };
  }

  return {
    user: { id: userId, email: undefined, role },
    response: null,
  };
}

export function restrictToRoles(allowedRoles: Array<'admin' | 'vendor' | 'customer'>) {
  return async (request: NextRequest) => {
    const { user, response } = await getAuthenticatedUser(request);
    if (response) return response;
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: `Forbidden: Requires ${allowedRoles.join(' or ')} role` },
        { status: 403, headers: corsHeaders }
      );
    }
    return null; // Allow the request to proceed
  };
}

// Optional: Keep verifyJWT for manual token verification if needed
export async function verifyJWT(token: string | undefined) {
  if (!token) {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401, headers: corsHeaders }
      ),
    };
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 403, headers: corsHeaders }
      ),
    };
  }

  const role = user.user_metadata?.role as 'admin' | 'vendor' | 'customer';
  if (!['admin', 'vendor', 'customer'].includes(role)) {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'Forbidden: Invalid role' },
        { status: 403, headers: corsHeaders }
      ),
    };
  }

  return { user: { id: user.id, email: user.email, role }, response: null };
}