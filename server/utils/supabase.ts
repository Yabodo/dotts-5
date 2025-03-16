import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { getHeader } from 'h3'

// Validate environment variables
const supabaseUrl = process.env.SUPABASE_PUBLIC_API_BASE
const supabaseServiceKey = process.env.SUPABASE_SECRET

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Supabase environment variables not configured! Please check your .env file'
  )
}

export const supabaseServer = async (event?: H3Event): Promise<SupabaseClient> => {
  // Create the base client
  const client = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false // Disable session persistence for server-side usage
    }
  })

  // Handle potential session forwarding from client
  if (event) {
    try {
      const authHeader = getHeader(event, 'Authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split('Bearer ')[1]
        // Set session from client token
        const { data, error } = await client.auth.setSession({
          access_token: token,
          refresh_token: ''
        })

        if (error) throw error
        if (!data.session) throw new Error('Invalid session')
      }
    } catch (error) {
      console.error('Session handling error:', error)
      // Consider whether to throw or continue without session
    }
  }

  return client
}