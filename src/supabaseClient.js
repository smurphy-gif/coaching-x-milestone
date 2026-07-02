import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠️ Missing Supabase credentials.\n' +
    'Copy .env.example to .env and add your Supabase URL and anon key.\n' +
    'Get them from: https://supabase.com/dashboard → Settings → API'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
