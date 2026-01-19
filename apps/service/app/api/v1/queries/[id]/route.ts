import { supabaseServer } from '@/_libs/supabase';
import { checkStoreAccess } from '@/_libs/store-access';
import { NextRequest, NextResponse } from 'next/server';
import { corsHeaders } from '@/_libs/auth';
import { RouteParams } from '@/types';

// Define the CustomerQuery type for better type safety
interface CustomerQuery {
  id: string;
  user_id: string;
  store_id: string;
  query_text?: string;
  status?: string;
  created_at: string;
  updated_at: string;
  users: {
    name: string;
    email: string;
  };
  stores: {
    name: string;
    slug: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    // Resolve params to get id
    const { id } = await params;

    // Get user info from headers set by middleware
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Unauthorized: Missing user ID', code: 'missing_user_id' },
        },
        { status: 401, headers: corsHeaders },
      );
    }

    const supabase = await supabaseServer();

    const { data: query, error } = await supabase
      .from('customer_queries')
      .select(
        `
        *,
        users!inner(name, email),
        stores!inner(name, slug)
      `,
      )
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json(
        {
          data: {},
          error: { message: error.message, code: 'not_found' },
        },
        { status: 404, headers: corsHeaders },
      );
    }

    // Check if user can access this query
    const canAccess = query.user_id === userId || (await checkStoreAccess(userId, query.store_id));
    if (!canAccess) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Forbidden: No access to this query', code: 'no_query_access' },
        },
        { status: 403, headers: corsHeaders },
      );
    }

    return NextResponse.json(
      {
        data: { query: query as CustomerQuery },
        error: null,
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch query',
          code: 'server_error',
        },
      },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    // Resolve params to get id
    const { id } = await params;

    // Get user info from headers set by middleware
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Unauthorized: Missing user ID', code: 'missing_user_id' },
        },
        { status: 401, headers: corsHeaders },
      );
    }

    const supabase = await supabaseServer();

    // Get query to check access
    const { data: query, error: queryError } = await supabase
      .from('customer_queries')
      .select('store_id, user_id')
      .eq('id', id)
      .single();

    if (queryError) {
      return NextResponse.json(
        {
          data: {},
          error: { message: queryError.message, code: 'query_not_found' },
        },
        { status: 404, headers: corsHeaders },
      );
    }

    // Only query owner or store managers can delete
    const hasStoreAccess = await checkStoreAccess(userId, query.store_id, ['owner', 'manager']);
    if (query.user_id !== userId && !hasStoreAccess) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Forbidden: Owner/manager access required', code: 'insufficient_permissions' },
        },
        { status: 403, headers: corsHeaders },
      );
    }

    const { error } = await supabase
      .from('customer_queries')
      .delete()
      .eq('id', id);

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
        data: { message: 'Query deleted successfully' },
        error: null,
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error instanceof Error ? error.message : 'Failed to delete query',
          code: 'server_error',
        },
      },
      { status: 500, headers: corsHeaders },
    );
  }
}