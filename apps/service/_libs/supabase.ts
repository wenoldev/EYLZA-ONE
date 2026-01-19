import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

export function supabase(token?: string) {
  return createClient<Database, 'public'>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      global: {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }
    }
  )
}

// Alias for backward compatibility (defaults to public)
export const supabaseServer = supabase