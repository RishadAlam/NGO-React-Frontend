import { create, rawReturn } from 'mutative'
import { Fragment, useEffect, useState } from 'react'
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
import xFetch from '../../utilities/xFetch'

export default function StaffPermissions() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [permissions, setPermissions] = useState({})
  const [error, setError] = useState({})
  const [loading, setLoading] = useLoadingState({})
  const { accessToken, id: authId } = useAuthDataValue()
  const {
    data: {
      data: { allPermissions, userPermissions } = {
        allPermissions: [],
        userPermissions: []
      }
    } = [],
    mutate,
    isLoading,
    isError
  } = useFetch({ action: `permissions/${id}` })

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPermissions, authId, id, userPermissions])

  const setChange = (group_name, permission, isChecked) => {
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
    setPermissions((prevPerm) =>
      create(prevPerm, (draftPerm) => {
        Object.keys(draftPerm[group]).forEach((permission) => {
          draftPerm[group][permission] = isChecked
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
    xFetch(
      `permissions/${id}`,
      { permissions: staffPermissions },
      null,
      accessToken,
      null,
      'PUT'
    ).then((response) => {
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
  }

  return (
    <>
      <section className="staff-permissions">
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
          <div className="card my-3">
            <div className="card-header">
              <b className="text-uppercase">{t('menu.staffs.Staff_Permissions')}</b>
            </div>
            <div className="card-body py-0 px-2">
              <div className="row">
                {Object.keys(permissions).length > 0 &&
                  Object.keys(permissions).map((group, index) => (
                    <Fragment key={index}>
                      <div className="col-lg-6 col-xxl-4 m-0 p-0 border border-1">
                        <div className="card rounded-0 border-0">
                          <div className="card-header rounded-0">
                            <div className="d-flex align-items-center justify-content-between">
                              <b className="text-capitalize">
                                {t(`staff_permissions.group_name.${group}`)}
                              </b>
                              <AndroidSwitch
                                value={setGroupChecked(permissions[group])}
                                toggleStatus={(e) =>
                                  toggleGroupPermissions(group, e.target.checked)
                                }
                              />
                            </div>
                          </div>
                          <div className="card-body">
                            <ul className="mb-0">
                              {Object.keys(permissions[group]).map((permission, key) => (
                                <Fragment key={key}>
                                  <li>
                                    <div className="row mb-2 align-items-center">
                                      <div className="col-10">
                                        <h6>{t(`staff_permissions.permissions.${permission}`)}</h6>
                                      </div>
                                      <div className="col-2 text-end text-success">
                                        <AndroidSwitch
                                          value={permissions[group][permission]}
                                          toggleStatus={(e) =>
                                            setChange(group, permission, e.target.checked)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </li>
                                </Fragment>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  ))}
              </div>
            </div>
            <div className="card-footer text-center">
              <Button
                type="button"
                name={t('common.update')}
                className={'btn-primary py-2 px-3'}
                loading={loading?.staffPermissions || false}
                endIcon={<Save size={20} />}
                onclick={(e) => updatePermissions(e)}
                disabled={Object.keys(error).length || loading?.staffPermissions}
              />
            </div>
          </div>
        )}
      </section>
    </>
  )
}
