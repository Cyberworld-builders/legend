import { createClient, Session } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'

// Only create Supabase client if we have valid environment variables
let supabaseClient: any = null

if (supabaseUrl && supabaseUrl !== 'your_supabase_url' && supabaseUrl.startsWith('https://')) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
} else {
  // Create a mock client for development when Supabase is not configured
  console.warn('Supabase not configured - using mock client for development')
  supabaseClient = {
    auth: {
      signUp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: { message: 'Supabase not configured' } }),
      getSession: async () => ({ data: { session: null }, error: { message: 'Supabase not configured' } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    }
  }
}

// Export the supabase client
export const supabase = supabaseClient

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabaseClient.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabaseClient.auth.getUser()
  return { user, error }
}

export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
  return supabaseClient.auth.onAuthStateChange(callback)
} 