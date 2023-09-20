import { create } from 'mutative'
import { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import AndroidSwitch from '../../components/utilities/AndroidSwitch'
import useFetch from '../../hooks/useFetch'
import Home from '../../icons/Home'

export default function StaffPermissions() {
  const { id } = useParams()
  const [permissions, setPermissions] = useState({})
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
  const { t } = useTranslation()

  useEffect(() => {
    setPermissions(() =>
      create({}, (draftPerm) => {
        allPermissions.forEach((permission) => {
          if (typeof draftPerm[permission.group_name] !== 'object') {
            draftPerm[permission.group_name] = {}
          }
          draftPerm[permission.group_name][permission.name] =
            userPermissions.includes(permission.name) || true
        })
      })
    )
  }, [allPermissions, userPermissions])

  console.log(permissions)

  const setChange = (group_name, permission, isChecked) => {
    setPermissions((prevPerm) =>
      create(prevPerm, (draftPerm) => (draftPerm[group_name][permission] = isChecked))
    )
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

        <div className="card my-3">
          <div className="card-header">
            <b className="text-uppercase">{t('menu.staffs.Staff_Permissions')}</b>
          </div>
          <div className="card-body py-0 px-2">
            <div className="row">
              {Object.keys(permissions).length &&
                Object.keys(permissions).map((group, index) => (
                  <Fragment key={index}>
                    <div className="col-lg-6 col-xxl-4 m-0 p-0 border border-1">
                      <div className="card rounded-0 border-0">
                        <div className="card-header rounded-0">
                          <div className="d-flex align-items-center justify-content-between">
                            <b className="text-capitalize">
                              {t(`staff_permissions.group_name.${group}`)}
                            </b>
                            <AndroidSwitch />
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
          <div className="card-footer"></div>
        </div>
      </section>
    </>
  )
}
