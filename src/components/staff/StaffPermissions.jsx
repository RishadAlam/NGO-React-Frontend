import { IconButton } from '@mui/joy'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { checkPermission } from '../../helper/checkPermission'
import CheckCircle from '../../icons/CheckCircle'
import ExternalLink from '../../icons/ExternalLink'
import Search from '../../icons/Search'
import XCircle from '../../icons/XCircle'
import ModalPro from '../utilities/ModalPro'

export default function StaffPermissions({
  isOpen,
  setIsOpen,
  t,
  data,
  authId,
  modalTitle,
  btnTitle
}) {
  const { permissions: authPermissions } = useAuthDataValue()
  const { staff_id, staff_permissions = [] } = data || {}
  const [searchQuery, setSearchQuery] = useState('')
  const normalizedSearch = searchQuery.trim().toLowerCase()

  useEffect(() => {
    if (!isOpen) setSearchQuery('')
  }, [isOpen])

  const permissions = useMemo(() => {
    if (!Array.isArray(staff_permissions)) return {}

    return staff_permissions.reduce((allPermissions, permission) => {
      if (!permission?.group_name || !permission?.name) return allPermissions

      if (!Array.isArray(allPermissions[permission.group_name])) {
        allPermissions[permission.group_name] = []
      }
      allPermissions[permission.group_name].push(permission.name)
      return allPermissions
    }, {})
  }, [staff_permissions])

  const groupedPermissions = useMemo(() => {
    return Object.entries(permissions)
      .map(([groupName, groupPermissions]) => {
        const groupLabel = t(`staff_permissions.group_name.${groupName}`)

        const filteredPermissions = groupPermissions.filter((permission) => {
          if (!normalizedSearch) return true

          const permissionLabel = t(`staff_permissions.permissions.${permission}`).toLowerCase()
          return (
            permissionLabel.includes(normalizedSearch) ||
            permission.toLowerCase().includes(normalizedSearch) ||
            groupLabel.toLowerCase().includes(normalizedSearch)
          )
        })

        return {
          groupName,
          groupLabel,
          groupPermissions,
          filteredPermissions
        }
      })
      .filter(({ filteredPermissions }) => filteredPermissions.length > 0)
      .sort((leftGroup, rightGroup) => leftGroup.groupLabel.localeCompare(rightGroup.groupLabel))
  }, [normalizedSearch, permissions, t])

  const totalPermissions = useMemo(
    () =>
      Object.values(permissions).reduce(
        (total, groupPermissions) => total + groupPermissions.length,
        0
      ),
    [permissions]
  )

  const visiblePermissionsCount = groupedPermissions.reduce(
    (total, { filteredPermissions }) => total + filteredPermissions.length,
    0
  )
  const hasPermissionData = totalPermissions > 0

  return (
    <>
      <ModalPro open={isOpen} handleClose={() => setIsOpen(false)}>
        <div className="staff-permission-modal card">
          <div className="card-header staff-permission-modal__header">
            <div className="staff-permission-modal__heading">
              <h5 className="staff-permission-modal__title mb-1">{modalTitle}</h5>
              <p className="staff-permission-modal__meta mb-0">
                {t('staff_permissions.ui.modal_showing', {
                  visible: visiblePermissionsCount,
                  total: totalPermissions
                })}
              </p>
            </div>
            <IconButton
              className="staff-permission-modal__close-btn"
              onClick={() => setIsOpen(false)}
              aria-label={t('staff_permissions.ui.modal_close_aria')}>
              <XCircle size={30} />
            </IconButton>
          </div>

          <div className="card-body staff-permission-modal__body">
            <div className="staff-permission-modal__toolbar mb-3">
              <label className="staff-permission-modal__search">
                <Search size={16} />
                <input
                  type="text"
                  placeholder={t('staff_permissions.ui.search_permission_or_group')}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </label>
              {searchQuery && (
                <button
                  type="button"
                  className="staff-permission-modal__clear-btn"
                  onClick={() => setSearchQuery('')}>
                  {t('staff_permissions.ui.clear')}
                </button>
              )}
            </div>

            {groupedPermissions.length > 0 ? (
              <div className="row g-3">
                {groupedPermissions.map(
                  ({ groupName, groupLabel, groupPermissions, filteredPermissions }) => (
                    <div key={groupName} className="col-12 col-lg-6">
                      <div className="staff-permission-modal__group card h-100">
                        <div className="card-header staff-permission-modal__group-header">
                          <b className="text-uppercase">{groupLabel}</b>
                          <span className="staff-permission-modal__group-count">
                            {filteredPermissions.length}/{groupPermissions.length}
                          </span>
                        </div>
                        <div className="card-body py-2">
                          <ul className="staff-permission-modal__permission-list mb-0">
                            {filteredPermissions.map((permission) => (
                              <li
                                key={`${groupName}-${permission}`}
                                className="staff-permission-modal__permission-item">
                                <span>{t(`staff_permissions.permissions.${permission}`)}</span>
                                <CheckCircle size={18} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="staff-permission-modal__empty">
                <h5>
                  {hasPermissionData
                    ? t('staff_permissions.ui.no_match_search')
                    : t('common.No_Records_Found')}
                </h5>
              </div>
            )}
          </div>

          {authId !== staff_id && checkPermission('staff_permission_update', authPermissions) && (
            <div className="card-footer staff-permission-modal__footer">
              <Link to={`/staff-permissions/${staff_id}`} className="staff-permission-modal__link">
                {btnTitle}
                <ExternalLink size={18} />
              </Link>
            </div>
          )}
        </div>
      </ModalPro>
    </>
  )
}
