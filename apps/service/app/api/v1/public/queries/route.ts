/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { store_id, name, email, phone, message, meta } = body

        // Input validation
        if (!store_id || !message) {
            return NextResponse.json(
                {
                    data: {},
                    error: { message: 'Store ID and message are required', code: 'invalid_input' }
                },
                { status: 400, headers: corsHeaders }
            )
        }

        const supabase = await supabaseServer()

        const { data, error } = await supabase
            .from('customer_queries')
            .insert({
                store_id,
                user_id: null,
                name: name || null,
                email: email || null,
                phone: phone || null,
                message,
                meta_data: meta || {},
                status: 'open'
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json(
                {
                    data: {},
                    error: { message: error.message, code: 'database_error' }
                },
                { status: 500, headers: corsHeaders }
            )
        }

        return NextResponse.json(
            {
                data: { query: data },
                error: null
            },
            { headers: corsHeaders }
        )
    } catch (error: any) {
        return NextResponse.json(
            {
                data: {},
                error: {
                    message: error.message || 'Failed to submit query',
                    code: 'server_error'
                }
            },
            { status: 500, headers: corsHeaders }
        )
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}
