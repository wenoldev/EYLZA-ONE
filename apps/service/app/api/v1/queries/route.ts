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
    const user_only = url.searchParams.get('user_only') === 'true'

    let query = supabase
      .from('customer_queries')
      .select(`
        *,
        users!inner(name, email),
        stores!inner(name, slug)
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
          queries: data,
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
          message: error.message || 'Failed to fetch customer queries',
          code: 'server_error'
        }
      },
      { status: 500, headers: corsHeaders }
    )
  }
}
