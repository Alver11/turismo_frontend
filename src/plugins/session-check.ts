import { definePlugin } from '/@src/app'
import { useUserSession } from '/@src/stores/userSession'
import { useApi } from '/@src/composable/useApi'

export default definePlugin(async ({ router, pinia }) => {
  const userSession = useUserSession(pinia)
  const api = useApi()

  // 1. Check token validity at app startup
  if (userSession.isLoggedIn) {
    try {
      const { data: user } = await api.get('/user')
      userSession.setUser(user)
    } catch (err) {
      await userSession.logoutUser()
    }
  }

  router.beforeEach((to) => {
    if (to.meta.requiresAuth && !userSession.isLoggedIn) {
      return {
        name: 'login',
        query: { redirect: to.fullPath },
      }
    }
  })
})
