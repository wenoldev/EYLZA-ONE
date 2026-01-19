/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = await supabaseServer()

        // Fetch theme template
        const { data: theme, error: themeError } = await supabase
            .from('themes')
            .select('*')
            .eq('id', id)
            .single()

        if (themeError) throw themeError

        // Fetch theme template pages
        const { data: pages, error: pagesError } = await supabase
            .from('pages')
            .select('*')
            .eq('theme_id', id)

        if (pagesError) throw pagesError

        return NextResponse.json({
            data: { theme: { ...theme, pages } },
            error: null
        }, { headers: corsHeaders })
    } catch (error: any) {
        return NextResponse.json({ data: {}, error: { message: error.message } })
    }
}


