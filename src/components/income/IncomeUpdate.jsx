import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import xFetch from '../../utilities/xFetch'
import IncomeFormModal from './IncomeFormModal'

export default function IncomeUpdate({ isOpen, setIsOpen, data, mutate }) {
  const { t } = useTranslation()
  const { accessToken } = useAuthDataValue()
  const [incomeData, setIncomeData] = useState({ ...data })
  const [error, setError] = useState({})
  const [loading, setLoading] = useLoadingState({})

  const setChange = (val, name) => {
    setIncomeData((prevData) =>
      create(prevData, (draftData) => {
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

    setError((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr?.message

        if ((val === '' || val === null) && name !== 'description') {
          const key = name === 'income_category_id' ? 'category' : name
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
    xFetch(`accounts/incomes/${incomeData.id}`, incomeData, null, accessToken, null, 'PUT')
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
        setLoading({ ...loading, incomeForm: false })
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
      <IncomeFormModal
        open={isOpen}
        setOpen={setIsOpen}
        error={error}
        modalTitle={t('income.Income_Edit')}
        btnTitle={t('common.update')}
        defaultValues={incomeData}
        setChange={setChange}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
