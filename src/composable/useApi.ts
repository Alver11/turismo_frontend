import axios, { type AxiosRequestHeaders, type AxiosInstance } from 'axios'

import { useUserSession } from '/@src/stores/userSession'

let api: AxiosInstance

export function createApi() {
  // Here we set the base URL for all requests made to the api
  api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + '/api/v1/',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  })

  // We set an interceptor for each request to
  // include Bearer token to the request if user is logged in
  api.interceptors.request.use(
    (config) => {
      const userSession = useUserSession()

      if (userSession.isLoggedIn) {
        config.headers = {
          ...((config.headers as AxiosRequestHeaders) ?? {}),
          Authorization: `Bearer ${userSession.token}`,
        }
      }

      return config
    },
    (err) => {
      return Promise.reject(err)
    }
  )

  return api
}

export function useApi() {
  if (!api) {
    createApi()
  }
  return api
}
