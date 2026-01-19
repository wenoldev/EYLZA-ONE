/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { checkStoreAccess } from '@/_libs/store-access'
import { corsHeaders } from '@/_libs/auth'

interface RouteParams {
    params: Promise<{ id: string; themeId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
    try {
        const { id: storeId, themeId } = await params;
        const userId = req.headers.get('x-user-id')

        if (!userId) {
            return NextResponse.json({ data: {}, error: { message: 'Unauthorized' } }, { status: 401 })
        }

        const hasAccess = await checkStoreAccess(userId, storeId, ['owner'])
        if (!hasAccess) {
            return NextResponse.json({ data: {}, error: { message: 'Forbidden' } }, { status: 403 })
        }

        const supabase = await supabaseServer()

        // 1. Unpublish current
        await supabase
            .from('store_themes')
            .update({ status: 'draft' })
            .eq('store_id', storeId)
            .eq('status', 'published')

        // 2. Publish new one
        const { data, error } = await supabase
            .from('store_themes')
            .update({ status: 'published', updated_at: new Date().toISOString() })
            .eq('id', themeId)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ data: { theme: data }, error: null }, { headers: corsHeaders })
    } catch (error: any) {
        return NextResponse.json({ data: {}, error: { message: error.message } })
    }
}
