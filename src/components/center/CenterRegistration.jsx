import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useLoadingState } from '../../atoms/loaderAtoms'
import xFetch from '../../utilities/xFetch'
import CenterFormModal from './CenterFormModal'

export default function CenterRegistration({ isOpen, setIsOpen, accessToken, t, mutate }) {
  const [centerData, setCenterData] = useState({
    name: '',
    description: ''
  })
  const [errors, setErrors] = useState({ name: '' })
  const [loading, setLoading] = useLoadingState({})
  const setChange = (val, name) => {
    setCenterData((prevData) =>
      create(prevData, (draftData) => {
        draftData[name] = val
      })
    )

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message
        val === ''
          ? (draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_required`)}`)
          : delete draftErr[name]
      })
    )
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (centerData.name === '') {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    setLoading({ ...loading, centerForm: true })
    xFetch('centers', centerData, null, accessToken, null, 'POST')
      .then((response) => {
        setLoading({ ...loading, centerForm: false })
        if (response?.success) {
          toast.success(response.message)
          mutate()
          setIsOpen(false)
          setCenterData({
            name: '',
            description: ''
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
        setLoading({ ...loading, centerForm: false })
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
      <CenterFormModal
        open={isOpen}
        setOpen={setIsOpen}
        error={errors}
        modalTitle={t('center.Center_Registration')}
        btnTitle={t('common.registration')}
        defaultValues={centerData}
        setChange={setChange}
        t={t}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
