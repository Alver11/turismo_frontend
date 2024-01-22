import { useUserSession } from '/@src/stores/userSession'

export function hasPermission(permission: string, user_id?: any): boolean {
  const userSession = useUserSession()
  const user = userSession.user

  const isAdmin = user?.roles.some((role: any) => role.name === 'Super-Admin')
  if (isAdmin) {
    // Si el usuario actual es un Super-Admin, otorgar acceso sin importar el registro
    return true
  }

  //TODO - verificar el permiso del registro
  /*if (permission.includes('own')) {
    // Verificar si el usuario actual es el propietario del registro
    const isOwner = user?.id === user_id
    return isOwner
  }*/

  //Verifico los permisos dentro de cada rol
  for (let i = 0; i < user?.roles.length; i++) {
    for (let j = 0; j < user?.roles[i].permissions.length; j++) {
      //console.log(user?.roles[i].permissions[j].name)
      // Si el nombre del permiso coincide con el permiso buscado, devolver true
      if (user?.roles[i].permissions[j].name === permission) {
        return true
      }
    }
  }

  // Recorrer cada objeto de la matriz de permisos del usuario
  for (let i = 0; i < user?.permissions.length; i++) {
    // Si el nombre del permiso coincide con el permiso buscado, devolver true
    if (user?.permissions[i].name === permission) {
      return true
    }
  }

  // Si no se encuentra el permiso buscado, devolver false
  return false
}
