import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useLoadingState } from '../../atoms/loaderAtoms'
import xFetch from '../../utilities/xFetch'
import MetaFormModal from './MetaFormModal'

export default function MetaUpdate({ isOpen, setIsOpen, data, accessToken, t, mutate }) {
  const [metaData, setMetaData] = useState({ ...data })
  const [error, setError] = useState({})
  const [loading, setLoading] = useLoadingState({})

  const setChange = (val, name) => {
    setMetaData((prevData) =>
      create(prevData, (draftData) => {
        // if (name === 'field') {
        //   draftData.field_id = val?.id || ''
        //   draftData.field = val || null
        //   return
        // }

        draftData[name] = val
      })
    )

    setError((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message
        val === '' || val === null
          ? (draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_required`)}`)
          : delete draftErr[name]
      })
    )
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (metaData.meta_key === '' || metaData.page_no === '' || metaData.column_no === '') {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    setLoading({ ...loading, metaForm: true })
    xFetch(`audit/meta/${metaData.id}`, metaData, null, accessToken, null, 'PUT')
      .then((response) => {
        setLoading({ ...loading, metaForm: false })
        if (response?.success) {
          toast.success(response.message)
          mutate()
          setIsOpen(false)
          setMetaData({
            meta_key: '',
            meta_value: '',
            page_no: '',
            column_no: ''
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
        setLoading({ ...loading, metaForm: false })
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
      <MetaFormModal
        open={isOpen}
        setOpen={setIsOpen}
        error={error}
        modalTitle={t('audit_report_meta.edit_meta')}
        btnTitle={t('common.update')}
        defaultValues={metaData}
        setChange={setChange}
        t={t}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
