import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import xFetch from '../../utilities/xFetch'
import IncomeFormModal from './IncomeFormModal'

export default function IncomeRegistration({ isOpen, setIsOpen, mutate }) {
  const { t } = useTranslation()
  const { accessToken } = useAuthDataValue()
  const [loading, setLoading] = useLoadingState({})
  const [incomeData, setIncomeData] = useState({
    account_id: '',
    income_category_id: '',
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
    income_category_id: '',
    amount: ''
  })

  const setChange = (val, name) => {
    setIncomeData((prevData) =>
      create(prevData, (draftData) => {
        if (name === 'account_id') {
          draftData.account_id = val?.id || ''
          draftData.previous_balance = val?.balance
          draftData.balance = parseInt(val?.balance) + parseInt(draftData.amount)
          draftData.account = val
          return
        }
        if (name === 'income_category_id') {
          draftData.income_category_id = val?.id || ''
          draftData.category = val
          return
        }
        if (name === 'amount') {
          draftData.amount = parseInt(val)
          draftData.balance = parseInt(draftData.previous_balance) + parseInt(val)
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
            name === 'account_id' ? 'account' : name === 'income_category_id' ? 'category' : name
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
      incomeData.account_id === '' ||
      incomeData.income_category_id === '' ||
      incomeData.amount === '' ||
      incomeData.amount === 0 ||
      incomeData.previous_balance === '' ||
      incomeData.balance === '' ||
      incomeData.date === ''
    ) {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    setLoading({ ...loading, incomeForm: true })
    xFetch('incomes', incomeData, null, accessToken, null, 'POST')
      .then((response) => {
        setLoading({ ...loading, incomeForm: false })
        if (response?.success) {
          toast.success(response.message)
          mutate()
          setIsOpen(false)
          setIncomeData({
            account_id: '',
            income_category_id: '',
            amount: '',
            previous_balance: '',
            balance: '',
            description: '',
            date: ''
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
        setLoading({ ...loading, incomeForm: false })
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
      <IncomeFormModal
        open={isOpen}
        setOpen={setIsOpen}
        error={errors}
        modalTitle={t('income_categories.Income_Categories_Registration')}
        btnTitle={t('common.registration')}
        defaultValues={incomeData}
        setChange={setChange}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
