import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import xFetch from '../../utilities/xFetch'
import ExpenseCategoriesFormModal from './ExpenseCategoriesFormModal'

export default function ExpenseCategoriesUpdate({ isOpen, setIsOpen, data, mutate }) {
  const { t } = useTranslation()
  const { accessToken } = useAuthDataValue()
  const [expenseCategoriesData, setExpenseCategoriesData] = useState({ ...data })
  const [error, setError] = useState({})
  const [loading, setLoading] = useLoadingState({})

  const setChange = (val, name) => {
    setExpenseCategoriesData((prevData) =>
      create(prevData, (draftData) => {
        draftData[name] = val
      })
    )

    setError((prevErr) =>
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

    setLoading({ ...loading, accountForm: true })
    xFetch(
      `expense-categories/${expenseCategoriesData.id}`,
      expenseCategoriesData,
      null,
      accessToken,
      null,
      'PUT'
    )
      .then((response) => {
        setLoading({ ...loading, accountForm: false })
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
        setLoading({ ...loading, accountForm: false })
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
      <ExpenseCategoriesFormModal
        open={isOpen}
        setOpen={setIsOpen}
        error={error}
        modalTitle={t('expense_categories.Expense_Categories_Edit')}
        btnTitle={t('common.update')}
        defaultValues={expenseCategoriesData}
        setChange={setChange}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
