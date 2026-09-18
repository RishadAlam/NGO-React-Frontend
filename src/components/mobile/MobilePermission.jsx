import useMobilePermission from '../../hooks/useMobilePermission'

export default function MobilePermission({ permission, children, fallback = null }) {
  return useMobilePermission(permission) ? children : fallback
}
