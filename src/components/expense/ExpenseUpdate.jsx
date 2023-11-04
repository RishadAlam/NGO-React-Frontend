import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import xFetch from '../../utilities/xFetch'
import ExpenseFormModal from './ExpenseFormModal'

export default function ExpenseUpdate({ isOpen, setIsOpen, data, mutate }) {
  const { t } = useTranslation()
  const { accessToken } = useAuthDataValue()
  const [expenseData, setExpenseData] = useState({ ...data })
  const [error, setError] = useState({})
  const [loading, setLoading] = useLoadingState({})

  const setChange = (val, name) => {
    setExpenseData((prevData) =>
      create(prevData, (draftData) => {
        if (name === 'expense_category_id') {
          draftData.expense_category_id = val?.id || ''
          draftData.category = val
          return
        }
        if (name === 'amount') {
          draftData.amount = parseInt(val)
          draftData.balance = parseInt(draftData.previous_balance) - parseInt(val)
          return
        }
        draftData[name] = val
      })
    )

    setError((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr?.message

        if ((val === '' || val === null) && name !== 'description') {
          const key = name === 'expense_category_id' ? 'category' : name
          draftErr[name] = `${t(`common.${key}`)} ${t(`common_validation.is_required`)}`
        } else {
          delete draftErr[name]
        }
      })
    )
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (
      expenseData.expense_category_id === '' ||
      expenseData.amount === '' ||
      expenseData.amount === 0 ||
      expenseData.previous_balance === '' ||
      expenseData.balance === '' ||
      expenseData.date === ''
    ) {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    setLoading({ ...loading, expenseForm: true })
    xFetch(`accounts/expenses/${expenseData.id}`, expenseData, null, accessToken, null, 'PUT')
      .then((response) => {
        setLoading({ ...loading, expenseForm: false })
        if (response?.success) {
          toast.success(response.message)
          mutate()
          setIsOpen(false)
          setExpenseData({
            account_id: '',
            expense_category_id: '',
            amount: '',
            previous_balance: '',
            balance: '',
            description: '',
            date: new Date(),
            account: null,
            category: null
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
        setLoading({ ...loading, expenseForm: false })
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
      <ExpenseFormModal
        open={isOpen}
        setOpen={setIsOpen}
        error={error}
        modalTitle={t('expense.Expense_Edit')}
        btnTitle={t('common.update')}
        defaultValues={expenseData}
        setChange={setChange}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
