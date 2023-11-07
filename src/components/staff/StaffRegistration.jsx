import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useLoadingState } from '../../atoms/loaderAtoms'
import xFetch from '../../utilities/xFetch'
import StaffFormModal from './StaffFormModal'

export default function StaffRegistration({ isOpen, setIsOpen, accessToken, t, mutate }) {
  const [staffData, setStaffData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    role: ''
  })
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: ''
  })
  const [loading, setLoading] = useLoadingState({})
  const setChange = (val, name) => {
    setStaffData((prevData) =>
      create(prevData, (draftData) => {
        draftData[name] = name === 'email' ? val.toLowerCase() : val
      })
    )

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message

        if (name !== 'phone') {
          val === ''
            ? (draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_required`)}`)
            : delete draftErr[name]

          if (val !== '' && name === 'email') {
            !/\S+@\S+\.\S+/.test(val)
              ? (draftErr.email = `${t(`common.${name}`)} ${t(`common_validation.is_invalid`)}`)
              : delete draftErr.email
          }
          if (val !== '' && name === 'password') {
            const reg = new RegExp('^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,32}$')
            !reg.test(val)
              ? (draftErr.password = ` ${t(`common_validation.week`)} ${t('common.password')}`)
              : delete draftErr.password
          }
          if (val !== '' && name === 'confirm_password') {
            staffData.password !== val
              ? (draftErr.confirm_password = `${t('common_validation.confirm_password_not_match')}`)
              : delete draftErr.confirm_password
          }

          return
        }

        name === 'phone' && !isNaN(val)
          ? delete draftErr.phone
          : (draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_invalid`)}`)
      })
    )
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (
      staffData.name === '' ||
      staffData.email === '' ||
      staffData.password === '' ||
      staffData.confirm_password === '' ||
      staffData.role === ''
    ) {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    setLoading({ ...loading, staffForm: true })
    xFetch('users', staffData, null, accessToken, null, 'POST')
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
        setErrors((prevErr) =>
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
        setErrors((prevErr) =>
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
        error={errors}
        modalTitle={t('staffs.Staff_Registration')}
        btnTitle={t('common.registration')}
        defaultValues={staffData}
        setChange={setChange}
        t={t}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
