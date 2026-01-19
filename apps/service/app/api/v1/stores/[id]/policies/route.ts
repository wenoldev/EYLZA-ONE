/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
// import { checkStoreAccess } from '@/_libs/store-access'
import { corsHeaders } from '@/_libs/auth'

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * GET all policies for a store
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = await supabaseServer()

        // In this project, 'vendor' schema is used for store-related tables
        const { data, error } = await (supabase as any)
            .from('store_policy')
            .select('*')
            .eq('store_id', id)

        if (error) {
            return NextResponse.json(
                {
                    data: [],
                    error: { message: error.message, code: 'database_error' }
                },
                { status: 500, headers: corsHeaders }
            )
        }

        return NextResponse.json(
            {
                data: data || [],
                error: null
            },
            { headers: corsHeaders }
        )
    } catch (error: any) {
        return NextResponse.json(
            {
                data: [],
                error: {
                    message: error.message || 'Failed to fetch policies',
                    code: 'server_error'
                }
            },
            { status: 500, headers: corsHeaders }
        )
    }
}

/**
 * POST/PUT a policy (upsert based on store_id and name/label)
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
    try {
        const userId = req.headers.get('x-user-id')
        const { id } = await params;

        if (!userId) {
            return NextResponse.json(
                {
                    data: {},
                    error: { message: 'Unauthorized: Missing user ID', code: 'missing_user_id' }
                },
                { status: 401, headers: corsHeaders }
            )
        }

        // Check if user has owner/manager access to this store
        // const hasAccess = await checkStoreAccess(userId, id, ['owner', 'manager'])
        // if (!hasAccess) {
        //     return NextResponse.json(
        //         {
        //             data: {},
        //             error: { message: 'Forbidden: Owner/manager access required', code: 'insufficient_permissions' }
        //         },
        //         { status: 403, headers: corsHeaders }
        //     )
        // }

        const supabase = await supabaseServer()
        const body = await req.json()

        if (!body || !body.name || !body.content) {
            return NextResponse.json(
                {
                    data: {},
                    error: { message: 'Missing required fields: name, content', code: 'invalid_input' }
                },
                { status: 400, headers: corsHeaders }
            )
        }

        // Prepare policy data
        const policyData = {
            store_id: id,
            name: body.name,
            label: body.label || body.name,
            content: body.content,
            updated_at: new Date().toISOString()
        }

        // Upsert the policy (assuming (store_id, name) is unique)
        const { data, error } = await (supabase as any)
            .from('store_policy')
            .upsert(policyData, { onConflict: 'store_id,name' })
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
                data: data,
                error: null
            },
            { headers: corsHeaders }
        )
    } catch (error: any) {
        return NextResponse.json(
            {
                data: {},
                error: {
                    message: error.message || 'Failed to save policy',
                    code: 'server_error'
                }
            },
            { status: 500, headers: corsHeaders }
        )
    }
}

// OPTIONS for CORS
export async function OPTIONS() {
    return new NextResponse(null, { headers: corsHeaders })
}
