/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

export async function GET(req: NextRequest) {
  try {
    const supabase = await supabaseServer()
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const status = url.searchParams.get('status')
    const search = url.searchParams.get('search')

    // Get user info from headers set by middleware
    const userId = req.headers.get('x-user-id')
    const userRole = req.headers.get('x-user-role')

    let query = supabase
      .from('stores')
      .select('*')
      .range((page - 1) * limit, page * limit - 1)

    // For non-admin users, only show their own stores
    if (userRole !== 'admin' && userId) {
      query = supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)
    }

    if (status) query = query.eq('status', status as any)
    if (search) query = query.ilike('name', `%${search}%`)

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        {
          data: {},
          error: { message: error.message, code: 'database_error' }
        }
      )
    }

    return NextResponse.json(
      {
        data: { stores: data, page, limit },
        error: null
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {},
        error: { message: error.message, code: 'server_error' }
      }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get user info from headers set by middleware
    const userId = req.headers.get('x-user-id')
    const userRole = req.headers.get('x-user-role')

    if (!userId) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Unauthorized: Missing user ID', code: 'missing_user_id' }
        }
      )
    }

    // Only vendors and admins can create stores
    if (userRole !== 'admin' && userRole !== 'vendor') {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Forbidden: Insufficient permissions', code: 'insufficient_permissions' }
        }
      )
    }

    const supabase = await supabaseServer()
    const body = await req.json()
    const { name, slug, description, logo_url, contact_email, phone, currency, country, city, timezone } = body

    // Input validation
    if (!name) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Store name is required', code: 'invalid_input' }
        }
      )
    }

    // Generate slug if not provided
    const finalSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    // Check if store with same slug already exists
    const { data: existingStore, error: slugCheckError } = await supabase
      .from('stores')
      .select('id')
      .eq('slug', finalSlug)
      .maybeSingle()

    if (slugCheckError) throw slugCheckError
    if (existingStore) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Store with this slug already exists', code: 'duplicate_slug' }
        }
      )
    }

    const { data: store, error: storeError } = await supabase
      .from('stores')
      .insert({
        name,
        slug: finalSlug,
        description,
        logo_url,
        contact_email,
        phone,
        currency,
        country,
        city,
        timezone,
        status: 'active' // Added default status
      })
      .select()
      .single()

    if (storeError) throw storeError

    // user_store logic removed as table is deleted
    /*
    const { error: userStoreError } = await supabase
      .from('user_store')
      .insert({
        user_id: userId,
        store_id: store.id,
        role: 'owner'
      })

    if (userStoreError) throw userStoreError
    */

    return NextResponse.json(
      {
        data: { store },
        error: null
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || 'Failed to create store',
          code: error.code || 'database_error'
        }
      }
    )
  }
}

