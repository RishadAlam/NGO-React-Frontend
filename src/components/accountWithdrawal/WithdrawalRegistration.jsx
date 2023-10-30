import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import xFetch from '../../utilities/xFetch'
import WithdrawalFormModal from './WithdrawalFormModal'

export default function WithdrawalRegistration({ isOpen, setIsOpen, mutate }) {
  const { t } = useTranslation()
  const { accessToken } = useAuthDataValue()
  const [loading, setLoading] = useLoadingState({})
  const [withdrawalData, setWithdrawalData] = useState({
    account_id: '',
    amount: 0,
    previous_balance: 0,
    balance: 0,
    description: '',
    date: new Date(),
    account: null
  })
  const [errors, setErrors] = useState({
    account_id: '',
    amount: '',
    description: ''
  })

  const setChange = (val, name) => {
    setWithdrawalData((prevData) =>
      create(prevData, (draftData) => {
        if (name === 'account_id') {
          draftData.account_id = val?.id || ''
          draftData.previous_balance = val?.balance
          draftData.balance = parseInt(val?.balance) + parseInt(draftData.amount)
          draftData.account = val
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

        if (val === '' || val === null) {
          const key = name === 'account_id' ? 'account' : name
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
      withdrawalData.account_id === '' ||
      withdrawalData.amount === '' ||
      withdrawalData.amount === 0 ||
      withdrawalData.previous_balance === '' ||
      withdrawalData.balance === '' ||
      withdrawalData.balance <= 0 ||
      withdrawalData.date === '' ||
      withdrawalData.description === ''
    ) {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    setLoading({ ...loading, withdrawalForm: true })
    xFetch('accounts/withdrawals', withdrawalData, null, accessToken, null, 'POST')
      .then((response) => {
        setLoading({ ...loading, withdrawalForm: false })
        if (response?.success) {
          toast.success(response.message)
          mutate()
          setIsOpen(false)
          setWithdrawalData({
            account_id: '',
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
        setLoading({ ...loading, withdrawalForm: false })
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
      <WithdrawalFormModal
        open={isOpen}
        setOpen={setIsOpen}
        error={errors}
        modalTitle={t('account_withdrawal.Withdrawal_Registration')}
        btnTitle={t('common.registration')}
        defaultValues={withdrawalData}
        setChange={setChange}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
