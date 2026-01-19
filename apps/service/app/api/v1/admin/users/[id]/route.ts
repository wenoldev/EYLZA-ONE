/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const userRole = req.headers.get('x-user-role')

    if (userRole !== 'admin') {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Forbidden: Only admin can delete users', code: 'forbidden' }
        },
        { status: 403, headers: corsHeaders }
      )
    }

    const supabase = await supabaseServer()

    const { error } = await supabase.auth.admin.deleteUser(id)

    if (error) {
      return NextResponse.json(
        {
          data: {},
          error: { message: error.message, code: 'auth_error' }
        },
        { status: 500, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      {
        data: { message: 'User deleted successfully' },
        error: null
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || 'Failed to delete user',
          code: 'server_error'
        }
      },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const userRole = req.headers.get('x-user-role')

    if (userRole !== 'admin') {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Forbidden: Only admin can manage users', code: 'forbidden' }
        },
        { status: 403, headers: corsHeaders }
      )
    }

    const body = await req.json()
    const { action, ban_duration } = body

    const supabase = await supabaseServer()

    if (action === 'ban') {
      // Calculate ban duration if needed, or use permanent
      const duration = ban_duration ? `${ban_duration}s` : '876000h'

      // Alternatively, update `banned_until` directly if possible, but `updateUserById` is safer.
      // Let's try updating user_metadata as a fallback or primary way if we handle ban logic in app.
      // But user asked to "ban user".
      // Let's use `ban_duration: '876000h'` (100 years) for permanent ban.

      const { error: banError } = await supabase.auth.admin.updateUserById(id, {
        ban_duration: duration
      })

      if (banError) throw banError

    } else if (action === 'unban') {
      const { error: unbanError } = await supabase.auth.admin.updateUserById(id, {
        ban_duration: '0s'
      })
      if (unbanError) throw unbanError

    } else if (action === 'reset_password') {
      // We need email to send reset password email.
      // Fetch user first.
      const { data: { user }, error: fetchError } = await supabase.auth.admin.getUserById(id)
      if (fetchError || !user || !user.email) {
        return NextResponse.json(
          {
            data: {},
            error: { message: 'User not found or no email', code: 'user_not_found' }
          },
          { status: 404, headers: corsHeaders }
        )
      }

      // Send password reset email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(user.email)
      if (resetError) throw resetError

      return NextResponse.json(
        {
          data: { message: 'Password reset email sent' },
          error: null
        },
        { headers: corsHeaders }
      )
    } else {
      return NextResponse.json(
        {
          data: {},
          error: { message: 'Invalid action', code: 'invalid_action' }
        },
        { status: 400, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      {
        data: { message: `User ${action} successful` },
        error: null
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {},
        error: {
          message: error.message || 'Failed to update user',
          code: 'server_error'
        }
      },
      { status: 500, headers: corsHeaders }
    )
  }
}
