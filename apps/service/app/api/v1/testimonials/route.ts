/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { checkStoreAccess } from '@/_libs/store-access'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

export async function GET(req: NextRequest) {
    try {
        const userId = req.headers.get('x-user-id')
        if (!userId) {
            return NextResponse.json(
                { data: {}, error: { message: 'Unauthorized', code: 'unauthorized' } },
                { status: 401, headers: corsHeaders }
            )
        }

        const { searchParams } = new URL(req.url)
        const store_id = searchParams.get('store_id')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')

        if (!store_id) {
            return NextResponse.json(
                { data: {}, error: { message: 'Store ID is required', code: 'missing_store_id' } },
                { status: 400, headers: corsHeaders }
            )
        }

        const hasAccess = await checkStoreAccess(userId, store_id)
        if (!hasAccess) {
            return NextResponse.json(
                { data: {}, error: { message: 'Forbidden', code: 'forbidden' } },
                { status: 403, headers: corsHeaders }
            )
        }

        const supabase = await supabaseServer()
        const { data, error, count } = await supabase
            .from('testimonials')
            .select('*', { count: 'exact' })
            .eq('store_id', store_id)
            .range((page - 1) * limit, page * limit - 1)
            .order('created_at', { ascending: false })

        if (error) {
            return NextResponse.json(
                { data: {}, error: { message: error.message, code: 'database_error' } },
                { status: 500, headers: corsHeaders }
            )
        }

        return NextResponse.json(
            {
                data: {
                    testimonials: data,
                    pagination: { page, limit, total: count || 0 }
                },
                error: null
            },
            { headers: corsHeaders }
        )
    } catch (error: any) {
        return NextResponse.json(
            { data: {}, error: { message: error.message, code: 'server_error' } },
            { status: 500, headers: corsHeaders }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const userId = req.headers.get('x-user-id')
        if (!userId) {
            return NextResponse.json(
                { data: {}, error: { message: 'Unauthorized', code: 'unauthorized' } },
                { status: 401, headers: corsHeaders }
            )
        }

        const body = await req.json()
        const { store_id, name, review, profile_image, meta_data } = body

        if (!store_id || !name || !review) {
            return NextResponse.json(
                { data: {}, error: { message: 'Missing required fields', code: 'invalid_input' } },
                { status: 400, headers: corsHeaders }
            )
        }

        const hasAccess = await checkStoreAccess(userId, store_id)
        if (!hasAccess) {
            return NextResponse.json(
                { data: {}, error: { message: 'Forbidden', code: 'forbidden' } },
                { status: 403, headers: corsHeaders }
            )
        }

        const supabase = await supabaseServer()
        const { data, error } = await supabase
            .from('testimonials')
            .insert({
                store_id,
                name,
                review,
                profile_image,
                meta_data: meta_data || {}
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json(
                { data: {}, error: { message: error.message, code: 'database_error' } },
                { status: 500, headers: corsHeaders }
            )
        }

        return NextResponse.json({ data: { testimonial: data }, error: null }, { headers: corsHeaders })
    } catch (error: any) {
        return NextResponse.json(
            { data: {}, error: { message: error.message, code: 'server_error' } },
            { status: 500, headers: corsHeaders }
        )
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}
