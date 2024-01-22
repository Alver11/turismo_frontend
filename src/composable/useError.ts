export const formatError = (err: any) => {
  if (err.response?.status === undefined) {
    if (err.message == 'Error de red')
      return '¡Error de conexión! Por favor, inténtelo de nuevo más tarde'
    else return err.message
  }

  let message
  switch (err.response?.status) {
    case 401:
      message = 'auth.errors.unauthenticated'

      break
    case 403:
      console.log(err)
      message = err.response.data.error ? err.response.data.error : '¡No tienes permiso para ver esta página!'

      break
    case 422:
      message = Object.values<string>(err.response.data?.errors)?.flat()?.[0]

      break
    case 500:
      message = '¡Error interno! Por favor, inténtelo de nuevo más tarde'

      break
  }
  return message
}
