import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useLoadingState } from '../../atoms/loaderAtoms'
import xFetch from '../../utilities/xFetch'
import CategoryFormModal from './CategoryFormModal'

export default function CategoryRegistration({ isOpen, setIsOpen, accessToken, t, mutate }) {
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
    saving: false,
    loan: false
  })
  const [errors, setErrors] = useState({ name: '' })
  const [loading, setLoading] = useLoadingState({})
  const setChange = (val, name) => {
    setCategoryData((prevData) =>
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
    if (categoryData.name === '') {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    setLoading({ ...loading, categoryForm: true })
    xFetch('categories', categoryData, null, accessToken, null, 'POST')
      .then((response) => {
        setLoading({ ...loading, categoryForm: false })
        if (response?.success) {
          toast.success(response.message)
          mutate()
          setIsOpen(false)
          setCategoryData({
            name: '',
            description: '',
            saving: false,
            loan: false
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
        setLoading({ ...loading, categoryForm: false })
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
      <CategoryFormModal
        open={isOpen}
        setOpen={setIsOpen}
        error={errors}
        modalTitle={t('category.Category_Registration')}
        btnTitle={t('common.registration')}
        defaultValues={categoryData}
        setChange={setChange}
        t={t}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
