/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

export async function GET(req: NextRequest) {
  try {
    const supabase = await supabaseServer()
    const url = new URL(req.url)
    const slug = url.searchParams.get('slug')
    const excludeId = url.searchParams.get('excludeId') // For edit scenarios

    // Validate slug parameter
    if (!slug) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Slug parameter is required', code: 'missing_slug' }
        }
      )
    }

    // Validate slug format (lowercase, alphanumeric, hyphens only)
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        {
          data: { exists: false, valid: false },
          error: { message: 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.', code: 'invalid_slug_format' }
        }
      )
    }

    // Build query
    let query = supabase
      .from('stores')
      .select('id, slug, name')
      .eq('slug', slug)

    // Exclude specific store ID if provided (useful for edit scenarios)
    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query.maybeSingle()

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
        data: {
          exists: !!data,
          valid: true,
          slug: slug,
          store: data || null
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
          message: error.message || 'Failed to check slug',
          code: 'server_error'
        }
      }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await supabaseServer()
    const body = await req.json()
    const { slug, excludeId } = body

    // Validate slug parameter
    if (!slug) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Slug is required', code: 'missing_slug' }
        }
      )
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        {
          data: { exists: false, valid: false },
          error: { message: 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.', code: 'invalid_slug_format' }
        }
      )
    }

    // Build query
    let query = supabase
      .from('stores')
      .select('id, slug, name')
      .eq('slug', slug)

    // Exclude specific store ID if provided
    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query.maybeSingle()

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
        data: {
          exists: !!data,
          valid: true,
          slug: slug,
          store: data || null
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
          message: error.message || 'Failed to check slug',
          code: 'server_error'
        }
      }
    )
  }
}