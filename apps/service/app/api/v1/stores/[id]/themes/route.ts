/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { checkStoreAccess } from '@/_libs/store-access'
import { corsHeaders } from '@/_libs/auth'

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { id: storeId } = await params;
        const userId = req.headers.get('x-user-id')

        if (!userId) {
            return NextResponse.json({ data: {}, error: { message: 'Unauthorized' } }, { status: 401 })
        }

        const hasAccess = await checkStoreAccess(userId, storeId, ['owner', 'manager', 'staff'])
        if (!hasAccess) {
            return NextResponse.json({ data: {}, error: { message: 'Forbidden' } }, { status: 403 })
        }

        const supabase = await supabaseServer()
        const { data, error } = await supabase
            .from('store_themes')
            .select('*')
            .eq('store_id', storeId)
            .order('updated_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({ data: { themes: data }, error: null }, { headers: corsHeaders })
    } catch (error: any) {
        return NextResponse.json({ data: {}, error: { message: error.message } })
    }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
    try {
        const { id: storeId } = await params;
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
        const { theme_id } = body // This is the template theme ID

        if (!theme_id) {
            return NextResponse.json({ data: {}, error: { message: 'theme_id is required' } }, { status: 400 })
        }

        // 1. Fetch the template theme
        const { data: templateTheme, error: templateError } = await supabase
            .from('themes')
            .select('*')
            .eq('id', theme_id)
            .single()

        if (templateError) throw templateError

        // 2. Fetch the template pages
        const { data: templatePages, error: pagesError } = await supabase
            .from('pages')
            .select('*')
            .eq('theme_id', theme_id)

        if (pagesError) throw pagesError

        // 3. Create the store theme
        const { data: storeTheme, error: storeThemeError } = await supabase
            .from('store_themes')
            .insert({
                store_id: storeId,
                theme_id: theme_id,
                name: templateTheme.name,
                global_config: templateTheme.global_config || {},
                status: 'draft'
            })
            .select()
            .single()

        if (storeThemeError) throw storeThemeError

        // 4. Create the store pages
        if (templatePages && templatePages.length > 0) {
            const storePages = templatePages.map(page => ({
                theme_id: storeTheme.id,
                name: page.name,
                slug: page.slug,
                content: page.content || []
            }))

            const { error: insertPagesError } = await supabase
                .from('store_pages')
                .insert(storePages)

            if (insertPagesError) throw insertPagesError
        }

        return NextResponse.json({ data: { theme: storeTheme }, error: null }, { headers: corsHeaders })
    } catch (error: any) {
        console.error("Error creating store theme:", error)
        return NextResponse.json({ data: {}, error: { message: error.message } })
    }
}
