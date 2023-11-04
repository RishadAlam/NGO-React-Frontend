import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import xFetch from '../../utilities/xFetch'
import IncomeCategoriesFormModal from './IncomeCategoriesFormModal'

export default function IncomeCategoriesRegistration({ isOpen, setIsOpen, mutate }) {
  const { t } = useTranslation()
  const { accessToken } = useAuthDataValue()
  const [incomeCategoriesData, setIncomeCategoriesData] = useState({
    name: '',
    description: ''
  })
  const [errors, setErrors] = useState({ name: '' })
  const [loading, setLoading] = useLoadingState({})
  const setChange = (val, name) => {
    setIncomeCategoriesData((prevData) =>
      create(prevData, (draftData) => {
        draftData[name] = val
      })
    )

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message
        val === '' && name === 'name'
          ? (draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_required`)}`)
          : delete draftErr[name]
      })
    )
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (incomeCategoriesData.name === '') {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    setLoading({ ...loading, incomeCategoriesForm: true })
    xFetch('accounts/incomes/categories', incomeCategoriesData, null, accessToken, null, 'POST')
      .then((response) => {
        setLoading({ ...loading, incomeCategoriesForm: false })
        if (response?.success) {
          toast.success(response.message)
          mutate()
          setIsOpen(false)
          setIncomeCategoriesData({
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
        setLoading({ ...loading, incomeCategoriesForm: false })
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
      <IncomeCategoriesFormModal
        open={isOpen}
        setOpen={setIsOpen}
        error={errors}
        modalTitle={t('income_categories.Income_Categories_Registration')}
        btnTitle={t('common.registration')}
        defaultValues={incomeCategoriesData}
        setChange={setChange}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
