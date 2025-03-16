import { supabaseServer } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const keyName = body.name

  if (!keyName || typeof keyName !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'Key name is required and must be a string'
    })
  }

  const client = await supabaseServer(event)

  try {
    const { data, error } = await client
      .rpc('generate_api_key', { key_name: keyName })
      .single()

    if (error) throw error

    return {
      key: data,
      name: keyName,
      message: 'API key generated successfully. Save this key as it won\'t be shown again.'
    }
  } catch (error) {
    console.error('Error generating API key:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to generate API key'
    })
  }
})