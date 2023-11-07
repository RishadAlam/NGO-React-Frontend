import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useLoadingState } from '../../atoms/loaderAtoms'
import xFetch from '../../utilities/xFetch'
import StaffFormModal from './StaffFormModal'

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

        if (name !== 'phone' && name !== 'password' && name !== 'confirm_password') {
          val === ''
            ? (draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_required`)}`)
            : delete draftErr[name]

          if (val !== '' && name === 'email') {
            !/\S+@\S+\.\S+/.test(val)
              ? (draftErr.email = `${t(`common.${name}`)} ${t(`common_validation.is_required`)}`)
              : delete draftErr.email
          }
          return
        }

        if (name === 'password' && name !== 'phone') {
          const reg = new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/
          )
          val !== '' && !reg.test(val)
            ? (draftErr.password = ` ${t(`common_validation.week`)} ${t('common.password')}`)
            : delete draftErr.password
          return
        }
        if (name === 'confirm_password' && name !== 'phone') {
          val !== '' && staffData.password !== val
            ? (draftErr.confirm_password = `${t('common_validation.confirm_password_not_match')}`)
            : delete draftErr.confirm_password
          return
        }

        name === 'phone' && !isNaN(val)
          ? delete draftErr.phone
          : (draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_required`)}`)
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
    xFetch(`users/${staffData.id}`, staffData, null, accessToken, null, 'PUT')
      .then((response) => {
        setLoading({ ...loading, staffForm: false })
        if (response?.success) {
          toast.success(response.message)
          mutate()
          setIsOpen(false)
          setStaffData({
            name: '',
            email: '',
            password: '',
            confirm_password: '',
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
      .catch((errResponse) => {
        setLoading({ ...loading, staffForm: false })
        setError((prevErr) =>
          create(prevErr, (draftErr) => {
            if (!errResponse?.errors) {
              draftErr.message = errResponse?.message
              return
            }
            return rawReturn(errResponse?.errors || errResponse)
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
        modalTitle={t('staffs.Staff_Edit')}
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
