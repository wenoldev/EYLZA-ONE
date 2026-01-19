/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

export async function GET() {
    try {
        const supabase = await supabaseServer()
        const { data, error } = await supabase
            .from('themes')
            .select('*')
            .order('created_at', { ascending: false })

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
                data: { themes: data },
                error: null
            },
            { headers: corsHeaders }
        )
    } catch (error: any) {
        return NextResponse.json(
            {
                data: {},
                error: { message: error.message, code: 'server_error' }
            },
            { status: 500, headers: corsHeaders }
        )
    }
}

