import { H3Event, createError } from 'h3'
import { supabaseServer } from '~/server/utils/supabase'

export async function validateApiKey(event: H3Event) {
  // Get the Authorization header
  const authHeader = getHeader(event, 'Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: 'Missing or invalid API key'
    })
  }
  
  // Extract the API key
  const apiKey = authHeader.substring(7) // Remove 'Bearer ' prefix
  
  if (!apiKey) {
    throw createError({
      statusCode: 401,
      message: 'API key is required'
    })
  }
  
  // Validate the API key against the database
  const client = await supabaseServer(event)
  
  try {
    // Check if the key exists and is valid
    const { data, error } = await client
      .from('api_keys')
      .select('id, user_id, is_active')
      .eq('key_hash', await client.rpc('crypt', { data: apiKey, key: 'bf' }).single())
      .eq('is_active', true)
      .single()
    
    if (error || !data) {
      throw createError({
        statusCode: 401,
        message: 'Invalid API key'
      })
    }
    
    // Update last_used_at timestamp
    await client
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id)
    
    // Set the user ID in the event context for later use
    event.context.auth = {
      userId: data.user_id
    }
    
    return data.user_id
  } catch (error) {
    console.error('Error validating API key:', error)
    throw createError({
      statusCode: 401,
      message: 'Invalid API key'
    })
  }
}

// Simple rate limiting middleware (basic implementation)
const rateLimits = new Map()

export function rateLimit(event: H3Event, limit = 100, windowMs = 60000) {
  const ip = getRequestIP(event) || 'unknown'
  const now = Date.now()
  const windowStart = now - windowMs
  
  // Initialize or clean up old requests
  if (!rateLimits.has(ip)) {
    rateLimits.set(ip, [])
  }
  
  const requests = rateLimits.get(ip)
  const recentRequests = requests.filter((timestamp: number) => timestamp > windowStart)
  
  // Update the requests array with only recent requests
  rateLimits.set(ip, [...recentRequests, now])
  
  if (recentRequests.length >= limit) {
    throw createError({
      statusCode: 429,
      message: 'Too many requests, please try again later'
    })
  }
}