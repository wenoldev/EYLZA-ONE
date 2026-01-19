/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { checkStoreAccess } from '@/_libs/store-access'
import { corsHeaders } from '@/_libs/auth'

interface RouteParams {
    params: Promise<{ id: string; themeId: string; slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { id: storeId, themeId, slug } = await params;
        const userId = req.headers.get('x-user-id')

        if (!userId) {
            return NextResponse.json({ data: {}, error: { message: 'Unauthorized' } }, { status: 401 })
        }

        const hasAccess = await checkStoreAccess(userId, storeId, ['owner', 'manager', 'staff'])
        if (!hasAccess) {
            return NextResponse.json({ data: {}, error: { message: 'Forbidden' } }, { status: 403 })
        }

        const supabase = await supabaseServer()

        // 1. Verify theme belongs to store
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data: theme, error: themeError } = await supabase
            .from('store_themes')
            .select('id')
            .eq('id', themeId)
            .eq('store_id', storeId)
            .single()

        if (themeError) {
            return NextResponse.json({
                data: {},
                error: { message: `Theme ${themeId} not found for store ${storeId}` }
            }, { status: 404 })
        }

        // 2. Fetch the page
        const { data: page, error } = await supabase
            .from('store_pages')
            .select('*')
            .eq('theme_id', themeId)
            .ilike('slug', slug)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({
                    data: null,
                    error: { message: `Page with slug '${slug}' not found for theme ${themeId}` }
                }, { status: 404 })
            }
            throw error
        }

        return NextResponse.json({
            data: { page },
            error: null
        }, { headers: corsHeaders })
    } catch (error: any) {
        console.error("Error fetching page:", error)
        return NextResponse.json({ data: {}, error: { message: error.message } }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
    try {
        const { id: storeId, themeId, slug } = await params;
        const userId = req.headers.get('x-user-id')

        if (!userId) {
            return NextResponse.json({ data: {}, error: { message: 'Unauthorized' } }, { status: 401 })
        }

        const hasAccess = await checkStoreAccess(userId, storeId, ['owner', 'manager'])
        if (!hasAccess) {
            return NextResponse.json({ data: {}, error: { message: 'Forbidden' } }, { status: 403 })
        }

        const supabase = await supabaseServer()
        const body = await req.json()
        const { name, content } = body

        const { data: page, error } = await supabase
            .from('store_pages')
            .update({
                ...(name !== undefined && { name }),
                ...(content !== undefined && { content }),
                updated_at: new Date().toISOString()
            })
            .eq('theme_id', themeId)
            .ilike('slug', slug)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({
            data: { page },
            error: null
        }, { headers: corsHeaders })
    } catch (error: any) {
        return NextResponse.json({ data: {}, error: { message: error.message } })
    }
}
