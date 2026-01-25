/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'
import { checkStoreAccess } from '@/_libs/store-access'

export async function POST(req: NextRequest) {
    try {
        const userId = req.headers.get('x-user-id')

        const formData = await req.formData()
        // Support both 'files' (array) and 'file' (single)
        let files = formData.getAll('files') as (File | string)[]
        if (files.length === 0) {
            const singleFile = formData.get('file')
            if (singleFile) {
                files = [singleFile]
            }
        }

        const store_id = formData.get('store_id') as string
        const bucket = formData.get('bucket') as string || 'public'

        if (!store_id) {
            return NextResponse.json(
                {
                    data: {},
                    error: { message: 'Store ID is required', code: 'missing_store_id' }
                },
                { status: 400, headers: corsHeaders }
            )
        }

        if (!files || files.length === 0) {
            return NextResponse.json(
                {
                    data: {},
                    error: { message: 'No files provided', code: 'missing_files' }
                },
                { status: 400, headers: corsHeaders }
            )
        }

        // Only check access if userId is provided (authenticated user)
        // For public uploads, we allow it if store_id is provided
        if (userId) {
            const hasAccess = await checkStoreAccess(userId, store_id)
            if (!hasAccess) {
                return NextResponse.json(
                    {
                        data: {},
                        error: { message: 'Forbidden', code: 'forbidden' }
                    },
                    { status: 403, headers: corsHeaders }
                )
            }
        }


        const supabase = await supabaseServer()
        const uploadResults = []

        for (const file of files) {
            if (!(file instanceof File)) continue;

            // Generate unique filename within the store_id/meta_data folder
            const fileExt = file.name.split('.').pop()
            const fileName = `${store_id}/meta_data/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(fileName, file)

            if (error) {
                uploadResults.push({
                    fileName: file.name,
                    status: 'error',
                    error: error.message
                })
                continue
            }

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName)

            uploadResults.push({
                fileName: file.name,
                status: 'success',
                path: data.path,
                publicUrl
            })
        }

        return NextResponse.json(
            {
                data: {
                    results: uploadResults
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
                    message: error.message || 'Failed to upload files',
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
