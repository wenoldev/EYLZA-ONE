/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from "@/_libs/supabase"
import { checkStoreAccess } from "@/_libs/store-access"
import { NextRequest, NextResponse } from "next/server"
import { corsHeaders } from "@/_libs/auth"
interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const userId = req.headers.get("x-user-id")
    const { id: storeId } = await params

    if (!userId) {
      return NextResponse.json(
        {
          data: {},
          error: { message: "Unauthorized", code: "missing_user_id" },
        },
        { status: 401, headers: corsHeaders }
      )
    }

    const supabase = await supabaseServer()

    // ✅ Check store access
    const canAccess = await checkStoreAccess(userId, storeId, [
      "owner",
      "manager",
      "staff",
    ])
    if (!canAccess) {
      return NextResponse.json(
        {
          data: {},
          error: { message: "Forbidden", code: "no_store_access" },
        },
        { status: 403, headers: corsHeaders }
      )
    }

    // ✅ Queries
    const { data: revenueData, error: revenueErr } = await supabase.rpc(
      "get_revenue_by_month",
      { p_store_id: storeId }
    )
    if (revenueErr) throw revenueErr

    const { data: ordersData, error: ordersErr } = await supabase.rpc(
      "get_orders_per_day",
      { p_store_id: storeId }
    )
    if (ordersErr) throw ordersErr

    const { data: categoryData, error: categoryErr } = await supabase.rpc(
      "get_revenue_by_category",
      { p_store_id: storeId }
    )
    if (categoryErr) throw categoryErr

    const { data: funnelData, error: funnelErr } = await supabase.rpc(
      "get_conversion_funnel",
      { p_store_id: storeId }
    )
    if (funnelErr) throw funnelErr

    const { data: topProducts, error: topErr } = await supabase.rpc(
      "get_top_products",
      { p_store_id: storeId }
    )
    if (topErr) throw topErr

    const { data: refunds, error: refundErr } = await supabase
      .from("refunds")
      .select("id")
      .eq("store_id", storeId)
    if (refundErr) throw refundErr

    const { data: newCustomers, error: newCustErr } = await supabase.rpc(
      "get_new_customers",
      { p_store_id: storeId }
    )
    if (newCustErr) throw newCustErr

    const { data: repeatCustomers, error: repeatCustErr } = await supabase.rpc(
      "get_repeat_customers",
      { p_store_id: storeId }
    )
    if (repeatCustErr) throw repeatCustErr

    // ⚡ Inventory stub (replace with actual query if needed)
    const inventory = {
      lowStock: 0,
      outOfStock: 0,
      totalSkus: 0,
    }

    // ✅ Normalized response
    return NextResponse.json(
      {
        data: {
          revenue: revenueData ?? [],
          orders: ordersData ?? [],
          categoryRevenue: categoryData ?? [],
          funnel: funnelData ?? [],
          topProducts: topProducts ?? [],
          refunds: refunds?.length ?? 0,
          customers: {
            new: newCustomers ?? 0,
            repeat: repeatCustomers ?? 0,
          },
          inventory,
        },
        error: null,
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    console.error("Analytics API error:", error)
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || "Failed to fetch analytics",
          code: "server_error",
        },
      },
      { status: 500, headers: corsHeaders }
    )
  }
}
