import { create, rawReturn } from 'mutative'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import StaffPermissionSkeleton from '../../components/loaders/skeleton/StaffPermissionSkeleton'
import AndroidSwitch from '../../components/utilities/AndroidSwitch'
import Button from '../../components/utilities/Button'
import useFetch from '../../hooks/useFetch'
import Home from '../../icons/Home'
import Save from '../../icons/Save'
import Search from '../../icons/Search'
import User from '../../icons/User'
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

export default function StaffPermissions() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [permissions, setPermissions] = useState({})
  const [groupParents, setGroupParents] = useState({})
  const [error, setError] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedParentCategory, setSelectedParentCategory] = useState(ALL_PARENT_CATEGORY_FILTER)
  const [showEnabledOnly, setShowEnabledOnly] = useState(false)
  const [loading, setLoading] = useLoadingState({})

  const normalizedSearch = searchQuery.trim().toLowerCase()
  const { accessToken, id: authId } = useAuthDataValue()

  const {
    data: {
      data: {
        allPermissions,
        user,
        userPermissions,
        userDirectPermissions,
        userRolePermissions
      } = {
        allPermissions: [],
        user: null,
        userPermissions: [],
        userDirectPermissions: [],
        userRolePermissions: []
      }
    } = [],
    mutate,
    isLoading
  } = useFetch({ action: `permissions/${id}` })

  const rolePermissionNameSet = useMemo(() => new Set(userRolePermissions), [userRolePermissions])

  const userRoleNames = useMemo(() => {
    if (!Array.isArray(user?.roles)) return []

    return user.roles
      .map((role) => {
        if (typeof role === 'string') return role
        return role?.name || null
      })
      .map((roleName) => resolveRoleNameLabel(t, roleName))
      .filter(Boolean)
  }, [t, user?.roles])

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
          if (showEnabledOnly) {
            const isEnabledByRole = rolePermissionNameSet.has(permissionName)
            const isEnabledDirectly = groupPermissions[permissionName]
            if (!isEnabledByRole && !isEnabledDirectly) return false
          }

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
          (permissionName) =>
            groupPermissions[permissionName] || rolePermissionNameSet.has(permissionName)
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
  }, [
    groupParents,
    normalizedSearch,
    permissions,
    rolePermissionNameSet,
    selectedParentCategory,
    showEnabledOnly,
    t
  ])

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
        if (permissions[groupName][permissionName] || rolePermissionNameSet.has(permissionName)) {
          enabledCount += 1
        }
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
  }, [
    filteredGroups,
    filteredParentGroups.length,
    groupParents,
    permissions,
    rolePermissionNameSet
  ])

  useEffect(() => {
    if (Number(authId) === Number(id)) {
      navigate('/unauthorized')
    }
  }, [authId, id, navigate])

  useEffect(() => {
    const selectedDirectPermissions = Array.isArray(userDirectPermissions)
      ? userDirectPermissions
      : userPermissions
    const selectedDirectPermissionSet = new Set(selectedDirectPermissions)

    if (allPermissions.length) {
      setPermissions(() =>
        create({}, (draftPerm) => {
          allPermissions.forEach((permission) => {
            if (typeof draftPerm[permission.group_name] !== 'object') {
              draftPerm[permission.group_name] = {}
            }
            draftPerm[permission.group_name][permission.name] = selectedDirectPermissionSet.has(
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
  }, [allPermissions, userDirectPermissions, userPermissions])

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
    clearErrors()
    setPermissions((prevPerm) =>
      create(prevPerm, (draftPerm) => {
        draftPerm[groupName][permissionName] = isChecked
      })
    )
  }

  const setGroupChecked = (groupPermissionMap = {}) => {
    return Object.keys(groupPermissionMap).every(
      (permissionName) =>
        groupPermissionMap[permissionName] || rolePermissionNameSet.has(permissionName)
    )
  }

  const toggleGroupPermissions = (groupName, isChecked) => {
    clearErrors()
    setPermissions((prevPerm) =>
      create(prevPerm, (draftPerm) => {
        Object.keys(draftPerm[groupName]).forEach((permissionName) => {
          const inheritedOnly =
            rolePermissionNameSet.has(permissionName) && !draftPerm[groupName][permissionName]
          if (inheritedOnly) return
          draftPerm[groupName][permissionName] = isChecked
        })
      })
    )
  }

  const toggleVisiblePermissions = (isChecked) => {
    if (!filteredGroups.length) return

    clearErrors()
    setPermissions((prevPerm) =>
      create(prevPerm, (draftPerm) => {
        filteredGroups.forEach(({ groupName, visiblePermissionKeys }) => {
          visiblePermissionKeys.forEach((permissionName) => {
            const inheritedOnly =
              rolePermissionNameSet.has(permissionName) && !draftPerm[groupName][permissionName]
            if (inheritedOnly) return
            draftPerm[groupName][permissionName] = isChecked
          })
        })
      })
    )
  }

  const updatePermissions = (event) => {
    event.preventDefault()
    const staffPermissions = []

    Object.keys(permissions).forEach((groupName) => {
      Object.keys(permissions[groupName]).forEach((permissionName) => {
        if (permissions[groupName][permissionName]) {
          staffPermissions.push(permissionName)
        }
      })
    })

    setLoading({ ...loading, staffPermissions: true })
    xFetch(`permissions/${id}`, { permissions: staffPermissions }, null, accessToken, null, 'PUT')
      .then((response) => {
        setLoading({ ...loading, staffPermissions: false })
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
        setLoading({ ...loading, staffPermissions: false })
        setError({ message: errorResponse?.message || t('staff_permissions.ui.update_failed') })
      })
  }

  const hasPermissionData = permissionStats.totalCount > 0
  const noneLabel = t('staff_permissions.ui.none')
  const userName = user?.name || noneLabel
  const userEmail = user?.email || noneLabel
  const userPhone = user?.phone || noneLabel
  const userId = user?.id || noneLabel
  const userImageUri =
    typeof user?.image_uri === 'string' && user.image_uri.trim() ? user.image_uri : null
  const userStatusLabel = user?.status ? t('common.active') : t('staff_permissions.ui.inactive')
  const userRoleLabel = userRoleNames.length ? userRoleNames.join(', ') : noneLabel
  const directPermissionCount = userDirectPermissions.length
  const rolePermissionCount = userRolePermissions.length
  const userIdLabel = tsNumbers(userId)
  const userPhoneLabel = tsNumbers(userPhone)
  const directPermissionCountLabel = tsNumbers(directPermissionCount)
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
            name: t('menu.staffs.Staffs'),
            path: '/staffs',
            icon: <Home size={16} />,
            active: false
          },
          {
            name: t('menu.staffs.Staff_Permissions'),
            icon: <Home size={16} />,
            active: true
          }
        ]}
      />

      {isLoading ? (
        <StaffPermissionSkeleton skeletonSize={6} />
      ) : (
        <>
          <div className="staff-permissions-context-card card my-3">
            <div className="staff-permissions-context-card__identity">
              <div className="staff-permissions-context-card__avatar-shell">
                {userImageUri ? (
                  <img
                    src={userImageUri}
                    alt={userName}
                    className="staff-permissions-context-card__avatar"
                  />
                ) : (
                  <div className="staff-permissions-context-card__avatar-fallback">
                    <User size={34} />
                  </div>
                )}
              </div>
              <div className="staff-permissions-context-card__headline">
                <small>{t('staff_permissions.ui.profile_card_title')}</small>
                <h5>{userName}</h5>
                <p>{userEmail}</p>
                <div className="staff-permissions-context-card__status-row">
                  <span
                    className={`staff-permissions-context-card__status ${
                      user?.status ? 'is-active' : 'is-inactive'
                    }`}>
                    {userStatusLabel}
                  </span>
                </div>
              </div>
            </div>
            <div className="staff-permissions-context-card__details">
              <h6>{t('staff_permissions.ui.details')}</h6>
              <div className="staff-permissions-context-card__detail-grid">
                <div className="staff-permissions-context-card__detail-item">
                  <span>{t('staff_permissions.ui.user_id')}</span>
                  <strong>{userIdLabel}</strong>
                </div>
                <div className="staff-permissions-context-card__detail-item">
                  <span>{t('common.phone')}</span>
                  <strong>{userPhoneLabel}</strong>
                </div>
                <div className="staff-permissions-context-card__detail-item">
                  <span>{t('common.role')}</span>
                  <strong>{userRoleLabel}</strong>
                </div>
                <div className="staff-permissions-context-card__detail-item">
                  <span>{t('staff_permissions.ui.direct_permissions')}</span>
                  <strong>{directPermissionCountLabel}</strong>
                </div>
                <div className="staff-permissions-context-card__detail-item">
                  <span>{t('staff_permissions.ui.role_permissions')}</span>
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
                <b className="text-uppercase">{t('menu.staffs.Staff_Permissions')}</b>
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
                    disabled={!filteredGroups.length}>
                    {t('staff_permissions.ui.enable_visible')}
                  </button>
                  <button
                    type="button"
                    className="staff-permissions-shell__control-btn"
                    onClick={() => toggleVisiblePermissions(false)}
                    disabled={!filteredGroups.length}>
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
                                          toggleStatus={(event) =>
                                            toggleGroupPermissions(groupName, event.target.checked)
                                          }
                                        />
                                      </div>
                                      <div className="card-body py-2">
                                        <ul className="mb-0 staff-permissions-group__list">
                                          {visiblePermissionKeys.map((permissionName) => {
                                            const isDirectEnabled =
                                              permissions[groupName][permissionName]
                                            const isInherited =
                                              rolePermissionNameSet.has(permissionName)
                                            const isEnabled = isDirectEnabled || isInherited
                                            const isInheritedOnly = isInherited && !isDirectEnabled

                                            return (
                                              <li
                                                key={`${groupName}-${permissionName}`}
                                                className={`staff-permissions-group__permission-item ${
                                                  isEnabled ? 'is-enabled' : ''
                                                } ${isInherited ? 'is-inherited' : ''}`}>
                                                <div className="staff-permissions-group__permission-content">
                                                  <p>
                                                    {t(
                                                      `staff_permissions.permissions.${permissionName}`
                                                    )}
                                                  </p>
                                                  {isInherited && (
                                                    <small className="staff-permissions-group__inherited-tag">
                                                      {t(
                                                        'staff_permissions.ui.inherited_from_role'
                                                      )}
                                                    </small>
                                                  )}
                                                </div>
                                                <AndroidSwitch
                                                  value={isEnabled}
                                                  disabled={isInheritedOnly}
                                                  toggleStatus={(event) =>
                                                    setChange(
                                                      groupName,
                                                      permissionName,
                                                      event.target.checked
                                                    )
                                                  }
                                                />
                                              </li>
                                            )
                                          })}
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
                loading={loading?.staffPermissions || false}
                endIcon={<Save size={20} />}
                onclick={(event) => updatePermissions(event)}
                disabled={loading?.staffPermissions}
              />
            </div>
          </div>
        </>
      )}
    </section>
  )
}
