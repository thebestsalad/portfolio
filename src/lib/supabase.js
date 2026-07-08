import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Anon key is safe to ship in the bundle by design. All write protection
// lives in Postgres Row Level Security, never in this client.
export const supabase = url && anonKey ? createClient(url, anonKey) : null

export const supabaseConfigured = Boolean(supabase)
