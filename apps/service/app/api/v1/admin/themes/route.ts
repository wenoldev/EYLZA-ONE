/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

export async function GET(req: NextRequest) {
    try {
        const userRole = req.headers.get('x-user-role')

        if (userRole !== 'admin') {
            return NextResponse.json(
                {
                    data: {},
                    error: { message: 'Forbidden: Admin access required', code: 'insufficient_permissions' }
                },
                { status: 403, headers: corsHeaders }
            )
        }

        const authHeader = req.headers.get('Authorization')
        const token = authHeader?.replace('Bearer ', '')
        const supabase = supabaseServer(token)
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

export async function POST(req: NextRequest) {
    try {
        const userRole = req.headers.get('x-user-role')
        console.log('POST /admin/themes userRole:', userRole)

        if (userRole !== 'admin') {
            return NextResponse.json(
                {
                    data: {},
                    error: { message: 'Forbidden: Admin access required', code: 'insufficient_permissions' }
                },
                { status: 403, headers: corsHeaders }
            )
        }

        const authHeader = req.headers.get('Authorization')
        const token = authHeader?.replace('Bearer ', '')
        const supabase = supabaseServer(token)

        const body = await req.json()
        console.log('POST /admin/themes body:', body)
        const { name, global_config, pages, ispaid, amount } = body

        if (!name || !global_config) {
            return NextResponse.json(
                {
                    data: {},
                    error: { message: 'Name and global_config are required', code: 'invalid_input' }
                },
                { status: 400, headers: corsHeaders }
            )
        }

        const { data: theme, error: themeError } = await supabase
            .from('themes')
            .insert({
                name,
                global_config,
                ispaid: ispaid || false,
                amount: amount || null
            })
            .select()
            .single()

        if (themeError) {
            console.error('Theme creation error:', themeError)
            return NextResponse.json(
                {
                    data: {},
                    error: { message: themeError.message, code: themeError.code }
                },
                { status: 500, headers: corsHeaders }
            )
        }

        // Insert pages if provided
        if (theme && pages && Array.isArray(pages) && pages.length > 0) {
            const pagesToInsert = pages.map((page: any) => ({
                theme_id: theme.id,
                name: page.name,
                slug: page.slug,
                content: page.content || []
            }))

            const { error: pagesError } = await supabase
                .from('pages')
                .insert(pagesToInsert)

            if (pagesError) {
                console.error('Failed to insert pages:', pagesError)
            }
        }

        return NextResponse.json(
            {
                data: { theme },
                error: null
            },
            { headers: corsHeaders }
        )
    } catch (error: any) {
        console.error('POST /admin/themes error:', error)
        return NextResponse.json(
            {
                data: {},
                error: { message: error.message, code: 'server_error' }
            },
            { status: 500, headers: corsHeaders }
        )
    }
}
