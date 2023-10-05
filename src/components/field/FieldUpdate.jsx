import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useLoadingState } from '../../atoms/loaderAtoms'
import xFetch from '../../utilities/xFetch'
import FieldFormModal from './FieldFormModal'

export default function FieldUpdate({ isOpen, setIsOpen, data, accessToken, t, mutate }) {
  const [fieldData, setFieldData] = useState({ ...data })
  const [error, setError] = useState({})
  const [loading, setLoading] = useLoadingState({})

  const setChange = (val, name) => {
    setFieldData((prevData) =>
      create(prevData, (draftData) => {
        draftData[name] = val
      })
    )

    setError((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message
        val === ''
          ? (draftErr[name] = `${t(`common.${name}`)} ${t(`common.common_validation.is_required`)}`)
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
    xFetch(`fields/${fieldData.id}`, fieldData, null, accessToken, null, 'PUT').then((response) => {
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
      <FieldFormModal
        open={isOpen}
        setOpen={setIsOpen}
        error={error}
        modalTitle={t('field.Field_Edit')}
        btnTitle={t('common.update')}
        defaultValues={fieldData}
        setChange={setChange}
        t={t}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
