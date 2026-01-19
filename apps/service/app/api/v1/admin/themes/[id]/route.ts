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
        const userRole = req.headers.get('x-user-role')

        if (userRole !== 'admin') {
            return NextResponse.json({ data: {}, error: { message: 'Forbidden' } }, { status: 403 })
        }

        const authHeader = req.headers.get('Authorization')
        const token = authHeader?.replace('Bearer ', '')
        const supabase = supabaseServer(token)

        // Fetch theme template from admin schema
        const { data: theme, error: themeError } = await supabase
            .from('themes')
            .select('*')
            .eq('id', id)
            .single()

        if (themeError) throw themeError

        // Fetch theme template pages from admin schema
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
        return NextResponse.json({ data: {}, error: { message: error.message } }, { status: 500, headers: corsHeaders })
    }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const userRole = req.headers.get('x-user-role')

        if (userRole !== 'admin') {
            return NextResponse.json({ data: {}, error: { message: 'Forbidden: Admin access required' } }, { status: 403 })
        }

        const authHeader = req.headers.get('Authorization')
        const token = authHeader?.replace('Bearer ', '')
        const supabase = supabaseServer(token)
        const body = await req.json()
        const { name, description, preview_url, global_config, pages, ispaid, amount } = body

        // 1. Update theme metadata
        const updateData: any = {}
        if (name !== undefined) updateData.name = name
        if (description !== undefined) updateData.description = description
        if (preview_url !== undefined) updateData.preview_url = preview_url
        if (global_config !== undefined) updateData.global_config = global_config
        if (ispaid !== undefined) updateData.ispaid = ispaid
        if (amount !== undefined) updateData.amount = amount

        if (Object.keys(updateData).length > 0) {
            const { error: themeUpdateError } = await supabase
                .from('themes')
                .update(updateData)
                .eq('id', id)
            if (themeUpdateError) throw themeUpdateError
        }

        // 2. Sync Theme Pages
        if (pages && Array.isArray(pages)) {
            for (const page of pages) {
                const { name: pageName, slug, content } = page

                // Check if page exists for this theme
                const { data: existingPage } = await supabase
                    .from('pages')
                    .select('id')
                    .eq('theme_id', id)
                    .eq('slug', slug)
                    .maybeSingle()

                if (existingPage) {
                    await supabase
                        .from('pages')
                        .update({
                            name: pageName,
                            content,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', existingPage.id)
                } else {
                    await supabase
                        .from('pages')
                        .insert({
                            theme_id: id,
                            name: pageName,
                            slug,
                            content
                        })
                }
            }
        }

        return NextResponse.json({ data: { message: 'Theme template updated successfully' }, error: null }, { headers: corsHeaders })
    } catch (error: any) {
        return NextResponse.json({ data: {}, error: { message: error.message } }, { status: 500, headers: corsHeaders })
    }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const userRole = req.headers.get('x-user-role')

        if (userRole !== 'admin') {
            return NextResponse.json({ data: {}, error: { message: 'Forbidden' } }, { status: 403 })
        }

        const authHeader = req.headers.get('Authorization')
        const token = authHeader?.replace('Bearer ', '')
        const supabase = supabaseServer(token)
        const { error } = await supabase.from('themes').delete().eq('id', id)

        if (error) throw error

        return NextResponse.json({ data: { message: 'Theme deleted' }, error: null }, { headers: corsHeaders })
    } catch (error: any) {
        return NextResponse.json({ data: {}, error: { message: error.message } }, { status: 500, headers: corsHeaders })
    }
}
