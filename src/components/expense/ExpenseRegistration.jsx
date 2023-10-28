import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import xFetch from '../../utilities/xFetch'
import ExpenseFormModal from './ExpenseFormModal'

export default function ExpenseRegistration({ isOpen, setIsOpen, mutate }) {
  const { t } = useTranslation()
  const { accessToken } = useAuthDataValue()
  const [loading, setLoading] = useLoadingState({})
  const [expenseData, setExpenseData] = useState({
    account_id: '',
    expense_category_id: '',
    amount: 0,
    previous_balance: 0,
    balance: 0,
    description: '',
    date: new Date(),
    account: null,
    category: null
  })
  const [errors, setErrors] = useState({
    account_id: '',
    expense_category_id: '',
    amount: ''
  })

  const setChange = (val, name) => {
    setExpenseData((prevData) =>
      create(prevData, (draftData) => {
        if (name === 'account_id') {
          draftData.account_id = val?.id || ''
          draftData.previous_balance = val?.balance
          draftData.balance = parseInt(val?.balance) + parseInt(draftData.amount)
          draftData.account = val
          return
        }
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

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr?.message

        if ((val === '' || val === null) && name !== 'description') {
          const key =
            name === 'account_id' ? 'account' : name === 'expense_category_id' ? 'category' : name
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
      expenseData.account_id === '' ||
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
    xFetch('expenses', expenseData, null, accessToken, null, 'POST')
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
        setLoading({ ...loading, expenseForm: false })
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
      <ExpenseFormModal
        open={isOpen}
        setOpen={setIsOpen}
        error={errors}
        modalTitle={t('expense_categories.Expense_Categories_Registration')}
        btnTitle={t('common.registration')}
        defaultValues={expenseData}
        setChange={setChange}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
