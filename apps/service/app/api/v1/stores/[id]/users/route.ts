import { NextResponse } from 'next/server'
import { corsHeaders } from '@/_libs/auth'

export async function GET() {
  return NextResponse.json(
    { data: { store_users: [] }, error: { message: 'Feature removed: user_store table deleted', code: 'feature_removed' } },
    { status: 200, headers: corsHeaders } // Returning 200 with error message in body so clients don't crash hard, or maybe 410? 200 is safer for now.
  )
}

export async function POST() {
  return NextResponse.json(
    { data: {}, error: { message: 'Feature removed: user_store table deleted', code: 'feature_removed' } },
    { status: 410, headers: corsHeaders }
  )
}