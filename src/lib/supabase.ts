import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'https://your-project.supabase.co' || 
    supabaseAnonKey === 'your_supabase_anon_key_here') {
  console.error('⚠️ Missing or invalid Supabase environment variables!')
  console.error('Please create a .env file in the root directory with:')
  console.error('  VITE_SUPABASE_URL=your_supabase_url')
  console.error('  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key')
  console.error('  VITE_BACKEND_API_URL=http://localhost:4000')
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

