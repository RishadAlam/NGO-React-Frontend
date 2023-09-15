import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useLoadingState } from '../../atoms/loaderAtoms'
import xFetch from '../../utilities/xFetch'
import StaffFormModal from '../_helper/StaffFormModal'

export default function StaffUpdate({ isOpen, setIsOpen, data, accessToken, t, mutate }) {
  const [staffData, setStaffData] = useState({ ...data })
  const [error, setError] = useState({})
  const [loading, setLoading] = useLoadingState({})

  const setChange = (val, name) => {
    setStaffData((prevData) =>
      create(prevData, (draftData) => {
        draftData[name] = val
      })
    )

    setError((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message

        if (name !== 'phone') {
          val === ''
            ? (draftErr[name] = `${t(`common.${name}`)} is Required!`)
            : delete draftErr[name]

          if (val !== '' && name === 'email') {
            !/\S+@\S+\.\S+/.test(val)
              ? (draftErr.email = `${t(`common.${name}`)} is invalid!`)
              : delete draftErr.email
          }
        }
      })
    )
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (staffData.name === '' || staffData.email === '' || staffData.role === '') {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    setLoading({ ...loading, staffForm: true })
    xFetch(`users/${staffData.id}`, staffData, null, accessToken, null, 'PUT').then((response) => {
      setLoading({ ...loading, staffForm: false })
      if (response?.success) {
        toast.success(response.message)
        mutate()
        setIsOpen(false)
        setStaffData({
          name: '',
          email: '',
          phone: '',
          role: ''
        })
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
      <StaffFormModal
        open={isOpen}
        setOpen={setIsOpen}
        error={error}
        modalTitle={t('staffs.Staff_Registration')}
        btnTitle={t('common.update')}
        defaultValues={staffData}
        setChange={setChange}
        t={t}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
