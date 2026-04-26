import { create, rawReturn } from 'mutative'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import StaffPermissionSkeleton from '../../components/loaders/skeleton/StaffPermissionSkeleton'
import AndroidSwitch from '../../components/utilities/AndroidSwitch'
import Button from '../../components/utilities/Button'
import { checkPermission } from '../../helper/checkPermission'
import useFetch from '../../hooks/useFetch'
import Home from '../../icons/Home'
import Save from '../../icons/Save'
import Search from '../../icons/Search'
import UserCheck from '../../icons/UserCheck'
import tsNumbers from '../../libs/tsNumbers'
import xFetch from '../../utilities/xFetch'
import './staffs.scss'

const DEFAULT_PARENT_CATEGORY = 'others'
const ALL_PARENT_CATEGORY_FILTER = '__all__'

const resolveParentCategoryLabel = (t, parentGroupName) => {
  const fallbackLabel = parentGroupName
    ? parentGroupName.replaceAll('_', ' ')
    : DEFAULT_PARENT_CATEGORY
  const translationKey = `staff_permissions.parent_category.${parentGroupName || DEFAULT_PARENT_CATEGORY}`
  const translatedLabel = t(translationKey)
  return translatedLabel === translationKey ? fallbackLabel : translatedLabel
}

const resolveRoleNameLabel = (t, roleName) => {
  const normalizedRoleName = String(roleName || '')
    .trim()
    .toLowerCase()
    .replaceAll(' ', '_')

  if (!normalizedRoleName) return null

  const translationKey = `staff_roles.default.${normalizedRoleName}`
  const translatedRoleName = t(translationKey)

  return translatedRoleName === translationKey
    ? normalizedRoleName.replaceAll('_', ' ')
    : translatedRoleName
}

