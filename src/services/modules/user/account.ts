import { useApi } from '/@src/composable/useApi'
import { useUserSession } from '/@src/stores/userSession'

export async function authenticateUser(route: string, body: object) {
  const api = useApi()
  const userSession = useUserSession()

  const { data: token } = await api.post(route, body)

  //console.log(token.token)
  userSession.setToken(token.token)

  const { data: user } = await api.get('user')
  userSession.setUser(user)
}
