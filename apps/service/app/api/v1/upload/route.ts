/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

export async function POST(req: NextRequest) {
  try {
    // Get user info from headers set by middleware
    const userId = req.headers.get('x-user-id')
    // const userRole = req.headers.get('x-user-role')

    if (!userId) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Unauthorized: Missing user ID', code: 'missing_user_id' }
        },
        { status: 401, headers: corsHeaders }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const bucket = formData.get('bucket') as string || 'public'
    const folder = formData.get('folder') as string || 'uploads'

    // Input validation
    if (!file) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'No file provided', code: 'missing_file' }
        },
        { status: 400, headers: corsHeaders }
      )
    }

    const supabase = await supabaseServer()

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)

    if (error) {
      return NextResponse.json(
        {
          data: {},
          error: { message: error.message, code: 'storage_error' }
        },
        { status: 500, headers: corsHeaders }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return NextResponse.json(
      {
        data: {
          path: data.path,
          publicUrl,
          fileName
        },
        error: null
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || 'Failed to upload file',
          code: 'server_error'
        }
      },
      { status: 500, headers: corsHeaders }
    )
  }
}

