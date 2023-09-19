import React, { Fragment, useState } from 'react'
import CheckCircle from '../../icons/CheckCircle'
import XCircle from '../../icons/XCircle'
import Button from '../utilities/Button'
import ModalPro from '../utilities/ModalPro'

export default function StaffPermissions({ isOpen, setIsOpen, t, data, modalTitle, btnTitle }) {
  const [permissions, setPermissions] = useState((permissions = {}) => {
    data.forEach((permission) => {
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
                      <div className="col-md-6 mb-3">
                        <div className="card">
                          <div className="card-header">
                            <div className="d-flex align-items-center justify-content-between">
                              <b className="text-uppercase">
                                {t(`staff_permissions.group_name.${group_name}`)}
                              </b>
                            </div>
                          </div>
                          <div className="card-body">
                            <ul>
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
          <div className="card-footer text-end">
            {/* <Button
              type="submit"
              name={btnTitle}
              className={'btn-primary py-2 px-3'}
              loading={loading?.staffForm || false}
              endIcon={<Save size={20} />}
              disabled={Object.keys(error).length || loading?.staffForm}
            /> */}
          </div>
        </div>
      </ModalPro>
    </>
  )
}
