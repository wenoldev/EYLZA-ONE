import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth';
import { supabaseServer } from '@/_libs/supabase';

export async function POST(request: NextRequest) {
  const supabase = await supabaseServer()
  try {
    const { refresh_token } = await request.json();
    console.log("Received refresh token:", refresh_token);

    if (!refresh_token) {
      return NextResponse.json(
        {
          data: {},
          error: {
            message: "Refresh token is required",
            code: "invalid_input"
          }
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Get new session from Supabase
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token
    });
    console.log("Supabase refresh response:", { data, error });
    if (error || !data?.session) {
      return NextResponse.json(
        {
          data: {},
          error: {
            message: "Invalid refresh token",
            code: "invalid_refresh"
          }
        },
        { status: 401, headers: corsHeaders }
      );
    }

    const { session, user } = data;

    // Fetch role from user_metadata
    const userRole = (user?.user_metadata?.role || null) as
      | "admin"
      | "vendor"
      | "customer"
      | null;

    return NextResponse.json(
      {
        data: {
          user: {
            id: user?.id,
            email: user?.email,
            user_metadata: user?.user_metadata
          },
          session: {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_at: session.expires_at
          },
          role: userRole
        },
        error: null
      },
      { headers: corsHeaders }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Refresh error:", err);
    return NextResponse.json(
      {
        data: {},
        error: {
          message: err?.message || "Unexpected error",
          code: err?.code || "unknown_error"
        }
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
