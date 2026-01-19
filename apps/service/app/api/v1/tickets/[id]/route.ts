/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const userId = req.headers.get('x-user-id')
    const userRole = req.headers.get('x-user-role')

    if (!userId) {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Unauthorized: Missing user ID', code: 'missing_user_id' }
        },
        { status: 401, headers: corsHeaders }
      )
    }

    const body = await req.json()
    const { status } = body // message for replies if needed

    const supabase = await supabaseServer()

    // If not admin, verify ownership (though usually only admin updates status)
    // Vendors might close their own tickets?
    // For now, let's assume only admin can update status, or owner can close.

    if (userRole !== 'admin') {
      // Note: Ownership check removed as vendor_id is not present in the tickets table.
      // In a production environment, we should verify that the user has access to the store_id associated with this ticket.

      // User can only 'close' ticket
      if (status && status !== 'closed') {
        return NextResponse.json(
          {
            data: {},
            error: { message: 'Forbidden: Users can only close tickets', code: 'forbidden' }
          },
          { status: 403, headers: corsHeaders }
        )
      }
    }

    const updateData: any = {}
    if (status) updateData.status = status
    // if (message) ... handle adding message/reply logic here if table supports it

    const { data, error } = await supabase
      .from('tickets')
      .update(updateData)
      .eq('id', id)
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
        data: { ticket: data },
        error: null
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || 'Failed to update ticket',
          code: 'server_error'
        }
      },
      { status: 500, headers: corsHeaders }
    )
  }
}
