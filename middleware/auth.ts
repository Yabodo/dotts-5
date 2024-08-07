import { useSupabaseDatabase } from '~/composables/UseSupabase'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, getUser } = useSupabaseDatabase()

  if (!user.value) {
    await getUser()
  }

  if (!user.value) {
    return navigateTo('/')
  }
})