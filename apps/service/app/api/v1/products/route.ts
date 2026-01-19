/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { checkStoreAccess } from '@/_libs/store-access'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'
import { uploadFileToCloudinary } from '@/_libs/common'

export async function GET(req: NextRequest) {
  try {
    const supabase = await supabaseServer()
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = parseInt(url.searchParams.get("limit") || "20")
    const store_id = url.searchParams.get("store_id")
    const category_id = url.searchParams.get("category_id")
    const status = url.searchParams.get("status") || "active"
    const search = url.searchParams.get("search")
    const min_price = url.searchParams.get("min_price")
    const max_price = url.searchParams.get("max_price")

    let query = supabase
      .from('products')
      .select(
        `
        *,
        product_categories!left(category_id),
        product_images!left(*)
      `,
        { count: "exact" }
      )
      .eq("status", status)
      .range((page - 1) * limit, page * limit - 1)

    if (store_id) query = query.eq("store_id", store_id)
    if (category_id) query = query.eq("product_categories.category_id", category_id)
    if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    if (min_price) query = query.gte("price", min_price)
    if (max_price) query = query.lte("price", max_price)

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json(
        {
          data: {},
          error: { message: error.message, code: "database_error" },
        },
        { status: 500, headers: corsHeaders }
      )
    }

    // Flatten categories & images
    const products = data.map((p: any) => ({
      ...p,
      category_ids: p.product_categories?.map((pc: any) => pc.category_id) || [],
      images: p.product_images || [],
    }))

    return NextResponse.json(
      {
        data: {
          products,
          pagination: {
            page,
            limit,
            total: count || products.length,
          },
        },
        error: null,
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || "Failed to fetch products",
          code: "server_error",
        },
      },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json(
        {
          data: {},
          error: { message: "Unauthorized: Missing user ID", code: "missing_user_id" },
        },
        { status: 401, headers: corsHeaders }
      )
    }

    const body = await req.json()
    const { name, slug, description, price, original_price, currency, stock, images, meta_data, category_ids } = body

    if (!name || !price) {
      return NextResponse.json(
        {
          data: {},
          error: { message: "Name and price are required", code: "invalid_input" },
        },
        { status: 400, headers: corsHeaders }
      )
    }

    const supabase = await supabaseServer()

    const { store_id } = body

    if (!store_id) {
      return NextResponse.json(
        {
          data: {},
          error: { message: "Store ID is required", code: "missing_store_id" },
        },
        { status: 400, headers: corsHeaders }
      )
    }

    // Access check
    const hasAccess = await checkStoreAccess(userId, store_id, ["owner", "manager", "staff"])
    if (!hasAccess) {
      return NextResponse.json(
        {
          data: {},
          error: { message: "Forbidden: No access to this store", code: "no_store_access" },
        },
        { status: 403, headers: corsHeaders }
      )
    }

    // Generate slug
    const finalSlug = slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

    // Check duplicate slug
    const { count: slugCount } = await supabase
      .from('products')
      .select("*", { count: "exact", head: true })
      .eq("store_id", store_id)
      .eq("slug", finalSlug)

    if (slugCount && slugCount > 0) {
      return NextResponse.json(
        {
          data: {},
          error: { message: "Product with this slug already exists in this store", code: "duplicate_slug" },
        },
        { status: 400, headers: corsHeaders }
      )
    }

    // Insert product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        store_id,
        name,
        slug: finalSlug,
        description,
        price,
        original_price,
        currency,
        stock,
        meta_data,
        status: "active",
      })
      .select()
      .single()

    if (productError) {
      return NextResponse.json(
        {
          data: {},
          error: { message: productError.message, code: "database_error" },
        },
        { status: 500, headers: corsHeaders }
      )
    }

    // Insert categories
    if (category_ids?.length) {
      const inserts = category_ids.map((cid: string) => ({
        product_id: product.id,
        category_id: cid,
      }))
      await supabase.from('product_categories').insert(inserts)
    }

    // Insert images
    if (Array.isArray(images) && images.length > 0) {
      const uploads = await Promise.all(
        images.map(async (img: any) => {
          const { fileName, fileContent } = img.image_url
          const { publicUrl } = await uploadFileToCloudinary("products", store_id, fileName, fileContent)
          return {
            product_id: product.id,
            url: publicUrl,
            is_primary: img.isPrimary ?? false,
            type: img.type ?? "default",
          }
        })
      )
      if (uploads.length > 0) {
        await supabase.from('product_images').insert(uploads)
      }
    }

    return NextResponse.json(
      {
        data: { product },
        error: null,
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || "Failed to create product",
          code: "server_error",
        },
      },
      { status: 500, headers: corsHeaders }
    )
  }
}

