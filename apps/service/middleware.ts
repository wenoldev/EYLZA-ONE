import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { corsHeaders } from './_libs/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: true, persistSession: false } }
);

export async function middleware(request: NextRequest) {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { 
      status: 204, 
      headers: {
        ...corsHeaders,
        'Content-Length': '0',
      }
    });
  }

  // Skip authentication for public routes
  const isPublicRoute =
    request.method === 'GET' &&
    (request.nextUrl.pathname.startsWith('/api/v1/products') || 
     request.nextUrl.pathname.startsWith('/api/v1/categories'));
  
  const isAuthRoute = request.nextUrl.pathname.startsWith('/api/v1/auth');

  if (isPublicRoute || isAuthRoute) {
    const response = NextResponse.next();
    // Add CORS headers to public routes
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // Validate token for protected routes
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      {
        data: {},
        error: { message: 'Unauthorized: Missing or invalid token', code: 'missing_token' },
      },
      { status: 401, headers: corsHeaders }
    );
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return NextResponse.json(
      {
        data: {},
        error: { message: 'Unauthorized: Invalid token', code: 'invalid_token' },
      },
      { status: 401, headers: corsHeaders }
    );
  }

  // Get role from user_metadata
  const role = user.user_metadata?.role;
  if (!['admin', 'vendor', 'customer'].includes(role)) {
    return NextResponse.json(
      {
        data: {},
        error: { message: 'Forbidden: Invalid role', code: 'invalid_role' },
      },
      { status: 403, headers: corsHeaders }
    );
  }

  // Pass user ID and role to downstream routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', user.id);
  requestHeaders.set('x-user-role', role);

  const response = NextResponse.next({ 
    request: {
      headers: requestHeaders,
    }
  });

  // Add CORS headers to the response
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: ['/api/v1/:path*'], // Apply to all API routes
};

export const runtime = 'experimental-edge';