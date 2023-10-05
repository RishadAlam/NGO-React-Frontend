import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useLoadingState } from '../../atoms/loaderAtoms'
import xFetch from '../../utilities/xFetch'
import FieldFormModal from './FieldFormModal'

export default function FieldRegistration({ isOpen, setIsOpen, accessToken, t, mutate }) {
  const [fieldData, setFieldData] = useState({
    name: '',
    description: ''
  })
  const [errors, setErrors] = useState({
    name: ''
  })
  const [loading, setLoading] = useLoadingState({})
  const setChange = (val, name) => {
    setFieldData((prevData) =>
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
    if (fieldData.name === '') {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    setLoading({ ...loading, fieldForm: true })
    xFetch('fields', fieldData, null, accessToken, null, 'POST')
      .then((response) => {
        setLoading({ ...loading, fieldForm: false })
        if (response?.success) {
          toast.success(response.message)
          mutate()
          setIsOpen(false)
          setFieldData({
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
        setLoading({ ...loading, fieldForm: false })
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
      <FieldFormModal
        open={isOpen}
        setOpen={setIsOpen}
        error={errors}
        modalTitle={t('field.Field_Registration')}
        btnTitle={t('common.registration')}
        defaultValues={fieldData}
        setChange={setChange}
        t={t}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
