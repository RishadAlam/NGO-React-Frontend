import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useLoadingState } from '../../atoms/loaderAtoms'
import xFetch from '../../utilities/xFetch'
import CenterFormModal from './CenterFormModal'

export default function CenterUpdate({ isOpen, setIsOpen, data, accessToken, t, mutate }) {
  const [centerData, setCenterData] = useState({ ...data })
  const [error, setError] = useState({})
  const [loading, setLoading] = useLoadingState({})

  const setChange = (val, name) => {
    setCenterData((prevData) =>
      create(prevData, (draftData) => {
        draftData[name] = val
      })
    )

    setError((prevErr) =>
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
    xFetch(`centers/${centerData.id}`, centerData, null, accessToken, null, 'PUT')
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
        setLoading({ ...loading, centerForm: false })
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
      <CenterFormModal
        open={isOpen}
        setOpen={setIsOpen}
        error={error}
        modalTitle={t('center.Center_Edit')}
        btnTitle={t('common.update')}
        defaultValues={centerData}
        setChange={setChange}
        t={t}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
