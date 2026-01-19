/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { id: storeId } = await params;
        const supabase = await supabaseServer()

        const { data: theme, error: themeError } = await supabase
            .from('store_themes')
            .select('*')
            .eq('store_id', storeId)
            .eq('status', 'published')
            .maybeSingle()

        if (themeError) throw themeError
        if (!theme) {
            return NextResponse.json({ data: { theme: null }, error: { message: 'No published theme found' } })
        }

        const { data: pages, error: pagesError } = await supabase
            .from('store_pages')
            .select('*')
            .eq('theme_id', theme.id)

        if (pagesError) throw pagesError

        return NextResponse.json({
            data: { theme: { ...theme, pages } },
            error: null
        }, { headers: corsHeaders })
    } catch (error: any) {
        return NextResponse.json({ data: {}, error: { message: error.message } })
    }
}