export default function RolePermissions() {
  const { id } = useParams()
  const { t } = useTranslation()
  const [permissions, setPermissions] = useState({})
  const [groupParents, setGroupParents] = useState({})
  const [error, setError] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedParentCategory, setSelectedParentCategory] = useState(ALL_PARENT_CATEGORY_FILTER)
  const [showEnabledOnly, setShowEnabledOnly] = useState(false)
  const [loading, setLoading] = useLoadingState({})

  const normalizedSearch = searchQuery.trim().toLowerCase()
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const canUpdateRolePermissions = checkPermission('role_permission_update', authPermissions)

  const {
    data: {
      data: { allPermissions, role, rolePermissions } = {
        allPermissions: [],
        role: null,
        rolePermissions: []
      }
    } = [],
    mutate,
    isLoading
  } = useFetch({ action: `roles/${id}/permissions` })

  const parentCategoryOptions = useMemo(() => {
    const parentGroupNames = Object.keys(permissions).map(
      (groupName) => groupParents[groupName] || DEFAULT_PARENT_CATEGORY
    )

    return [...new Set(parentGroupNames)]
      .map((parentGroupName) => ({
        value: parentGroupName,
        label: resolveParentCategoryLabel(t, parentGroupName)
      }))
      .sort((leftOption, rightOption) => leftOption.label.localeCompare(rightOption.label))
  }, [groupParents, permissions, t])

  const filteredGroups = useMemo(() => {
    return Object.keys(permissions)
      .map((groupName) => {
        const groupPermissions = permissions[groupName]
        const groupLabel = t(`staff_permissions.group_name.${groupName}`)
        const parentGroupName = groupParents[groupName] || DEFAULT_PARENT_CATEGORY
        const parentGroupLabel = resolveParentCategoryLabel(t, parentGroupName)
        const permissionKeys = Object.keys(groupPermissions)

        const visiblePermissionKeys = permissionKeys.filter((permissionName) => {
          if (showEnabledOnly && !groupPermissions[permissionName]) return false
          if (!normalizedSearch) return true

          const permissionLabel = t(`staff_permissions.permissions.${permissionName}`).toLowerCase()
          return (
            permissionLabel.includes(normalizedSearch) ||
            permissionName.toLowerCase().includes(normalizedSearch) ||
            groupLabel.toLowerCase().includes(normalizedSearch) ||
            parentGroupLabel.toLowerCase().includes(normalizedSearch)
          )
        })

        const enabledCount = permissionKeys.filter(
          (permissionName) => groupPermissions[permissionName]
        ).length

        return {
          groupName,
          groupLabel,
          parentGroupName,
          parentGroupLabel,
          permissionKeys,
          visiblePermissionKeys,
          enabledCount
        }
      })
      .filter(({ parentGroupName, visiblePermissionKeys }) => {
        if (!visiblePermissionKeys.length) return false
        if (selectedParentCategory === ALL_PARENT_CATEGORY_FILTER) return true
        return parentGroupName === selectedParentCategory
      })
      .sort((leftGroup, rightGroup) => leftGroup.groupLabel.localeCompare(rightGroup.groupLabel))
  }, [groupParents, normalizedSearch, permissions, selectedParentCategory, showEnabledOnly, t])

  const filteredParentGroups = useMemo(() => {
    const parentGroups = {}

    filteredGroups.forEach((group) => {
      if (!Array.isArray(parentGroups[group.parentGroupName])) {
        parentGroups[group.parentGroupName] = []
      }

      parentGroups[group.parentGroupName].push(group)
    })

    return Object.keys(parentGroups)
      .map((parentGroupName) => {
        const groups = parentGroups[parentGroupName].sort((leftGroup, rightGroup) =>
          leftGroup.groupLabel.localeCompare(rightGroup.groupLabel)
        )

        const totalCount = groups.reduce((total, group) => total + group.permissionKeys.length, 0)
        const enabledCount = groups.reduce((total, group) => total + group.enabledCount, 0)
        const visibleCount = groups.reduce(
          (total, group) => total + group.visiblePermissionKeys.length,
          0
        )

        return {
          parentGroupName,
          parentGroupLabel: resolveParentCategoryLabel(t, parentGroupName),
          groups,
          totalCount,
          enabledCount,
          visibleCount
        }
      })
      .sort((leftParent, rightParent) =>
        leftParent.parentGroupLabel.localeCompare(rightParent.parentGroupLabel)
      )
  }, [filteredGroups, t])

  const permissionStats = useMemo(() => {
    let groupCount = 0
    const parentCategorySet = new Set()
    let totalCount = 0
    let enabledCount = 0

    Object.keys(permissions).forEach((groupName) => {
      groupCount += 1
      parentCategorySet.add(groupParents[groupName] || DEFAULT_PARENT_CATEGORY)
      Object.keys(permissions[groupName]).forEach((permissionName) => {
        totalCount += 1
        if (permissions[groupName][permissionName]) enabledCount += 1
      })
    })

    const visibleGroupCount = filteredGroups.length
    const visibleCount = filteredGroups.reduce(
      (total, { visiblePermissionKeys }) => total + visiblePermissionKeys.length,
      0
    )

    return {
      parentCount: parentCategorySet.size,
      groupCount,
      totalCount,
      enabledCount,
      visibleParentCount: filteredParentGroups.length,
      visibleGroupCount,
      visibleCount
    }
  }, [filteredGroups, filteredParentGroups.length, groupParents, permissions])

  useEffect(() => {
    if (allPermissions.length) {
      setPermissions(() =>
        create({}, (draftPerm) => {
          allPermissions.forEach((permission) => {
            if (typeof draftPerm[permission.group_name] !== 'object') {
              draftPerm[permission.group_name] = {}
            }
            draftPerm[permission.group_name][permission.name] = rolePermissions.includes(
              permission.name
            )
          })
        })
      )

      setGroupParents(() =>
        create({}, (draftParents) => {
          allPermissions.forEach((permission) => {
            if (typeof draftParents[permission.group_name] !== 'string') {
              draftParents[permission.group_name] =
                permission.parent_group_name || DEFAULT_PARENT_CATEGORY
            }
          })
        })
      )
    } else {
      setPermissions({})
      setGroupParents({})
    }

    setError({})
  }, [allPermissions, rolePermissions])

  useEffect(() => {
    if (selectedParentCategory === ALL_PARENT_CATEGORY_FILTER) return

    const hasSelectedParentCategory = parentCategoryOptions.some(
      ({ value }) => value === selectedParentCategory
    )

    if (!hasSelectedParentCategory) {
      setSelectedParentCategory(ALL_PARENT_CATEGORY_FILTER)
    }
  }, [parentCategoryOptions, selectedParentCategory])

  const clearErrors = () => {
    if (Object.keys(error).length) setError({})
  }

  const setChange = (groupName, permissionName, isChecked) => {
    if (!canUpdateRolePermissions) return

    clearErrors()
    setPermissions((prevPerm) =>
      create(prevPerm, (draftPerm) => {
        draftPerm[groupName][permissionName] = isChecked
      })
    )
  }

  const setGroupChecked = (groupPermissionMap = {}) => {
    return Object.keys(groupPermissionMap).every(
      (permissionName) => groupPermissionMap[permissionName]
    )
  }

  const toggleGroupPermissions = (groupName, isChecked) => {
    if (!canUpdateRolePermissions) return

    clearErrors()
    setPermissions((prevPerm) =>
      create(prevPerm, (draftPerm) => {
        Object.keys(draftPerm[groupName]).forEach((permissionName) => {
          draftPerm[groupName][permissionName] = isChecked
        })
      })
    )
  }

  const toggleVisiblePermissions = (isChecked) => {
    if (!canUpdateRolePermissions || !filteredGroups.length) return

    clearErrors()
    setPermissions((prevPerm) =>
      create(prevPerm, (draftPerm) => {
        filteredGroups.forEach(({ groupName, visiblePermissionKeys }) => {
          visiblePermissionKeys.forEach((permissionName) => {
            draftPerm[groupName][permissionName] = isChecked
          })
        })
      })
    )
  }

  const updatePermissions = (event) => {
    event.preventDefault()
    if (!canUpdateRolePermissions) return

    const selectedPermissions = []

    Object.keys(permissions).forEach((groupName) => {
      Object.keys(permissions[groupName]).forEach((permissionName) => {
        if (permissions[groupName][permissionName]) selectedPermissions.push(permissionName)
      })
    })

    setLoading({ ...loading, rolePermissions: true })
    xFetch(
      `roles/${id}/permissions`,
      { permissions: selectedPermissions },
      null,
      accessToken,
      null,
      'PUT'
    )
      .then((response) => {
        setLoading({ ...loading, rolePermissions: false })
        if (response?.success) {
          toast.success(response.message)
          mutate()
          return
        }

        setError((prevErr) =>
          create(prevErr, (draftErr) => {
            if (!response?.errors) {
              draftErr.message = response?.message
              return
            }
            return rawReturn(response?.errors || response)
          })
        )
      })
      .catch((errorResponse) => {
        setLoading({ ...loading, rolePermissions: false })
        setError({ message: errorResponse?.message || t('staff_permissions.ui.update_failed') })
      })
  }

  const hasPermissionData = permissionStats.totalCount > 0
  const noneLabel = t('staff_permissions.ui.none')
  const roleName = resolveRoleNameLabel(t, role?.name) || noneLabel
  const roleId = role?.id || noneLabel
  const parsedRolePermissionCount = Number(role?.permissions_count)
  const rolePermissionCount = Number.isNaN(parsedRolePermissionCount)
    ? permissionStats.enabledCount
    : parsedRolePermissionCount
  const roleTypeLabel = role
    ? role.is_default
      ? t('staff_permissions.ui.default_role')
      : t('staff_permissions.ui.custom_role')
    : t('staff_permissions.ui.none')
  const roleIdLabel = tsNumbers(roleId)
  const rolePermissionCountLabel = tsNumbers(rolePermissionCount)
  const listShowingVisibleLabel = tsNumbers(permissionStats.visibleCount)
  const listShowingTotalLabel = tsNumbers(permissionStats.totalCount)
  const listShowingGroupLabel = tsNumbers(permissionStats.visibleGroupCount)
  const listShowingCategoryLabel = tsNumbers(permissionStats.visibleParentCount)
  const shellCategoryCountLabel = tsNumbers(permissionStats.parentCount)
  const shellGroupCountLabel = tsNumbers(permissionStats.groupCount)
  const shellEnabledCountLabel = tsNumbers(permissionStats.enabledCount)
  const shellTotalCountLabel = tsNumbers(permissionStats.totalCount)

  return (
    <section className="staff-permissions staff-permissions-page">
      <Breadcrumb
        breadcrumbs={[
          { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
          {
            name: t('menu.staffs.Staff_Roles'),
            path: '/staff-roles',
            icon: <UserCheck size={16} />,
            active: false
          },
          {
            name: t('menu.staffs.Role_Permissions'),
            icon: <UserCheck size={16} />,
            active: true
          }
        ]}
      />

      {isLoading ? (
        <StaffPermissionSkeleton skeletonSize={6} />
      ) : (
        <>
          <div className="staff-permissions-context-card staff-permissions-context-card--role card my-3">
            <div className="staff-permissions-context-card__identity">
              <div className="staff-permissions-context-card__avatar-shell">
                <div className="staff-permissions-context-card__avatar-fallback">
                  <UserCheck size={34} />
                </div>
              </div>
              <div className="staff-permissions-context-card__headline">
                <small>{t('staff_permissions.ui.role_card_title')}</small>
                <h5>{roleName}</h5>
                <p>{t('menu.staffs.Role_Permissions')}</p>
                <div className="staff-permissions-context-card__status-row">
                  <span
                    className={`staff-permissions-context-card__status ${
                      role?.is_default ? 'is-active' : 'is-inactive'
                    }`}>
                    {roleTypeLabel}
                  </span>
                </div>
              </div>
            </div>
            <div className="staff-permissions-context-card__details">
              <h6>{t('staff_permissions.ui.details')}</h6>
              <div className="staff-permissions-context-card__detail-grid">
                <div className="staff-permissions-context-card__detail-item">
                  <span>{t('staff_permissions.ui.role_id')}</span>
                  <strong>{roleIdLabel}</strong>
                </div>
                <div className="staff-permissions-context-card__detail-item">
                  <span>{t('staff_permissions.ui.assigned_permissions')}</span>
                  <strong>{rolePermissionCountLabel}</strong>
                </div>
              </div>
              <p className="staff-permissions-context-card__summary mb-0">
                {t('staff_permissions.ui.list_showing', {
                  visible: listShowingVisibleLabel,
                  total: listShowingTotalLabel,
                  groups: listShowingGroupLabel,
                  categories: listShowingCategoryLabel
                })}
              </p>
            </div>

            <div className="staff-permissions-context-card__stats-grid">
              <div className="staff-permissions-context-card__stat-tile">
                <strong>{shellCategoryCountLabel}</strong>
                <span>{t('staff_permissions.ui.categories')}</span>
              </div>
              <div className="staff-permissions-context-card__stat-tile">
                <strong>{shellGroupCountLabel}</strong>
                <span>{t('staff_permissions.ui.groups')}</span>
              </div>
              <div className="staff-permissions-context-card__stat-tile">
                <strong>{shellEnabledCountLabel}</strong>
                <span>{t('staff_permissions.ui.enabled')}</span>
              </div>
              <div className="staff-permissions-context-card__stat-tile">
                <strong>{shellTotalCountLabel}</strong>
                <span>{t('staff_permissions.ui.total')}</span>
              </div>
            </div>
          </div>

          <div className="staff-permissions-shell card my-3">
            <div className="card-header staff-permissions-shell__header">
              <div className="staff-permissions-shell__title-wrap">
                <b className="text-uppercase">{t('menu.staffs.Role_Permissions')}</b>
              </div>
            </div>
            <div className="card-body staff-permissions-shell__body">
              <div className="staff-permissions-shell__controls mb-3">
                <label className="staff-permissions-shell__search">
                  <Search size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    placeholder={t('staff_permissions.ui.search_group_or_permission')}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </label>

                <label className="staff-permissions-shell__parent-filter">
                  <span>{t('staff_permissions.ui.parent_category_filter')}</span>
                  <select
                    value={selectedParentCategory}
                    onChange={(event) => setSelectedParentCategory(event.target.value)}>
                    <option value={ALL_PARENT_CATEGORY_FILTER}>
                      {t('staff_permissions.ui.all_categories')}
                    </option>
                    {parentCategoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="staff-permissions-shell__actions">
                  <button
                    type="button"
                    className={`staff-permissions-shell__control-btn ${
                      showEnabledOnly ? 'is-active' : ''
                    }`}
                    onClick={() => setShowEnabledOnly((prevState) => !prevState)}>
                    {showEnabledOnly
                      ? t('staff_permissions.ui.enabled_only')
                      : t('staff_permissions.ui.all_permissions')}
                  </button>
                  <button
                    type="button"
                    className="staff-permissions-shell__control-btn"
                    onClick={() => toggleVisiblePermissions(true)}
                    disabled={!filteredGroups.length || !canUpdateRolePermissions}>
                    {t('staff_permissions.ui.enable_visible')}
                  </button>
                  <button
                    type="button"
                    className="staff-permissions-shell__control-btn"
                    onClick={() => toggleVisiblePermissions(false)}
                    disabled={!filteredGroups.length || !canUpdateRolePermissions}>
                    {t('staff_permissions.ui.disable_visible')}
                  </button>
                  {(searchQuery || selectedParentCategory !== ALL_PARENT_CATEGORY_FILTER) && (
                    <button
                      type="button"
                      className="staff-permissions-shell__control-btn"
                      onClick={() => {
                        setSearchQuery('')
                        setSelectedParentCategory(ALL_PARENT_CATEGORY_FILTER)
                      }}>
                      {t('staff_permissions.ui.clear')}
                    </button>
                  )}
                </div>
              </div>

              <div className="staff-permissions-grid row g-3">
                {filteredParentGroups.length > 0 ? (
                  filteredParentGroups.map(
                    ({
                      parentGroupName,
                      parentGroupLabel,
                      groups,
                      enabledCount: parentEnabledCount,
                      totalCount: parentTotalCount
                    }) => (
                      <div key={parentGroupName} className="col-12">
                        <div className="staff-permissions-parent card">
                          <div className="card-header staff-permissions-parent__header">
                            <div className="staff-permissions-parent__title-wrap">
                              <b className="text-uppercase">{parentGroupLabel}</b>
                              <small>
                                {t('staff_permissions.ui.category_enabled', {
                                  enabled: tsNumbers(parentEnabledCount),
                                  total: tsNumbers(parentTotalCount),
                                  groups: tsNumbers(groups.length)
                                })}
                              </small>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="row g-3">
                              {groups.map(
                                ({
                                  groupName,
                                  groupLabel,
                                  permissionKeys,
                                  visiblePermissionKeys,
                                  enabledCount
                                }) => (
                                  <div key={groupName} className="col-12 col-lg-6 col-xxl-4">
                                    <div className="staff-permissions-group card h-100">
                                      <div className="card-header staff-permissions-group__header">
                                        <div className="staff-permissions-group__title-wrap">
                                          <b className="text-capitalize">{groupLabel}</b>
                                          <small>
                                            {t('staff_permissions.ui.group_enabled', {
                                              enabled: tsNumbers(enabledCount),
                                              total: tsNumbers(permissionKeys.length)
                                            })}
                                          </small>
                                        </div>
                                        <AndroidSwitch
                                          value={setGroupChecked(permissions[groupName])}
                                          disabled={!canUpdateRolePermissions}
                                          toggleStatus={(event) =>
                                            toggleGroupPermissions(groupName, event.target.checked)
                                          }
                                        />
                                      </div>
                                      <div className="card-body py-2">
                                        <ul className="mb-0 staff-permissions-group__list">
                                          {visiblePermissionKeys.map((permissionName) => (
                                            <li
                                              key={`${groupName}-${permissionName}`}
                                              className={`staff-permissions-group__permission-item ${
                                                permissions[groupName][permissionName]
                                                  ? 'is-enabled'
                                                  : ''
                                              }`}>
                                              <p>
                                                {t(
                                                  `staff_permissions.permissions.${permissionName}`
                                                )}
                                              </p>
                                              <AndroidSwitch
                                                value={permissions[groupName][permissionName]}
                                                disabled={!canUpdateRolePermissions}
                                                toggleStatus={(event) =>
                                                  setChange(
                                                    groupName,
                                                    permissionName,
                                                    event.target.checked
                                                  )
                                                }
                                              />
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
                    )
                  )
                ) : (
                  <div className="col-12">
                    <div className="staff-permissions-empty-state">
                      <h5>
                        {hasPermissionData
                          ? t('staff_permissions.ui.no_match_filters')
                          : t('common.No_Records_Found')}
                      </h5>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="card-footer staff-permissions-shell__footer">
              {error?.message && <p className="staff-permissions-shell__error">{error.message}</p>}
              <Button
                type="button"
                name={t('common.update')}
                className={'btn-primary py-2 px-4 staff-permissions-shell__submit-btn'}
                loading={loading?.rolePermissions || false}
                endIcon={<Save size={20} />}
                onclick={(event) => updatePermissions(event)}
                disabled={!canUpdateRolePermissions || loading?.rolePermissions}
              />
            </div>
          </div>
        </>
      )}
    </section>
  )
}
