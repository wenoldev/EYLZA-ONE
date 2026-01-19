/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
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

    const { data: userData, error } = await supabase
      .from('users')
      .select(`
        id, email, name, phone, role, status, created_at, updated_at
      `)
      .eq('id', userId)
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
        data: {
          ...userData,
          stores: [] // userData.user_store || [] // Logic removed
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
          message: error.message || 'Failed to fetch user data',
          code: 'server_error'
        }
      },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function PATCH(req: NextRequest) {
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
    const { name, phone } = body

    // Input validation
    if (!name && !phone) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'At least one field (name or phone) is required', code: 'invalid_input' }
        },
        { status: 400, headers: corsHeaders }
      )
    }

    const supabase = await supabaseServer()

    const updateData: any = { updated_at: new Date().toISOString() }
    if (name !== undefined) updateData.name = name
    if (phone !== undefined) updateData.phone = phone

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('id, email, name, phone, role, status, created_at, updated_at')
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
        data: { user: data },
        error: null
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || 'Failed to update user',
          code: 'server_error'
        }
      },
      { status: 500, headers: corsHeaders }
    )
  }
}

