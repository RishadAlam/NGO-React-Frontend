import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useLoadingState } from '../../atoms/loaderAtoms'
import tsNumbers from '../../libs/tsNumbers'
import xFetch from '../../utilities/xFetch'
import MetaFormModal from './MetaFormModal'

export default function CreateAuditReportMeta({ isOpen, setIsOpen, accessToken, t, mutate }) {
  const [errors, setErrors] = useState({ meta_key: '', page_no: '', column_no: '' })
  const [loading, setLoading] = useLoadingState({})
  const [metaData, setMetaData] = useState({
    meta_key: '',
    meta_value: '',
    page_no: '',
    column_no: ''
  })

  const setChange = (val, name) => {
    setMetaData((prevData) =>
      create(prevData, (draftData) => {
        if (name === 'page_no') {
          draftData.page_no = val?.id || ''
          draftData.page = val || null
          return
        }
        draftData[name] = name !== 'column_no' ? val : tsNumbers(val, true)
      })
    )

    setErrors((prevErr) =>
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
    xFetch('audit/meta', metaData, null, accessToken, null, 'POST')
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
        setLoading({ ...loading, metaForm: false })
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
      <MetaFormModal
        open={isOpen}
        setOpen={setIsOpen}
        error={errors}
        modalTitle={t('audit_report_meta.create_meta')}
        btnTitle={t('common.create')}
        defaultValues={metaData}
        setChange={setChange}
        t={t}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
