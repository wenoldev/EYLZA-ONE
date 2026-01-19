/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase';
import { checkStoreAccess } from '@/_libs/store-access';
import { NextRequest, NextResponse } from 'next/server';
import { corsHeaders } from '@/_libs/auth';
import { RouteParams } from '@/types';
import { deleteFileFromCloudinary, uploadFileToCloudinary } from '@/_libs/common';

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const userId = req.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json(
        { data: {}, error: { message: "Unauthorized", code: "missing_user_id" } },
        { status: 401, headers: corsHeaders }
      )
    }

    const supabase = await supabaseServer()
    const { data: product, error: productError } = await supabase.from('products').select("store_id").eq("id", id).single()
    if (productError || !product) {
      return NextResponse.json(
        { data: {}, error: { message: "Product not found", code: "product_not_found" } },
        { status: 404, headers: corsHeaders }
      )
    }

    const hasAccess = await checkStoreAccess(userId, product.store_id, ["owner", "manager", "staff"])
    if (!hasAccess) {
      return NextResponse.json(
        { data: {}, error: { message: "Forbidden", code: "no_product_access" } },
        { status: 403, headers: corsHeaders }
      )
    }

    const body = await req.json()
    const { category_ids, images, ...updateData } = body

    // update product
    const { data: updated, error: updateError } = await supabase
      .from('products')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single()

    if (updateError) {
      return NextResponse.json(
        { data: {}, error: { message: updateError.message, code: "database_error" } },
        { status: 500, headers: corsHeaders }
      )
    }

    // update categories
    if (Array.isArray(category_ids)) {
      await supabase.from('product_categories').delete().eq("product_id", id)
      if (category_ids.length > 0) {
        const inserts = category_ids.map((cid: string) => ({ product_id: id, category_id: cid }))
        await supabase.from('product_categories').insert(inserts)
      }
    }

    // update images
    if (Array.isArray(images)) {
      // fetch old images first
      const { data: oldImages } = await supabase.from('product_images').select("url").eq("product_id", id)

      // delete db records
      await supabase.from('product_images').delete().eq("product_id", id)

      // delete files from storage
      if (oldImages) {
        await Promise.all(oldImages.map(img => deleteFileFromCloudinary(img.url)))
      }

      // insert new ones
      const uploads = await Promise.all(
        images.map(async (img: any) => {
          const { fileName, fileContent } = img.image_url
          const { publicUrl } = await uploadFileToCloudinary("products", product.store_id, fileName, fileContent)
          return {
            product_id: id,
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
      { data: { product: { ...updated, category_ids: category_ids || [], images: images || [] } }, error: null },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      { data: {}, error: { message: error.message || "Failed to update product", code: "server_error" } },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const userId = req.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json(
        { data: {}, error: { message: "Unauthorized", code: "missing_user_id" } },
        { status: 401, headers: corsHeaders }
      )
    }

    const supabase = await supabaseServer()
    const { data: product, error: productError } = await supabase.from('products').select("store_id").eq("id", id).single()

    if (productError || !product) {
      return NextResponse.json(
        { data: {}, error: { message: "Product not found", code: "product_not_found" } },
        { status: 404, headers: corsHeaders }
      )
    }

    const hasAccess = await checkStoreAccess(userId, product.store_id, ["owner", "manager"])
    if (!hasAccess) {
      return NextResponse.json(
        { data: {}, error: { message: "Forbidden", code: "insufficient_permissions" } },
        { status: 403, headers: corsHeaders }
      )
    }
    const { data: images } = await supabase.from('product_images').select("url").eq("product_id", id)
    // delete categories + images + product
    await supabase.from('product_categories').delete().eq("product_id", id)
    await supabase.from('product_images').delete().eq("product_id", id)
    await supabase.from('products').delete().eq("id", id)
    if (images) {
      await Promise.all(images.map(img => deleteFileFromCloudinary(img.url)))
    }
    return NextResponse.json(
      { data: { message: "Product deleted successfully" }, error: null },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      { data: {}, error: { message: error.message || "Failed to delete product", code: "server_error" } },
      { status: 500, headers: corsHeaders }
    )
  }
}