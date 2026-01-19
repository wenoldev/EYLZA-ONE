/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { corsHeaders } from '@/_libs/auth';
import { RouteParams } from '@/types';

// Define the User type for better type safety
interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Define allowed fields for updates to prevent unwanted fields
const ALLOWED_UPDATE_FIELDS = ['name', 'phone', 'role', 'status'];

// Helper function to filter update body
function filterUpdateBody(body: Record<string, any>, isAdmin: boolean): Record<string, any> {
  const filteredBody: Record<string, any> = {};
  for (const key of ALLOWED_UPDATE_FIELDS) {
    if (body[key] !== undefined) {
      // Only allow role/status updates for admins
      if (['role', 'status'].includes(key) && !isAdmin) {
        continue;
      }
      filteredBody[key] = body[key];
    }
  }
  return filteredBody;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    // Resolve params to get id
    const { id } = await params;

    // Get user info from headers set by middleware
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');

    if (!userId) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Unauthorized: Missing user ID', code: 'missing_user_id' },
        },
        { status: 401, headers: corsHeaders },
      );
    }

    // Users can only view their own profile unless they're admin
    if (userId !== id && userRole !== 'admin') {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Forbidden: Admin access required', code: 'admin_access_required' },
        },
        { status: 403, headers: corsHeaders },
      );
    }

    const supabase = await supabaseServer();
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, phone, role, status, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json(
        {
          data: {},
          error: { message: error.message, code: 'user_not_found' },
        },
        { status: 404, headers: corsHeaders },
      );
    }

    return NextResponse.json(
      {
        data: { user: data as User },
        error: null,
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch user',
          code: 'server_error',
        },
      },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    // Resolve params to get id
    const { id } = await params;

    // Get user info from headers set by middleware
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');

    if (!userId) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Unauthorized: Missing user ID', code: 'missing_user_id' },
        },
        { status: 401, headers: corsHeaders },
      );
    }

    // Users can only update their own profile unless they're admin
    if (userId !== id && userRole !== 'admin') {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Forbidden: Admin access required', code: 'admin_access_required' },
        },
        { status: 403, headers: corsHeaders },
      );
    }

    const body = await req.json();

    // Input validation
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'No update data provided', code: 'invalid_input' },
        },
        { status: 400, headers: corsHeaders },
      );
    }

    // Filter update body to only allow specific fields
    const isAdmin = userRole === 'admin';
    const updateData = filterUpdateBody(body, isAdmin);

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'No valid update fields provided', code: 'invalid_input' },
        },
        { status: 400, headers: corsHeaders },
      );
    }

    const supabase = await supabaseServer();
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, email, name, phone, role, status, created_at, updated_at')
      .single();

    if (error) {
      return NextResponse.json(
        {
          data: {},
          error: { message: error.message, code: 'database_error' },
        },
        { status: 500, headers: corsHeaders },
      );
    }

    return NextResponse.json(
      {
        data: { user: data as User },
        error: null,
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error instanceof Error ? error.message : 'Failed to update user',
          code: 'server_error',
        },
      },
      { status: 500, headers: corsHeaders },
    );
  }
}