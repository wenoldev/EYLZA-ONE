import { NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

export async function PATCH() {
  return NextResponse.json(
    { data: {}, error: { message: 'Feature removed: user_store table deleted', code: 'feature_removed' } },
    { status: 410, headers: corsHeaders }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { data: {}, error: { message: 'Feature removed: user_store table deleted', code: 'feature_removed' } },
    { status: 410, headers: corsHeaders }
  )
}