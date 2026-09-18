// Collection endpoints are shared by three distinct permission scopes.
export const collectionPermission = (type, scope, action) => {
  if (!['saving', 'loan'].includes(type)) return null
  if (action === 'create') {
    return scope === 'regular' ? `permission_to_do_${type}_collection` : null
  }
  if (!['update', 'permanently_delete', 'approval'].includes(action)) return null
  if (scope === 'account') {
    return action === 'approval' ? null : `client_${type}_account_collection_${action}`
  }
  return ['regular', 'pending'].includes(scope) ? `${scope}_${type}_collection_${action}` : null
}
