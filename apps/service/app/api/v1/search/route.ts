/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

export async function GET(req: NextRequest) {
  try {
    const supabase = await supabaseServer()
    const url = new URL(req.url)
    const q = url.searchParams.get('q')
    const type = url.searchParams.get('type') || 'all' // products, stores, categories
    const limit = parseInt(url.searchParams.get('limit') || '20')

    // Input validation
    if (!q) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Search query is required', code: 'invalid_input' }
        },
        { status: 400, headers: corsHeaders }
      )
    }

    const results: any = {
      products: [],
      stores: [],
      categories: []
    }
    let hasError = false

    if (type === 'all' || type === 'products') {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          id, name, slug, description, price,
          stores!inner(name, slug),
          product_images!left(*)
        `)
        .eq('status', 'active')
        .or(`name.ilike.%${q}%, description.ilike.%${q}%`)
        .limit(limit)

      if (productsError) {
        console.error('Product search error:', productsError)
        hasError = true
      } else {
        results.products = products
      }
    }

    if (type === 'all' || type === 'stores') {
      const { data: stores, error: storesError } = await supabase
        .from('stores')
        .select('id, name, slug, description, logo_url')
        .eq('status', 'active')
        .or(`name.ilike.%${q}%, description.ilike.%${q}%`)
        .limit(limit)

      if (storesError) {
        console.error('Store search error:', storesError)
        hasError = true
      } else {
        results.stores = stores
      }
    }

    if (type === 'all' || type === 'categories') {
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select(`
          id, name, slug,
          stores!inner(name, slug)
        `)
        .eq('status', 'active')
        .ilike('name', `%${q}%`)
        .limit(limit)

      if (categoriesError) {
        console.error('Category search error:', categoriesError)
        hasError = true
      } else {
        results.categories = categories
      }
    }

    if (hasError) {
      return NextResponse.json(
        {
          data: results,
          error: {
            message: 'Partial results returned (some searches failed)',
            code: 'partial_results'
          }
        },
        { headers: corsHeaders }
      )
    }

    return NextResponse.json(
      {
        data: results,
        error: null
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || 'Failed to perform search',
          code: 'server_error'
        }
      },
      { status: 500, headers: corsHeaders }
    )
  }
}

