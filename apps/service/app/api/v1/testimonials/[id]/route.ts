/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { checkStoreAccess } from '@/_libs/store-access'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = req.headers.get('x-user-id')
        if (!userId) {
            return NextResponse.json(
                { data: {}, error: { message: 'Unauthorized', code: 'unauthorized' } },
                { status: 401, headers: corsHeaders }
            )
        }

        const { id } = await params
        const supabase = await supabaseServer()

        const { data: testimonial, error: fetchError } = await supabase
            .from('testimonials')
            .select('*')
            .eq('id', id)
            .single()

        if (fetchError || !testimonial) {
            return NextResponse.json(
                { data: {}, error: { message: 'Testimonial not found', code: 'not_found' } },
                { status: 404, headers: corsHeaders }
            )
        }

        const hasAccess = await checkStoreAccess(userId, testimonial.store_id)
        if (!hasAccess) {
            return NextResponse.json(
                { data: {}, error: { message: 'Forbidden', code: 'forbidden' } },
                { status: 403, headers: corsHeaders }
            )
        }

        return NextResponse.json({ data: { testimonial }, error: null }, { headers: corsHeaders })
    } catch (error: any) {
        return NextResponse.json(
            { data: {}, error: { message: error.message, code: 'server_error' } },
            { status: 500, headers: corsHeaders }
        )
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = req.headers.get('x-user-id')
        if (!userId) {
            return NextResponse.json(
                { data: {}, error: { message: 'Unauthorized', code: 'unauthorized' } },
                { status: 401, headers: corsHeaders }
            )
        }

        const { id } = await params
        const body = await req.json()
        const supabase = await supabaseServer()

        // First check if user has access to this testimonial's store
        const { data: testimonial, error: fetchError } = await supabase
            .from('testimonials')
            .select('store_id')
            .eq('id', id)
            .single()

        if (fetchError || !testimonial) {
            return NextResponse.json(
                { data: {}, error: { message: 'Testimonial not found', code: 'not_found' } },
                { status: 404, headers: corsHeaders }
            )
        }

        const hasAccess = await checkStoreAccess(userId, testimonial.store_id)
        if (!hasAccess) {
            return NextResponse.json(
                { data: {}, error: { message: 'Forbidden', code: 'forbidden' } },
                { status: 403, headers: corsHeaders }
            )
        }

        const { data, error } = await supabase
            .from('testimonials')
            .update({
                name: body.name,
                review: body.review,
                profile_image: body.profile_image,
                meta_data: body.meta_data,
            })
            .eq('id', id)
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

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = req.headers.get('x-user-id')
        if (!userId) {
            return NextResponse.json(
                { data: {}, error: { message: 'Unauthorized', code: 'unauthorized' } },
                { status: 401, headers: corsHeaders }
            )
        }

        const { id } = await params
        const supabase = await supabaseServer()

        const { data: testimonial, error: fetchError } = await supabase
            .from('testimonials')
            .select('store_id')
            .eq('id', id)
            .single()

        if (fetchError || !testimonial) {
            return NextResponse.json(
                { data: {}, error: { message: 'Testimonial not found', code: 'not_found' } },
                { status: 404, headers: corsHeaders }
            )
        }

        const hasAccess = await checkStoreAccess(userId, testimonial.store_id)
        if (!hasAccess) {
            return NextResponse.json(
                { data: {}, error: { message: 'Forbidden', code: 'forbidden' } },
                { status: 403, headers: corsHeaders }
            )
        }

        const { error } = await supabase.from('testimonials').delete().eq('id', id)

        if (error) {
            return NextResponse.json(
                { data: {}, error: { message: error.message, code: 'database_error' } },
                { status: 500, headers: corsHeaders }
            )
        }

        return NextResponse.json({ data: { success: true }, error: null }, { headers: corsHeaders })
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
