/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { checkStoreAccess } from '@/_libs/store-access'
import { corsHeaders } from '@/_libs/auth'

interface RouteParams {
    params: Promise<{ id: string; draftId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { id: storeId, draftId } = await params;
        const userId = req.headers.get('x-user-id')

        if (!userId) {
            return NextResponse.json({ data: {}, error: { message: 'Unauthorized', code: 'unauthorized' } }, { status: 401 })
        }

        const hasAccess = await checkStoreAccess(userId, storeId, ['owner', 'manager', 'editor'])
        if (!hasAccess) {
            return NextResponse.json({ data: {}, error: { message: 'Forbidden', code: 'forbidden' } }, { status: 403 })
        }

        const supabase = await supabaseServer()

        // Fetch draft info
        const { data: draft, error: draftError } = await supabase
            .from('store_themes')
            .select('*')
            .eq('id', draftId)
            .eq('store_id', storeId)
            .single()

        if (draftError) throw draftError

        // Fetch pages for this draft
        const { data: pages, error: pagesError } = await supabase
            .from('store_pages')
            .select('*')
            .eq('theme_id', draftId)

        if (pagesError) throw pagesError

        return NextResponse.json(
            {
                data: {
                    draft: {
                        ...draft,
                        pages
                    }
                },
                error: null
            },
            { headers: corsHeaders }
        )
    } catch (error: any) {
        return NextResponse.json({ data: {}, error: { message: error.message, code: 'server_error' } })
    }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
    try {
        const { id: storeId, draftId } = await params;
        const userId = req.headers.get('x-user-id')

        if (!userId) {
            return NextResponse.json({ data: {}, error: { message: 'Unauthorized', code: 'unauthorized' } }, { status: 401 })
        }

        const hasAccess = await checkStoreAccess(userId, storeId, ['owner', 'manager', 'editor'])
        if (!hasAccess) {
            return NextResponse.json({ data: {}, error: { message: 'Forbidden', code: 'forbidden' } }, { status: 403 })
        }

        const supabase = await supabaseServer()
        const body = await req.json()
        const { name, global_config, pages } = body

        // 1. Update draft info if provided
        if (name !== undefined || global_config !== undefined) {
            const updateData: any = {}
            if (name !== undefined) updateData.name = name
            if (global_config !== undefined) updateData.global_config = global_config
            updateData.updated_at = new Date().toISOString()

            const { error: updateError } = await supabase
                .from('store_themes')
                .update(updateData)
                .eq('id', draftId)
                .eq('store_id', storeId)

            if (updateError) throw updateError
        }

        // 2. Update pages if provided
        if (pages && Array.isArray(pages)) {
            // We do a "sync" of pages. For simplicity in this implementation, 
            // we'll loop through provided pages and update/insert them.
            // In a real app, you might want a more sophisticated sync.

            for (const page of pages) {
                const { name, slug, content } = page

                // Check if page exists
                const { data: existingPage } = await supabase
                    .from('store_pages')
                    .select('id')
                    .eq('theme_id', draftId)
                    .eq('slug', slug)
                    .maybeSingle()

                if (existingPage) {
                    await supabase
                        .from('store_pages')
                        .update({ name, content, updated_at: new Date().toISOString() })
                        .eq('id', existingPage.id)
                } else {
                    await supabase
                        .from('store_pages')
                        .insert({ theme_id: draftId, name, slug, content })
                }
            }
        }

        return NextResponse.json(
            {
                data: { message: 'Draft updated successfully' },
                error: null
            },
            { headers: corsHeaders }
        )
    } catch (error: any) {
        return NextResponse.json({ data: {}, error: { message: error.message, code: 'server_error' } })
    }
}
