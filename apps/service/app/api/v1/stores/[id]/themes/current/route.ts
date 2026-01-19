/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { checkStoreAccess } from '@/_libs/store-access'
import { corsHeaders } from '@/_libs/auth'

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
    try {
        const { id: storeId } = await params;
        const userId = req.headers.get('x-user-id')

        if (!userId) {
            return NextResponse.json({ data: {}, error: { message: 'Unauthorized' } }, { status: 401 })
        }

        // Only owners can publish a theme to production
        const hasAccess = await checkStoreAccess(userId, storeId, ['owner'])
        if (!hasAccess) {
            return NextResponse.json({ data: {}, error: { message: 'Forbidden: Owner access required' } }, { status: 403 })
        }

        const supabase = await supabaseServer()
        const body = await req.json()
        const { themeId } = body

        if (!themeId) {
            return NextResponse.json({ data: {}, error: { message: 'themeId is required' } }, { status: 400 })
        }

        // 1. Get current published theme
        const { data: currentPublished } = await supabase
            .from('store_themes')
            .select('id')
            .eq('store_id', storeId)
            .eq('status', 'published')
            .maybeSingle()

        // 2. Transaction-like update: set old to draft, new to published
        if (currentPublished) {
            await supabase
                .from('store_themes')
                .update({ status: 'draft' })
                .eq('id', currentPublished.id)
        }

        const { data, error } = await supabase
            .from('store_themes')
            .update({ status: 'published', updated_at: new Date().toISOString() })
            .eq('id', themeId)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({
            data: { message: 'Theme published successfully', theme: data },
            error: null
        }, { headers: corsHeaders })
    } catch (error: any) {
        return NextResponse.json({ data: {}, error: { message: error.message } })
    }
}
