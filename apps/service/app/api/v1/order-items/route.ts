/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { checkStoreAccess } from '@/_libs/store-access'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

export async function GET(req: NextRequest) {
  try {
    // Get user info from headers set by middleware
    const userId = req.headers.get('x-user-id')
    // const userRole = req.headers.get('x-user-role')

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
    const url = new URL(req.url)
    const order_id = url.searchParams.get('order_id')

    // Input validation
    if (!order_id) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'order_id is required', code: 'invalid_input' }
        },
        { status: 400, headers: corsHeaders }
      )
    }

    // Check if user can access this order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('user_id, store_id')
      .eq('id', order_id)
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

    const { data, error } = await supabase
      .from('order_items')
      .select(`
        *,
        products!inner(name, slug, images)
      `)
      .eq('order_id', order_id)

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
        data: { items: data },
        error: null
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || 'Failed to fetch order items',
          code: 'server_error'
        }
      },
      { status: 500, headers: corsHeaders }
    )
  }
}

