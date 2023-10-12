import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useLoadingState } from '../../atoms/loaderAtoms'
import xFetch from '../../utilities/xFetch'
import CategoryFormModal from './CategoryFormModal'

export default function CategoryUpdate({ isOpen, setIsOpen, data, accessToken, t, mutate }) {
  const [categoryData, setCategoryData] = useState({ ...data })
  const [error, setError] = useState({})
  const [loading, setLoading] = useLoadingState({})

  const setChange = (val, name) => {
    setCategoryData((prevData) =>
      create(prevData, (draftData) => {
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
    if (categoryData.name === '' || categoryData.group === null) {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    if (categoryData.saving === false && categoryData.loan === false) {
      setError((prevErr) =>
        create(prevErr, (draftErr) => {
          draftErr.saving = `${t('common.saving')} ${t('common_validation.is_required')}`
          draftErr.loan = `${t('common.loan')} ${t('common_validation.is_required')}`
        })
      )
      return
    }

    setLoading({ ...loading, categoryForm: true })
    xFetch(`categories/${categoryData.id}`, categoryData, null, accessToken, null, 'PUT')
      .then((response) => {
        setLoading({ ...loading, categoryForm: false })
        if (response?.success) {
          toast.success(response.message)
          mutate()
          setIsOpen(false)
          setCategoryData({
            name: '',
            group: null,
            description: '',
            saving: false,
            loan: false
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
        setLoading({ ...loading, categoryForm: false })
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
      <CategoryFormModal
        open={isOpen}
        setOpen={setIsOpen}
        error={error}
        modalTitle={t('category.Category_Edit')}
        btnTitle={t('common.update')}
        defaultValues={categoryData}
        setChange={setChange}
        t={t}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
