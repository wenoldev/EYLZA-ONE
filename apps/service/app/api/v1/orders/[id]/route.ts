/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { checkStoreAccess } from '@/_libs/store-access'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'
import { RouteParams } from '@/types'


export async function GET(req: NextRequest, { params }: RouteParams) {
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

    const supabase = await supabaseServer()

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        users!inner(name, email),
        stores!inner(name, slug),
        order_items!inner(*)
      `)
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

    // Check if user can access this order
    const canAccess = order.user_id === userId || await checkStoreAccess(userId, order.store_id)
    if (!canAccess) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Forbidden: No access to this order', code: 'no_order_access' }
        },
        { status: 403, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      {
        data: { order },
        error: null
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || 'Failed to fetch order',
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

    const supabase = await supabaseServer()

    // Get order to check access
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('store_id, user_id, status')
      .eq('id', id)
      .single()

    if (orderError) {
      return NextResponse.json(
        {
          data: {},
          error: { message: orderError.message, code: 'order_not_found' }
        },
        { status: 404, headers: corsHeaders }
      )
    }

    // Only store owners/managers can update orders
    const hasAccess = await checkStoreAccess(userId, order.store_id, ['owner', 'manager'])
    if (!hasAccess) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Forbidden: Owner/manager access required', code: 'insufficient_permissions' }
        },
        { status: 403, headers: corsHeaders }
      )
    }

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

    // Prevent certain status transitions if needed
    if (body.status && order.status === 'completed' && body.status !== 'completed') {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Cannot change status from completed', code: 'invalid_status_change' }
        },
        { status: 400, headers: corsHeaders }
      )
    }

    const { data, error } = await supabase
      .from('orders')
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
        data: { order: data },
        error: null
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || 'Failed to update order',
          code: 'server_error'
        }
      },
      { status: 500, headers: corsHeaders }
    )
  }
}