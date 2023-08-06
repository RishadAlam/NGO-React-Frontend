export default function checkPermission(permissions, userPermissions) {
  return permissions.some((p) => userPermissions.includes(p))
}
