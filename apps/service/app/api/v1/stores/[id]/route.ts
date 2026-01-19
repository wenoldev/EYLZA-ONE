/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { checkStoreAccess } from '@/_libs/store-access'
import { corsHeaders } from '@/_libs/auth'

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await supabaseServer()
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json(
        {
          data: {},
          error: { message: error.message, code: 'not_found' }
        },
        { status: 404, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      {
        data: { store: data },
        error: null
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || 'Failed to fetch store',
          code: 'server_error'
        }
      },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    // Get user info from headers set by middleware
    const userId = req.headers.get('x-user-id')
    // const userRole = req.headers.get('x-user-role')

    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Unauthorized: Missing user ID', code: 'missing_user_id' }
        },
        { status: 401, headers: corsHeaders }
      )
    }

    // Check if user has owner/manager access to this store
    const hasAccess = await checkStoreAccess(userId, id, ['owner', 'manager'])
    if (!hasAccess) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Forbidden: Owner/manager access required', code: 'insufficient_permissions' }
        },
        { status: 403, headers: corsHeaders }
      )
    }

    const supabase = await supabaseServer()
    const body = await req.json()

    // Input validation
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'No update data provided', code: 'invalid_input' }
        },
        { status: 400, headers: corsHeaders }
      )
    }

    const { data, error } = await supabase
      .from('stores')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        {
          data: {},
          error: { message: error.message, code: 'database_error' }
        },
        { status: 500, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      {
        data: { store: data },
        error: null
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || 'Failed to update store',
          code: 'server_error'
        }
      },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    // Get user info from headers set by middleware
    const userId = req.headers.get('x-user-id')
    // const userRole = req.headers.get('x-user-role')

    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Unauthorized: Missing user ID', code: 'missing_user_id' }
        },
        { status: 401, headers: corsHeaders }
      )
    }

    // Check if user has owner access to this store
    const hasAccess = await checkStoreAccess(userId, id, ['owner'])
    if (!hasAccess) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Forbidden: Owner access required', code: 'owner_access_required' }
        },
        { status: 403, headers: corsHeaders }
      )
    }

    const supabase = await supabaseServer()

    const { error } = await supabase
      .from('stores')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        {
          data: {},
          error: { message: error.message, code: 'database_error' }
        },
        { status: 500, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      {
        data: { message: 'Store deleted successfully' },
        error: null
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || 'Failed to delete store',
          code: 'server_error'
        }
      },
      { status: 500, headers: corsHeaders }
    )
  }
}