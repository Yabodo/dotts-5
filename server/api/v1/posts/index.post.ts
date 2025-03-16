import { validateApiKey, rateLimit } from '~/server/utils/apiAuth'
import { supabaseServer } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  // Validate API key and apply rate limiting
  await validateApiKey(event)
  rateLimit(event)
  
  // Get request body
  const body = await readBody(event)
  const { content } = body
  
  if (!content || typeof content !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'Content is required and must be a string'
    })
  }
  
  const client = await supabaseServer(event)
  const userId = event.context.auth.userId
  
  try {
    // Create new post
    const { data, error } = await client
      .from('posts')
      .insert([{ 
        note: JSON.stringify(body),
        user_id: userId
      }])
      .select()
    
    if (error) throw error
    
    return {
      success: true,
      post: data[0]
    }
  } catch (error) {
    console.error('Error creating post:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create post'
    })
  }
})