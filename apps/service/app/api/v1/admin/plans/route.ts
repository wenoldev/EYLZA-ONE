/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

export async function GET() {
  try {
    const supabase = await supabaseServer()

    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('price', { ascending: true })

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
        data: { plans: data },
        error: null
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || 'Failed to fetch plans',
          code: 'server_error'
        }
      },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const userRole = req.headers.get('x-user-role')

    if (userRole !== 'admin') {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Forbidden: Only admin can create plans', code: 'forbidden' }
        },
        { status: 403, headers: corsHeaders }
      )
    }

    const body = await req.json()
    const { name, price, features, interval } = body

    if (!name || price === undefined) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Name and price are required', code: 'invalid_input' }
        },
        { status: 400, headers: corsHeaders }
      )
    }

    const supabase = await supabaseServer()

    const { data, error } = await supabase
      .from('plans')
      .insert({
        name,
        price,
        features: features || [],
        interval: interval || 'month',
        is_active: true
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
        data: { plan: data },
        error: null
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || 'Failed to create plan',
          code: 'server_error'
        }
      },
      { status: 500, headers: corsHeaders }
    )
  }
}
