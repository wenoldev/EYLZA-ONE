import { supabaseServer } from './supabase'

export async function getUser() {
  const supabase = await supabaseServer()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}