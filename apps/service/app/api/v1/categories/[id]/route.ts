/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from "@/_libs/supabase"
import { checkStoreAccess } from "@/_libs/store-access"
import { type NextRequest, NextResponse } from "next/server"
import { corsHeaders } from "@/_libs/auth"
import { RouteParams } from "@/types"
import { deleteFileFromCloudinary, uploadFileToCloudinary } from "@/_libs/common"

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id } = await params

  try {
    const supabase = await supabaseServer()
    const { data, error } = await supabase.from('categories').select("*").eq("id", id).single()

    if (error) {
      return NextResponse.json(
        {
          data: {},
          error: { message: error.message, code: "not_found" },
        },
        { status: 404, headers: corsHeaders },
      )
    }

    return NextResponse.json(
      {
        data: { category: data },
        error: null,
      },
      { headers: corsHeaders },
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || "Failed to fetch category",
          code: "server_error",
        },
      },
      { status: 500, headers: corsHeaders },
    )
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id } = await params

  try {
    const userId = req.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json(
        {
          data: {},
          error: { message: "Unauthorized: Missing user ID", code: "missing_user_id" },
        },
        { status: 401, headers: corsHeaders },
      )
    }

    const supabase = await supabaseServer()

    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select("store_id, image_url")
      .eq("id", id)
      .single()

    if (categoryError || !category) {
      return NextResponse.json(
        { data: {}, error: { message: "Category not found", code: "category_not_found" } },
        { status: 404, headers: corsHeaders }
      )
    }

    const hasAccess = await checkStoreAccess(userId, category.store_id, ["owner", "manager"])
    if (!hasAccess) {
      return NextResponse.json(
        { data: {}, error: { message: "Forbidden: No access to this category", code: "no_category_access" } },
        { status: 403, headers: corsHeaders }
      )
    }

    const body = await req.json()
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { data: {}, error: { message: "No update data provided", code: "invalid_input" } },
        { status: 400, headers: corsHeaders }
      )
    }

    let newImageUrl = category.image_url

    // handle image upload if new file comes in
    if (body.image_url?.fileContent && body.image_url?.fileName) {
      // remove old image (if exists)
      if (category.image_url) {
        const oldPath = category.image_url.split("/storage/v1/object/public/")[1] // extract path
        if (oldPath) {
          await supabase.storage.from("categories").remove([oldPath])
        }
      }

      // upload new file
      const { publicUrl } = await uploadFileToCloudinary(
        "categories",
        category.store_id,
        body.image_url.fileName,
        body.image_url.fileContent
      )
      newImageUrl = publicUrl
    }

    // if slug provided → validate duplicates
    if (body.slug) {
      const { count: slugCount } = await supabase
        .from('categories')
        .select("*", { count: "exact", head: true })
        .eq("store_id", category.store_id)
        .eq("slug", body.slug)
        .neq("id", id)

      if (slugCount && slugCount > 0) {
        return NextResponse.json(
          { data: {}, error: { message: "Duplicate slug", code: "duplicate_slug" } },
          { status: 400, headers: corsHeaders }
        )
      }
    }

    // update category
    const { data, error } = await supabase
      .from('categories')
      .update({
        ...body,
        image_url: newImageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { data: {}, error: { message: error.message, code: "database_error" } },
        { status: 500, headers: corsHeaders }
      )
    }

    return NextResponse.json({ data: { category: data }, error: null }, { headers: corsHeaders })
  } catch (error: any) {
    return NextResponse.json(
      { data: {}, error: { message: error.message || "Failed to update category", code: "server_error" } },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { id } = await params

  try {
    const userId = req.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json(
        { data: {}, error: { message: "Unauthorized: Missing user ID", code: "missing_user_id" } },
        { status: 401, headers: corsHeaders }
      )
    }

    const supabase = await supabaseServer()

    // fetch category
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select("store_id, image_url") // 👈 assumes you store image_url in categories
      .eq("id", id)
      .single()

    if (categoryError || !category) {
      return NextResponse.json(
        { data: {}, error: { message: "Category not found", code: "category_not_found" } },
        { status: 404, headers: corsHeaders }
      )
    }

    // access check
    const hasAccess = await checkStoreAccess(userId, category.store_id, ["owner", "manager"])
    if (!hasAccess) {
      return NextResponse.json(
        { data: {}, error: { message: "Forbidden", code: "insufficient_permissions" } },
        { status: 403, headers: corsHeaders }
      )
    }

    // 🔥 remove relations first
    await supabase.from('product_categories').delete().eq("category_id", id)

    // 🔥 remove category image from storage if exists
    if (category.image_url) {
      // your image_url is probably a public URL, so extract the file path
      const url = new URL(category.image_url)
      const filePath = decodeURIComponent(url.pathname.replace(/^\/storage\/v1\/object\/public\/categories\//, ""))

      await deleteFileFromCloudinary(filePath)
    }

    // delete category
    const { error } = await supabase.from('categories').delete().eq("id", id)
    if (error) {
      return NextResponse.json(
        { data: {}, error: { message: error.message, code: "database_error" } },
        { status: 500, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      { data: { message: "Category deleted successfully (relations + image cleared)" }, error: null },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      { data: {}, error: { message: error.message || "Failed to delete category", code: "server_error" } },
      { status: 500, headers: corsHeaders }
    )
  }
}

