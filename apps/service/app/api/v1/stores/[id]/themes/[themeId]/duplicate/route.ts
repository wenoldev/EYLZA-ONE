/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { checkStoreAccess } from '@/_libs/store-access'
import { corsHeaders } from '@/_libs/auth'

interface RouteParams {
  params: Promise<{ id: string; themeId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: storeId, themeId } = await params;
    const userId = req.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ data: {}, error: { message: 'Unauthorized' } }, { status: 401 })
    }

    const hasAccess = await checkStoreAccess(userId, storeId, ['owner', 'manager'])
    if (!hasAccess) {
      return NextResponse.json({ data: {}, error: { message: 'Forbidden' } }, { status: 403 })
    }

    const supabase = await supabaseServer()

    // 1. Fetch the source theme
    const { data: sourceTheme, error: sourceError } = await supabase
      .from('store_themes')
      .select('*')
      .eq('id', themeId)
      .eq('store_id', storeId)
      .single()

    if (sourceError) throw sourceError

    // 2. Fetch the source pages
    const { data: sourcePages, error: pagesError } = await supabase
      .from('store_pages')
      .select('*')
      .eq('theme_id', themeId)

    if (pagesError) throw pagesError

    // 3. Create the new theme
    const { data: newTheme, error: newThemeError } = await supabase
      .from('store_themes')
      .insert({
        store_id: storeId,
        theme_id: sourceTheme.theme_id,
        name: `${sourceTheme.name} (Copy)`,
        global_config: sourceTheme.global_config,
        status: 'draft'
      })
      .select()
      .single()

    if (newThemeError) throw newThemeError

    // 4. Create the new pages
    if (sourcePages && sourcePages.length > 0) {
      const newPages = sourcePages.map(page => ({
        theme_id: newTheme.id,
        name: page.name,
        slug: page.slug,
        content: page.content
      }))

      const { error: insertPagesError } = await supabase
        .from('store_pages')
        .insert(newPages)

      if (insertPagesError) throw insertPagesError
    }

    return NextResponse.json({ data: { theme: newTheme }, error: null }, { headers: corsHeaders })
  } catch (error: any) {
    return NextResponse.json({ data: {}, error: { message: error.message } })
  }
}
