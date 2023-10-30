import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import xFetch from '../../utilities/xFetch'
import WithdrawalFormModal from './WithdrawalFormModal'

export default function WithdrawalUpdate({ isOpen, setIsOpen, data, mutate }) {
  const { t } = useTranslation()
  const { accessToken } = useAuthDataValue()
  const [withdrawalData, setWithdrawalData] = useState({ ...data })
  const [error, setError] = useState({})
  const [loading, setLoading] = useLoadingState({})

  const setChange = (val, name) => {
    setWithdrawalData((prevData) =>
      create(prevData, (draftData) => {
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

        if (val === '' || val === null) {
          draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_required`)}`
        } else {
          delete draftErr[name]
        }
      })
    )
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (
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
    xFetch(
      `accounts/withdrawals/${withdrawalData.id}`,
      withdrawalData,
      null,
      accessToken,
      null,
      'PUT'
    )
      .then((response) => {
        setLoading({ ...loading, withdrawalForm: false })
        if (response?.success) {
          toast.success(response.message)
          mutate()
          setIsOpen(false)
          setWithdrawalData({
            amount: '',
            previous_balance: '',
            balance: '',
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
        setLoading({ ...loading, withdrawalForm: false })
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
      <WithdrawalFormModal
        open={isOpen}
        setOpen={setIsOpen}
        error={error}
        modalTitle={t('account_withdrawal.Withdrawal_Edit')}
        btnTitle={t('common.update')}
        defaultValues={withdrawalData}
        setChange={setChange}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
