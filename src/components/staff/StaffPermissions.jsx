import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { checkPermission } from '../../helper/checkPermission'
import CheckCircle from '../../icons/CheckCircle'
import ExternalLink from '../../icons/ExternalLink'
import XCircle from '../../icons/XCircle'
import Button from '../utilities/Button'
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
  const { staff_id, staff_permissions } = data
  // eslint-disable-next-line no-unused-vars
  const [permissions, setPermissions] = useState((permissions = {}) => {
    staff_permissions.forEach((permission) => {
      if (!Array.isArray(permissions[permission.group_name])) {
        permissions[permission.group_name] = []
      }
      permissions[permission.group_name].push(permission.name)
    })
    return permissions
  })

  return (
    <>
      <ModalPro open={isOpen} handleClose={() => setIsOpen(false)}>
        <div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center justify-content-between">
              <b className="text-uppercase">{modalTitle}</b>
              <Button
                className={'text-danger p-0'}
                loading={false}
                endIcon={<XCircle size={30} />}
                onclick={() => setIsOpen(false)}
              />
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              {Object.keys(permissions).length > 0 ? (
                Object.keys(permissions).map((group_name, index) => {
                  return (
                    <Fragment key={index}>
                      <div className="col-lg-6 mb-3">
                        <div className="card">
                          <div className="card-header">
                            <div className="d-flex align-items-center justify-content-between">
                              <b className="text-uppercase">
                                {t(`staff_permissions.group_name.${group_name}`)}
                              </b>
                            </div>
                          </div>
                          <div className="card-body">
                            <ul className="mb-0">
                              {permissions[group_name].map((permission, key) => {
                                return (
                                  <Fragment key={key}>
                                    <li>
                                      <div className="row mb-2 align-items-center">
                                        <div className="col-10">
                                          <h6>
                                            {t(`staff_permissions.permissions.${permission}`)}
                                          </h6>
                                        </div>
                                        <div className="col-2 text-end text-success">
                                          <CheckCircle size={20} />
                                        </div>
                                      </div>
                                    </li>
                                  </Fragment>
                                )
                              })}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  )
                })
              ) : (
                <div
                  className="col-md-12 d-flex align-items-center justify-content-center"
                  style={{ height: '100px' }}>
                  <h4>{t('common.No_Records_Found')}</h4>
                </div>
              )}
            </div>
          </div>
          {authId !== staff_id && checkPermission('staff_permission_update', authPermissions) && (
            <div className="card-footer text-end">
              <Link
                to={`/staff-permissions/${staff_id}`}
                className={'btn-primary btn btn-block btn-primary py-2 px-3'}>
                {btnTitle}
                &nbsp;
                <ExternalLink size={20} />
              </Link>
            </div>
          )}
        </div>
      </ModalPro>
    </>
  )
}
