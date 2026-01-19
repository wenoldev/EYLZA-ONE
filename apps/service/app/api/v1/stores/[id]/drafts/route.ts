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
            return NextResponse.json({ data: {}, error: { message: 'Unauthorized', code: 'unauthorized' } }, { status: 401 })
        }

        const hasAccess = await checkStoreAccess(userId, storeId, ['owner', 'manager', 'editor'])
        if (!hasAccess) {
            return NextResponse.json({ data: {}, error: { message: 'Forbidden', code: 'forbidden' } }, { status: 403 })
        }

        const supabase = await supabaseServer()
        const { data, error } = await supabase
            .from('store_themes')
            .select('*, themes(name)')
            .eq('store_id', storeId)
            .order('updated_at', { ascending: false })

        if (error) throw error

        return NextResponse.json(
            {
                data: { drafts: data },
                error: null
            },
            { headers: corsHeaders }
        )
    } catch (error: any) {
        return NextResponse.json({ data: {}, error: { message: error.message, code: 'server_error' } })
    }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
    try {
        const { id: storeId } = await params;
        const userId = req.headers.get('x-user-id')

        if (!userId) {
            return NextResponse.json({ data: {}, error: { message: 'Unauthorized', code: 'unauthorized' } }, { status: 401 })
        }

        const hasAccess = await checkStoreAccess(userId, storeId, ['owner', 'manager'])
        if (!hasAccess) {
            return NextResponse.json({ data: {}, error: { message: 'Forbidden', code: 'forbidden' } }, { status: 403 })
        }

        const supabase = await supabaseServer()
        const body = await req.json()
        const { name, theme_id, global_config } = body

        // If global_config is not provided, maybe fetch from theme?
        let finalGlobalConfig = global_config || {}
        if (theme_id && !global_config) {
            const { data: theme } = await supabase.from('store_themes').select('global_config').eq('id', theme_id).single()
            if (theme) finalGlobalConfig = theme.global_config
        }

        const { data: draft, error: draftError } = await supabase
            .from('store_themes')
            .insert({
                store_id: storeId,
                name: name || 'Untitled Draft',
                theme_id,
                global_config: finalGlobalConfig
            })
            .select()
            .single()

        if (draftError) throw draftError

        // Also create initial pages if theme has them
        if (theme_id) {
            // This is a placeholder for where we'd copy pages from a theme template
            // For now, let's just create a Home page
            await supabase.from('store_pages').insert({
                theme_id: draft.id,
                name: 'Home',
                slug: 'home',
                content: []
            })
        }

        return NextResponse.json(
            {
                data: { draft },
                error: null
            },
            { headers: corsHeaders }
        )
    } catch (error: any) {
        return NextResponse.json({ data: {}, error: { message: error.message, code: 'server_error' } })
    }
}
