/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

export async function GET(req: NextRequest) {
  try {
    // Get user info from headers set by middleware
    const userId = req.headers.get('x-user-id')
    const userRole = req.headers.get('x-user-role')

    if (!userId || userRole !== 'admin') {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Unauthorized: Admin access required', code: 'admin_access_required' }
        },
        { status: 403, headers: corsHeaders }
      )
    }

    const supabase = await supabaseServer()
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const role = url.searchParams.get('role')
    const status = url.searchParams.get('status')
    const search = url.searchParams.get('search')

    let query = supabase
      .from('users')
      .select('id, email, name, phone, role, status, created_at, updated_at, count')
      .range((page - 1) * limit, page * limit - 1)

    if (role) query = query.eq('role', role)
    if (status) query = query.eq('status', status)
    if (search) query = query.or(`name.ilike.%${search}%, email.ilike.%${search}%`)

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
          users: data,
          pagination: {
            page,
            limit,
            total: count || 0
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
          message: error.message || 'Failed to fetch users',
          code: 'server_error'
        }
      },
      { status: 500, headers: corsHeaders }
    )
  }
}

