import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // HashRouter uses # for routing which conflicts with Supabase's
    // hash-based token detection. We handle auth redirects manually.
    detectSessionInUrl: false,
  },
})
