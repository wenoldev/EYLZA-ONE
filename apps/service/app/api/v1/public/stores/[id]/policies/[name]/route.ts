/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

interface RouteParams {
    params: Promise<{ id: string; name: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { id, name } = await params;
        const supabase = await supabaseServer()

        const { data, error } = await (supabase as any)
            .from('store_policy')
            .select('*')
            .eq('store_id', id)
            .eq('name', name)
            .maybeSingle()

        if (error) {
            return NextResponse.json(
                {
                    data: null,
                    error: { message: error.message, code: 'database_error' }
                },
                { status: 500, headers: corsHeaders }
            )
        }

        if (!data) {
            return NextResponse.json(
                {
                    data: null,
                    error: { message: 'Policy not found', code: 'not_found' }
                },
                { status: 404, headers: corsHeaders }
            )
        }

        return NextResponse.json(
            {
                data: data,
                error: null
            },
            { headers: corsHeaders }
        )
    } catch (error: any) {
        return NextResponse.json(
            {
                data: null,
                error: {
                    message: error.message || 'Failed to fetch policy',
                    code: 'server_error'
                }
            },
            { status: 500, headers: corsHeaders }
        )
    }
}

export async function OPTIONS() {
    return new NextResponse(null, { headers: corsHeaders })
}
