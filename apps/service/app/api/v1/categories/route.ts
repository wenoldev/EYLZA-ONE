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
    const status = url.searchParams.get("status") || "active"
    const search = url.searchParams.get("search")

    let query = supabase
      .from('categories')
      .select("*", { count: "exact" })
      .eq("status", status)
      .range((page - 1) * limit, page * limit - 1)

    if (store_id) query = query.eq("store_id", store_id)
    if (search) query = query.ilike("name", `%${search}%`)

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

    return NextResponse.json(
      {
        data: {
          categories: data,
          pagination: {
            page,
            limit,
            total: count || data.length,
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
          message: error.message || "Failed to fetch categories",
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
    const { store_id, name, slug, image_url } = body

    // Input validation
    if (!store_id || !name) {
      return NextResponse.json(
        {
          data: {},
          error: { message: "Store ID and name are required", code: "invalid_input" },
        },
        { status: 400, headers: corsHeaders }
      )
    }

    const supabase = await supabaseServer()

    // Access check

    // const validatedStoreId = userStore.store_id

    // Access check
    const hasAccess = await checkStoreAccess(userId, store_id, ["owner", "manager"])
    if (!hasAccess) {
      return NextResponse.json(
        {
          data: {},
          error: { message: "Forbidden: No access to this store", code: "no_store_access" },
        },
        { status: 403, headers: corsHeaders }
      )
    }

    // Generate slug if not provided
    const finalSlug = slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

    // Check for existing category with same slug in this store
    const { count: slugCount } = await supabase
      .from('categories')
      .select("*", { count: "exact", head: true })
      .eq("store_id", store_id)
      .eq("slug", finalSlug)

    if (slugCount && slugCount > 0) {
      return NextResponse.json(
        {
          data: {},
          error: { message: "Category with this slug already exists in this store", code: "duplicate_slug" },
        },
        { status: 400, headers: corsHeaders }
      )
    }

    // Handle image upload
    let uploadedImageUrl = null
    if (image_url?.fileContent && image_url?.fileName) {
      const { publicUrl } = await uploadFileToCloudinary(
        "categories",
        store_id,
        image_url.fileName,
        image_url.fileContent
      )
      uploadedImageUrl = publicUrl
    }

    // Insert category
    const { data, error: createError } = await supabase
      .from('categories')
      .insert({
        store_id,
        name,
        slug: finalSlug,
        image_url: uploadedImageUrl,
        status: "active",
      })
      .select()
      .single()

    if (createError) {
      return NextResponse.json(
        {
          data: {},
          error: { message: createError.message, code: "database_error" },
        },
        { status: 500, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      {
        data: { category: data },
        error: null,
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || "Failed to create category",
          code: "server_error",
        },
      },
      { status: 500, headers: corsHeaders }
    )
  }
}