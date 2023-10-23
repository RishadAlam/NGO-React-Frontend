import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import xFetch from '../../utilities/xFetch'
import ExpenseCategoriesFormModal from './ExpenseCategoriesFormModal'

export default function ExpenseCategoriesRegistration({ isOpen, setIsOpen, mutate }) {
  const { t } = useTranslation()
  const { accessToken } = useAuthDataValue()
  const [expenseCategoriesData, setExpenseCategoriesData] = useState({
    name: '',
    description: ''
  })
  const [errors, setErrors] = useState({ name: '' })
  const [loading, setLoading] = useLoadingState({})
  const setChange = (val, name) => {
    setExpenseCategoriesData((prevData) =>
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
    if (expenseCategoriesData.name === '') {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    setLoading({ ...loading, expenseCategoriesForm: true })
    xFetch('expense-categories', expenseCategoriesData, null, accessToken, null, 'POST')
      .then((response) => {
        setLoading({ ...loading, expenseCategoriesForm: false })
        if (response?.success) {
          toast.success(response.message)
          mutate()
          setIsOpen(false)
          setExpenseCategoriesData({
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
        setLoading({ ...loading, expenseCategoriesForm: false })
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
      <ExpenseCategoriesFormModal
        open={isOpen}
        setOpen={setIsOpen}
        error={errors}
        modalTitle={t('expense_categories.Expense_Categories_Registration')}
        btnTitle={t('common.registration')}
        defaultValues={expenseCategoriesData}
        setChange={setChange}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
