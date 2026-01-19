/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { checkStoreAccess } from '@/_libs/store-access'
import { corsHeaders } from '@/_libs/auth'

interface RouteParams {
    params: Promise<{ id: string; themeId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { id: storeId, themeId } = await params;
        // Get user info from headers set by middleware
        // const userId = req.headers.get('x-user-id')

        // Check access... (assuming checkStoreAccess uses headers internally or we pass userId)
        const userId = req.headers.get('x-user-id')
        if (!userId) {
            return NextResponse.json({ data: {}, error: { message: 'Unauthorized' } }, { status: 401 })
        }

        const hasAccess = await checkStoreAccess(userId, storeId, ['owner', 'manager', 'staff'])
        if (!hasAccess) {
            return NextResponse.json({ data: {}, error: { message: 'Forbidden' } }, { status: 403 })
        }

        const supabase = await supabaseServer()

        // Fetch theme info
        const { data: theme, error: themeError } = await supabase
            .from('store_themes')
            .select('*')
            .eq('id', themeId)
            .eq('store_id', storeId)
            .single()

        if (themeError) throw themeError

        // Fetch pages metadata
        const { data: pages, error: pagesError } = await supabase
            .from('store_pages')
            .select('id, name, slug')
            .eq('theme_id', themeId)

        if (pagesError) throw pagesError

        return NextResponse.json({
            data: { theme: { ...theme, pages } },
            error: null
        }, { headers: corsHeaders })
    } catch (error: any) {
        return NextResponse.json({ data: {}, error: { message: error.message } })
    }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
    try {
        const { id: storeId, themeId } = await params;
        const supabase = await supabaseServer()
        const body = await req.json()
        const { name, global_config, pages } = body

        // 1. Update theme metadata
        if (name !== undefined || global_config !== undefined) {
            const updateData: { name?: string; global_config?: any } = {};
            if (name !== undefined) {
                updateData.name = name;
            }
            if (global_config !== undefined) {
                updateData.global_config = global_config;
            }

            const { error } = await supabase
                .from('store_themes')
                .update({ ...updateData, updated_at: new Date().toISOString() })
                .eq('id', themeId)
                .eq('store_id', storeId)
            if (error) throw error
        }

        // 2. Sync Pages
        if (pages && Array.isArray(pages)) {
            for (const page of pages) {
                const { name, slug, content } = page
                const { data: existing } = await supabase
                    .from('store_pages')
                    .select('id')
                    .eq('theme_id', themeId)
                    .eq('slug', slug)
                    .maybeSingle()

                if (existing) {
                    await supabase.from('store_pages').update({ name, content, updated_at: new Date().toISOString() }).eq('id', existing.id)
                } else {
                    await supabase.from('store_pages').insert({ theme_id: themeId, name, slug, content })
                }
            }
        }

        return NextResponse.json({ data: { success: true }, error: null }, { headers: corsHeaders })
    } catch (error: any) {
        return NextResponse.json({ data: {}, error: { message: error.message } })
    }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
    try {
        const { id: storeId, themeId } = await params;
        const userId = req.headers.get('x-user-id')

        if (!userId) {
            return NextResponse.json({ data: {}, error: { message: 'Unauthorized' } }, { status: 401 })
        }

        const hasAccess = await checkStoreAccess(userId, storeId, ['owner', 'manager'])
        if (!hasAccess) {
            return NextResponse.json({ data: {}, error: { message: 'Forbidden' } }, { status: 403 })
        }

        const supabase = await supabaseServer()

        // 1. Delete associated pages first (to handle missing CASCADE)
        await supabase
            .from('store_pages')
            .delete()
            .eq('theme_id', themeId)

        // 2. Delete the theme
        const { error } = await supabase
            .from('store_themes')
            .delete()
            .eq('id', themeId)
            .eq('store_id', storeId)

        if (error) throw error

        return NextResponse.json({ data: { success: true }, error: null }, { headers: corsHeaders })
    } catch (error: any) {
        return NextResponse.json({ data: {}, error: { message: error.message } })
    }
}
