/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const userRole = req.headers.get('x-user-role')

    if (userRole !== 'admin') {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Forbidden: Admin access required', code: 'forbidden' }
        },
        { status: 403, headers: corsHeaders }
      )
    }

    const supabase = await supabaseServer()

    // Fetch store details
    const { data: store, error } = await supabase
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

    // Fetch stats in parallel
    const [productsResult, ordersResult, revenueResult] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('store_id', id),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('store_id', id),
      supabase.from('orders').select('total_amount').eq('store_id', id),
    ])

    const productsCount = productsResult.count || 0
    const ordersCount = ordersResult.count || 0
    const revenue = revenueResult.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

    return NextResponse.json(
      {
        data: {
          store: {
            ...store,
            stats: {
              products: productsCount,
              orders: ordersCount,
              revenue,
              users: 0 // Logic removed
            }
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
          message: error.message || 'Failed to fetch store details',
          code: 'server_error'
        }
      },
      { status: 500, headers: corsHeaders }
    )
  }
}
