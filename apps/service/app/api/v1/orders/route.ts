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
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const store_id = url.searchParams.get('store_id')
    const status = url.searchParams.get('status')
    const user_only = url.searchParams.get('user_only') === 'true'

    let query = supabase
      .from('orders')
      .select(`
        *,
        users!inner(name, email),
        stores!inner(name, slug),
        order_items!inner(*)
      `)
      .range((page - 1) * limit, page * limit - 1)

    if (user_only) {
      query = query.eq('user_id', userId)
    } else if (store_id) {
      // Check if user has access to this store
      const hasAccess = await checkStoreAccess(userId, store_id)
      if (!hasAccess) {
        return NextResponse.json(
          {
            data: {},
            error: { message: 'Forbidden: No access to this store', code: 'no_store_access' }
          },
          { status: 403, headers: corsHeaders }
        )
      }
      query = query.eq('store_id', store_id)
    }

    if (status) query = query.eq('status', status)

    const { data, error, count } = await query.order('created_at', { ascending: false })

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
        data: {
          orders: data,
          pagination: {
            page,
            limit,
            total: count || data.length
          }
        },
        error: null
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || 'Failed to fetch orders',
          code: 'server_error'
        }
      },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function POST(req: NextRequest) {
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

    const body = await req.json()
    const { store_id, items, notes } = body

    // Input validation
    if (!store_id || !items || items.length === 0) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Store ID and items are required', code: 'invalid_input' }
        },
        { status: 400, headers: corsHeaders }
      )
    }

    const supabase = await supabaseServer()

    // Calculate total amount
    let total_amount = 0
    for (const item of items) {
      if (!item.product_id || !item.product_name || !item.product_price || !item.quantity) {
        return NextResponse.json(
          {
            data: {},
            error: {
              message: 'Each item must have product_id, product_name, product_price and quantity',
              code: 'invalid_item'
            }
          },
          { status: 400, headers: corsHeaders }
        )
      }
      total_amount += item.product_price * item.quantity
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        store_id,
        user_id: userId,
        total_amount,
        notes,
        status: 'pending'
      })
      .select()
      .single()

    if (orderError) {
      return NextResponse.json(
        {
          data: {},
          error: { message: orderError.message, code: 'database_error' }
        },
        { status: 500, headers: corsHeaders }
      )
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_price: item.product_price,
      quantity: item.quantity,
      subtotal: item.product_price * item.quantity
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      return NextResponse.json(
        {
          data: {},
          error: { message: itemsError.message, code: 'order_items_error' }
        },
        { status: 500, headers: corsHeaders }
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
          message: error.message || 'Failed to create order',
          code: 'server_error'
        }
      },
      { status: 500, headers: corsHeaders }
    )
  }
}

