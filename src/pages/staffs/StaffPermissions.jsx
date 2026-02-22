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
import Search from '../../icons/Search'
import Save from '../../icons/Save'
import xFetch from '../../utilities/xFetch'
import './staffs.scss'

export default function StaffPermissions() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [permissions, setPermissions] = useState({})
  const [error, setError] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [showEnabledOnly, setShowEnabledOnly] = useState(false)
  const [loading, setLoading] = useLoadingState({})
  const normalizedSearch = searchQuery.trim().toLowerCase()
  const { accessToken, id: authId } = useAuthDataValue()
  const {
    data: {
      data: { allPermissions, userPermissions } = {
        allPermissions: [],
        userPermissions: []
      }
    } = [],
    mutate,
    isLoading
  } = useFetch({ action: `permissions/${id}` })

  const filteredGroups = useMemo(() => {
    return Object.keys(permissions)
      .map((groupName) => {
        const groupPermissions = permissions[groupName]
        const groupLabel = t(`staff_permissions.group_name.${groupName}`)
        const permissionKeys = Object.keys(groupPermissions)

        const visiblePermissionKeys = permissionKeys.filter((permissionName) => {
          if (showEnabledOnly && !groupPermissions[permissionName]) return false
          if (!normalizedSearch) return true

          const permissionLabel = t(`staff_permissions.permissions.${permissionName}`).toLowerCase()
          return (
            permissionLabel.includes(normalizedSearch) ||
            permissionName.toLowerCase().includes(normalizedSearch) ||
            groupLabel.toLowerCase().includes(normalizedSearch)
          )
        })

        const enabledCount = permissionKeys.filter(
          (permissionName) => groupPermissions[permissionName]
        ).length

        return {
          groupName,
          groupLabel,
          permissionKeys,
          visiblePermissionKeys,
          enabledCount
        }
      })
      .filter(({ visiblePermissionKeys }) => visiblePermissionKeys.length > 0)
      .sort((leftGroup, rightGroup) => leftGroup.groupLabel.localeCompare(rightGroup.groupLabel))
  }, [normalizedSearch, permissions, showEnabledOnly, t])

  const permissionStats = useMemo(() => {
    let groupCount = 0
    let totalCount = 0
    let enabledCount = 0

    Object.keys(permissions).forEach((groupName) => {
      groupCount += 1
      Object.keys(permissions[groupName]).forEach((permissionName) => {
        totalCount += 1
        if (permissions[groupName][permissionName]) {
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
      groupCount,
      totalCount,
      enabledCount,
      visibleGroupCount,
      visibleCount
    }
  }, [filteredGroups, permissions])

  useEffect(() => {
    if (Number(authId) === Number(id)) {
      return navigate('/unauthorized')
    }

    allPermissions.length &&
      setPermissions(() =>
        create({}, (draftPerm) => {
          allPermissions.forEach((permission) => {
            if (typeof draftPerm[permission.group_name] !== 'object') {
              draftPerm[permission.group_name] = {}
            }
            draftPerm[permission.group_name][permission.name] = userPermissions.includes(
              permission.name
            )
          })
        })
      )
    setError({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPermissions, authId, id, userPermissions])

  const clearErrors = () => {
    if (Object.keys(error).length) setError({})
  }

  const setChange = (group_name, permission, isChecked) => {
    clearErrors()
    setPermissions((prevPerm) =>
      create(prevPerm, (draftPerm) => {
        draftPerm[group_name][permission] = isChecked
      })
    )
  }

  const setGroupChecked = (permissions) => {
    return Object.keys(permissions).every((permission) => permissions[permission])
  }

  const toggleGroupPermissions = (group, isChecked) => {
    clearErrors()
    setPermissions((prevPerm) =>
      create(prevPerm, (draftPerm) => {
        Object.keys(draftPerm[group]).forEach((permission) => {
          draftPerm[group][permission] = isChecked
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
          visiblePermissionKeys.forEach((permission) => {
            draftPerm[groupName][permission] = isChecked
          })
        })
      })
    )
  }

  const updatePermissions = (event) => {
    event.preventDefault()
    const staffPermissions = []

    Object.keys(permissions).forEach((group) => {
      Object.keys(permissions[group]).forEach((permission) => {
        if (permissions[group][permission]) {
          staffPermissions.push(permission)
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

  return (
    <>
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
          <div className="staff-permissions-shell card my-3">
            <div className="card-header staff-permissions-shell__header">
              <div className="staff-permissions-shell__title-wrap">
                <b className="text-uppercase">{t('menu.staffs.Staff_Permissions')}</b>
                <p className="mb-0">
                  {t('staff_permissions.ui.list_showing', {
                    visible: permissionStats.visibleCount,
                    total: permissionStats.totalCount,
                    groups: permissionStats.visibleGroupCount
                  })}
                </p>
              </div>
              <div className="staff-permissions-shell__stats">
                <div className="staff-permissions-shell__stat">
                  <span>{t('staff_permissions.ui.groups')}</span>
                  <strong>{permissionStats.groupCount}</strong>
                </div>
                <div className="staff-permissions-shell__stat">
                  <span>{t('staff_permissions.ui.enabled')}</span>
                  <strong>{permissionStats.enabledCount}</strong>
                </div>
                <div className="staff-permissions-shell__stat">
                  <span>{t('staff_permissions.ui.total')}</span>
                  <strong>{permissionStats.totalCount}</strong>
                </div>
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
                  {searchQuery && (
                    <button
                      type="button"
                      className="staff-permissions-shell__control-btn"
                      onClick={() => setSearchQuery('')}>
                      {t('staff_permissions.ui.clear')}
                    </button>
                  )}
                </div>
              </div>

              <div className="staff-permissions-grid row g-3">
                {filteredGroups.length > 0 ? (
                  filteredGroups.map(
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
                                  enabled: enabledCount,
                                  total: permissionKeys.length
                                })}
                              </small>
                            </div>
                            <AndroidSwitch
                              value={setGroupChecked(permissions[groupName])}
                              toggleStatus={(e) =>
                                toggleGroupPermissions(groupName, e.target.checked)
                              }
                            />
                          </div>
                          <div className="card-body py-2">
                            <ul className="mb-0 staff-permissions-group__list">
                              {visiblePermissionKeys.map((permission) => (
                                <li
                                  key={`${groupName}-${permission}`}
                                  className={`staff-permissions-group__permission-item ${
                                    permissions[groupName][permission] ? 'is-enabled' : ''
                                  }`}>
                                  <p>{t(`staff_permissions.permissions.${permission}`)}</p>
                                  <AndroidSwitch
                                    value={permissions[groupName][permission]}
                                    toggleStatus={(e) =>
                                      setChange(groupName, permission, e.target.checked)
                                    }
                                  />
                                </li>
                              ))}
                            </ul>
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
                onclick={(e) => updatePermissions(e)}
                disabled={loading?.staffPermissions}
              />
            </div>
          </div>
        )}
      </section>
    </>
  )
}
