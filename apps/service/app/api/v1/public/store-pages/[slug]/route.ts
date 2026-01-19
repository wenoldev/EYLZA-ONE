/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

interface RouteParams {
    params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params;
        const url = new URL(req.url)
        const storeIdParam = url.searchParams.get('storeId')
        const storeIdHeader = req.headers.get('x-store-id')
        const storeId = storeIdParam || storeIdHeader

        if (!storeId) {
            return NextResponse.json({ data: {}, error: { message: 'Store ID is required' } }, { status: 400, headers: corsHeaders })
        }

        const supabase = await supabaseServer()

        // 1. Find published theme for store
        const { data: theme, error: themeError } = await supabase
            .from('store_themes')
            .select('id')
            .eq('store_id', storeId)
            .eq('status', 'published')
            .maybeSingle()

        if (themeError) throw themeError
        if (!theme) {
            return NextResponse.json({ data: {}, error: { message: 'No published theme found' } }, { status: 404, headers: corsHeaders })
        }

        // 2. Fetch the page content
        const { data: page, error } = await supabase
            .from('store_pages')
            .select('*')
            .eq('theme_id', theme.id)
            .ilike('slug', slug)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({
                    data: null,
                    error: { message: `Page with slug '${slug}' not found` }
                }, { status: 404, headers: corsHeaders })
            }
            throw error
        }

        return NextResponse.json({
            data: { page },
            error: null
        }, { headers: corsHeaders })

    } catch (error: any) {
        console.error("Error fetching public page content:", error)
        return NextResponse.json({ data: {}, error: { message: error.message } }, { status: 500, headers: corsHeaders })
    }
}

export async function OPTIONS() {
    return new NextResponse(null, { headers: corsHeaders })
}
