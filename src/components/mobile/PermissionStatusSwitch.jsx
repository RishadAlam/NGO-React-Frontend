import { useTranslation } from 'react-i18next'
import useMobilePermission from '../../hooks/useMobilePermission'
import AndroidSwitch from '../utilities/AndroidSwitch'

export default function PermissionStatusSwitch({
  permission,
  value = false,
  trueLabel = 'common.active',
  falseLabel = 'common.inactive',
  ...switchProps
}) {
  const allowed = useMobilePermission(permission)
  const { t } = useTranslation()
  if (!allowed) {
    return (
      <span className={`badge ${value ? 'bg-success' : 'bg-secondary'}`}>
        {t(value ? trueLabel : falseLabel)}
      </span>
    )
  }
  return <AndroidSwitch value={value} {...switchProps} />
}
