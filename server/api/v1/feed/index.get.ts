import { validateApiKey, rateLimit } from '~/server/utils/apiAuth'
import { supabaseServer } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  // Validate API key and apply rate limiting
  const userId = await validateApiKey(event)
  rateLimit(event)
  
  // Get query parameters
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 0
  
  const client = await supabaseServer(event)
  
  try {
    // Get feed posts
    const { data, error } = await client
      .rpc('get_posts_from_followed_users_and_me', { 
        user_uuid: userId, 
        page_size: 20, 
        page 
      })
    
    if (error) throw error
    
    return {
      success: true,
      posts: data,
      page
    }
  } catch (error) {
    console.error('Error fetching feed:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch feed'
    })
  }
})