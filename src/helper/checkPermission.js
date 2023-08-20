export const checkPermissions = (permissions, userPermissions) => {
  return permissions.some((p) => userPermissions.includes(p))
}
export const checkPermission = (permissions, userPermissions) => {
  return userPermissions.includes(permissions)
}
