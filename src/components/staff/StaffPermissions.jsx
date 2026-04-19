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

const DEFAULT_PARENT_CATEGORY = 'others'

const resolveParentCategoryLabel = (t, parentGroupName) => {
  const fallbackLabel = parentGroupName
    ? parentGroupName.replaceAll('_', ' ')
    : DEFAULT_PARENT_CATEGORY
  const translationKey = `staff_permissions.parent_category.${parentGroupName || DEFAULT_PARENT_CATEGORY}`
  const translatedLabel = t(translationKey)
  return translatedLabel === translationKey ? fallbackLabel : translatedLabel
}

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

      if (typeof allPermissions[permission.group_name] !== 'object') {
        allPermissions[permission.group_name] = {
          parentGroupName: permission.parent_group_name || DEFAULT_PARENT_CATEGORY,
          permissions: []
        }
      }

      allPermissions[permission.group_name].permissions.push(permission.name)
      return allPermissions
    }, {})
  }, [staff_permissions])

  const groupedPermissions = useMemo(() => {
    return Object.entries(permissions)
      .map(([groupName, groupData]) => {
        const groupPermissions = Array.isArray(groupData?.permissions) ? groupData.permissions : []
        const groupLabel = t(`staff_permissions.group_name.${groupName}`)
        const parentGroupName = groupData?.parentGroupName || DEFAULT_PARENT_CATEGORY
        const parentGroupLabel = resolveParentCategoryLabel(t, parentGroupName)

        const filteredPermissions = groupPermissions.filter((permission) => {
          if (!normalizedSearch) return true

          const permissionLabel = t(`staff_permissions.permissions.${permission}`).toLowerCase()
          return (
            permissionLabel.includes(normalizedSearch) ||
            permission.toLowerCase().includes(normalizedSearch) ||
            groupLabel.toLowerCase().includes(normalizedSearch) ||
            parentGroupLabel.toLowerCase().includes(normalizedSearch)
          )
        })

        return {
          groupName,
          groupLabel,
          parentGroupName,
          parentGroupLabel,
          groupPermissions,
          filteredPermissions
        }
      })
      .filter(({ filteredPermissions }) => filteredPermissions.length > 0)
      .sort((leftGroup, rightGroup) => leftGroup.groupLabel.localeCompare(rightGroup.groupLabel))
  }, [normalizedSearch, permissions, t])

  const groupedParentPermissions = useMemo(() => {
    const groupedByParent = {}

    groupedPermissions.forEach((group) => {
      if (!Array.isArray(groupedByParent[group.parentGroupName])) {
        groupedByParent[group.parentGroupName] = []
      }

      groupedByParent[group.parentGroupName].push(group)
    })

    return Object.keys(groupedByParent)
      .map((parentGroupName) => {
        const groups = groupedByParent[parentGroupName].sort((leftGroup, rightGroup) =>
          leftGroup.groupLabel.localeCompare(rightGroup.groupLabel)
        )
        return {
          parentGroupName,
          parentGroupLabel: resolveParentCategoryLabel(t, parentGroupName),
          groups
        }
      })
      .sort((leftParent, rightParent) =>
        leftParent.parentGroupLabel.localeCompare(rightParent.parentGroupLabel)
      )
  }, [groupedPermissions, t])

  const totalPermissions = useMemo(
    () =>
      Object.values(permissions).reduce((total, groupData) => {
        const groupPermissions = Array.isArray(groupData?.permissions) ? groupData.permissions : []
        return total + groupPermissions.length
      }, 0),
    [permissions]
  )

  const visiblePermissionsCount = groupedParentPermissions.reduce(
    (total, { groups }) =>
      total +
      groups.reduce(
        (groupTotal, { filteredPermissions }) => groupTotal + filteredPermissions.length,
        0
      ),
    0
  )
  const visibleGroupCount = groupedParentPermissions.reduce(
    (total, { groups }) => total + groups.length,
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
                  total: totalPermissions,
                  groups: visibleGroupCount,
                  categories: groupedParentPermissions.length
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

            {groupedParentPermissions.length > 0 ? (
              <div className="row g-3">
                {groupedParentPermissions.map(({ parentGroupName, parentGroupLabel, groups }) => (
                  <div key={parentGroupName} className="col-12">
                    <div className="staff-permission-modal__parent card">
                      <div className="card-header staff-permission-modal__parent-header">
                        <div className="staff-permission-modal__parent-title-wrap">
                          <b className="text-uppercase">{parentGroupLabel}</b>
                          <small>
                            {t('staff_permissions.ui.category_group_count', {
                              count: groups.length
                            })}
                          </small>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          {groups.map(
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
                                          <span>
                                            {t(`staff_permissions.permissions.${permission}`)}
                                          </span>
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
                      </div>
                    </div>
                  </div>
                ))}
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
