/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url)
        const storeUrl = url.searchParams.get('url')
        const storeSearchId = url.searchParams.get('storeId')
        const storeIdHeader = req.headers.get('x-store-id')
        const storeId = storeSearchId || storeIdHeader

        if (!storeUrl && !storeId) {
            return NextResponse.json({ data: {}, error: { message: 'Store URL or Store ID is required' } }, { status: 400, headers: corsHeaders })
        }

        const supabase = await supabaseServer()
        let store: any = null

        if (storeId) {
            const { data: storeData, error: storeError } = await supabase
                .from('stores')
                .select('*')
                .eq('id', storeId)
                .maybeSingle()
            if (storeError) throw storeError
            store = storeData
        } else if (storeUrl) {
            // Extract slug from URL
            const slug = storeUrl.replace(/^https?:\/\//, '').split('.')[0]

            // Find store by slug
            const { data: storeData, error: storeError } = await supabase
                .from('stores')
                .select('*')
                .eq('slug', slug)
                .maybeSingle()

            if (storeError) throw storeError
            store = storeData
        }

        if (!store) {
            return NextResponse.json({ data: {}, error: { message: 'Store not found' } }, { status: 404, headers: corsHeaders })
        }

        // Find published theme
        const { data: theme, error: themeError } = await supabase
            .from('store_themes')
            .select('*')
            .eq('store_id', store.id)
            .eq('status', 'published')
            .maybeSingle()

        if (themeError) throw themeError
        if (!theme) {
            return NextResponse.json({
                data: {
                    store,
                    theme: null
                },
                error: { message: 'No published theme found' }
            }, { headers: corsHeaders })
        }

        // Find pages for theme
        const { data: pages, error: pagesError } = await supabase
            .from('store_pages')
            .select('*')
            .eq('theme_id', theme.id)

        if (pagesError) throw pagesError

        return NextResponse.json({
            data: {
                store,
                theme: { ...theme, pages }
            },
            error: null
        }, { headers: corsHeaders })
    } catch (error: any) {
        return NextResponse.json({ data: {}, error: { message: error.message } }, { status: 500, headers: corsHeaders })
    }
}
