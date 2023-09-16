import { create } from 'mutative'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useLoadingState } from '../../atoms/loaderAtoms'
import xFetch from '../../utilities/xFetch'
import RoleFormModal from '../_helper/RoleFormModal'

export default function RoleUpdate({
  isOpen,
  setIsOpen,
  accessToken,
  data: { id, name },
  t,
  mutate
}) {
  const [roleName, setRoleName] = useState(name)
  const [errors, setErrors] = useState({ name: '' })
  const [loading, setLoading] = useLoadingState({})

  const setChange = (val) => {
    setRoleName(val)
    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message
        val !== '' ? delete draftErr.name : (draftErr.name = t('staff_roles.Role_Name_is_Required'))
      })
    )
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (roleName === '') {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    setLoading({ ...loading, roleName: true })
    const requestData = {
      name: roleName
    }

    xFetch(`roles/${id}`, requestData, null, accessToken, null, 'PUT').then((response) => {
      setLoading({ ...loading, roleName: false })
      if (response?.success) {
        toast.success(response.message)
        mutate()
        setRoleName('')
        setIsOpen(false)
        return
      }
      setErrors((prevErr) =>
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
      <RoleFormModal
        open={isOpen}
        setOpen={setIsOpen}
        error={errors}
        modalTitle={t('staff_roles.Staff_Roles_Update')}
        btnTitle={t('common.update')}
        defaultValue={roleName}
        setChange={setChange}
        t={t}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
