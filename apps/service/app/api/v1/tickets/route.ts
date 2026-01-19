/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    const userRole = req.headers.get('x-user-role')

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
    const status = url.searchParams.get('status')
    const storeId = url.searchParams.get('store_id')

    // For non-admin users, store_id is required to fetch tickets
    if (userRole !== 'admin' && !storeId) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'store_id is required', code: 'missing_store_id' }
        },
        { status: 400, headers: corsHeaders }
      )
    }

    let query = supabase
      .from('tickets')
      .select('*', { count: 'exact' })
      .range((page - 1) * limit, page * limit - 1)

    if (storeId) {
      query = query.eq('store_id', storeId)
    }

    if (status) {
      query = query.eq('status', status)
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
          tickets: data,
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
          message: error.message || 'Failed to fetch tickets',
          code: 'server_error'
        }
      },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')

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
    const { subject, message, priority, store_id } = body

    if (!subject || !message || !store_id) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Subject, message, and store_id are required', code: 'invalid_input' }
        },
        { status: 400, headers: corsHeaders }
      )
    }

    const supabase = await supabaseServer()

    const { data, error } = await supabase
      .from('tickets')
      .insert({
        store_id,
        subject,
        message,
        priority: priority || 'normal',
        status: 'open'
      })
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
        data: { ticket: data },
        error: null
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || 'Failed to create ticket',
          code: 'server_error'
        }
      },
      { status: 500, headers: corsHeaders }
    )
  }
}
