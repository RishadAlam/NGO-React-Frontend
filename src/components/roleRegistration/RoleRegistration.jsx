import { create } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import Pen from '../../icons/Pen'
import XCircle from '../../icons/XCircle'
import xFetch from '../../utilities/xFetch'
import LoaderSm from '../loaders/LoaderSm'
import Button from '../utilities/Button'
import ModalPro from '../utilities/ModalPro'
import TextInputField from '../utilities/TextInputField'

export default function RoleRegistration({ isRoleModalOpen, setIsRoleModalOpen, t, mutate }) {
  const [roleName, setRoleName] = useState('')
  const [error, setError] = useState({ name: '' })
  const [loading, setLoading] = useLoadingState({})
  const { accessToken } = useAuthDataValue()

  const setChange = (val) => {
    setRoleName(val)
    setError((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message
        val !== '' ? delete draftErr.name : (draftErr.name = t('staff_roles.Role_Name_is_Required'))
      })
    )
  }

  const submit = (event) => {
    event.preventDefault()
    if (roleName === '') {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    setLoading({ ...loading, roleName: true })
    const requestData = {
      name: roleName
    }

    xFetch('roles', requestData, null, accessToken, null, 'POST').then((response) => {
      setLoading({ ...loading, roleName: false })
      if (response?.success) {
        toast.success(response.message)
        mutate()
        setRoleName('')
        setIsRoleModalOpen(false)
        return
      }
      setError((prevErr) =>
        create(prevErr, (draftErr) => {
          if (response?.message) {
            draftErr.message = response?.message
            return
          }
          draftErr = response?.errors || response
        })
      )
    })
  }

  return (
    <>
      <ModalPro open={isRoleModalOpen} handleClose={() => setIsRoleModalOpen(false)}>
        <div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center justify-content-between">
              <b className="text-uppercase">{t('staff_roles.Staff_Roles_Registration')}</b>
              <Button
                className={'text-danger p-0'}
                loading={false}
                endIcon={<XCircle size={30} />}
                onclick={() => setIsRoleModalOpen(false)}
              />
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-12 mb-3">
                {error?.message && error?.message !== '' && (
                  <div className="alert alert-danger" role="alert">
                    <strong>{error?.message}</strong>
                  </div>
                )}
                <TextInputField
                  label={t('common.name')}
                  isRequired={true}
                  defaultValue={roleName}
                  setChange={setChange}
                  error={error?.name}
                />
              </div>
            </div>
          </div>
          <div className="card-footer text-end">
            <Button
              name={t('common.registration')}
              className={'btn-primary py-2 px-3'}
              loading={false}
              endIcon={
                loading?.roleName ? (
                  <LoaderSm size={20} clr="#8884d8" className="ms-2" />
                ) : (
                  <Pen size={20} />
                )
              }
              onclick={submit}
              disabled={Object.keys(error).length || loading?.roleName}
            />
          </div>
        </div>
      </ModalPro>
    </>
  )
}
