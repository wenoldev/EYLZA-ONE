/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url)
        console.log({ url });

        const slug = url.searchParams.get('slug')

        if (!slug) {
            return NextResponse.json({ data: {}, error: { message: 'Store slug is required' } }, { status: 400, headers: corsHeaders })
        }

        const supabase = await supabaseServer()

        // Find store by slug
        const { data: store, error: storeError } = await supabase
            .from('stores')
            .select('id')
            .eq('slug', slug)
            .maybeSingle()

        if (storeError) throw storeError
        if (!store) {
            return NextResponse.json({ data: {}, error: { message: 'Store not found' } }, { status: 404, headers: corsHeaders })
        }

        return NextResponse.json({
            data: {
                storeId: store.id
            },
            error: null
        }, { headers: corsHeaders })
    } catch (error: any) {
        return NextResponse.json({ data: {}, error: { message: error.message } }, { status: 500, headers: corsHeaders })
    }
}
