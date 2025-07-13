import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../../atoms/authAtoms'
import { useLoadingState } from '../../../atoms/loaderAtoms'
import { defaultNameCheck } from '../../../helper/defaultNameCheck'
import { isEmpty } from '../../../helper/isEmpty'
import useFetch from '../../../hooks/useFetch'
import tsNumbers from '../../../libs/tsNumbers'
import xFetch from '../../../utilities/xFetch'
import WithdrawalModal from './WithdrawalModal'

export default function EditWithdrawalModal({
  open,
  setOpen,
  withdrawal,
  prefix,
  mutate,
  category_id
}) {
  const { t } = useTranslation()
  const endpoint = `withdrawal/${prefix}`
  const { accessToken } = useAuthDataValue()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useLoadingState({})
  const [withdrawData, setWithdrawData] = useState({ ...withdrawal })
  const requestData =
    prefix === 'saving'
      ? ['min_saving_withdrawal', 'max_saving_withdrawal']
      : ['min_loan_saving_withdrawal', 'max_loan_saving_withdrawal']

  const { data: { data = {} } = [] } = useFetch({
    method: 'POST',
    action: `categories-config/element/${category_id}`,
    requestData: requestData
  })

  const min = Number(data?.min_saving_withdrawal || data?.min_loan_saving_withdrawal)
  const max = Number(data?.max_saving_withdrawal || data?.max_loan_saving_withdrawal)

  const setChange = (val, name) => {
    if (name === 'amount') {
      val = tsNumbers(val, true)
      val = Number(val)
    }

    setWithdrawData((prevData) =>
      create(prevData, (draftData) => {
        if (name === 'amount') {
          draftData[name] = val
          draftData.balance_remaining = Number(draftData.balance) - val
          return
        }

        draftData[name] = val
      })
    )

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message

        if (name === 'amount') {
          if (!Number(val)) {
            draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_invalid`)}`
            return
          }
          if (val < min || (max > 0 && val > max)) {
            draftErr[name] = `${t(`common.${name}`)} ${t(
              `common_validation.crossed_the_limitations`
            )}`
            return
          }
          if (val > Number(withdrawData?.balance)) {
            draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.insufficient_balance`)}`
            return
          }
        }

        val === ''
          ? (draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_required`)}`)
          : delete draftErr[name]
      })
    )
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (
      isEmpty(withdrawData.id) ||
      isEmpty(withdrawData.amount) ||
      isEmpty(withdrawData.description)
    ) {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    setLoading({ ...loading, withdrawForm: true })
    xFetch(`${endpoint}/${withdrawData.id}`, withdrawData, null, accessToken, null, 'PUT')
      .then((response) => {
        setLoading({ ...loading, withdrawForm: false })
        if (response?.success) {
          toast.success(response.message)
          mutate()
          setWithdrawData({})
          setOpen(false)
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
        setLoading({ ...loading, withdrawForm: false })
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
    <WithdrawalModal
      open={open}
      setOpen={setOpen}
      withdrawData={withdrawData}
      min={min || 0}
      max={max || 0}
      setChange={setChange}
      onSubmit={onSubmit}
      errors={errors}
      loading={loading}
      modalTitle={`${defaultNameCheck(
        t,
        withdrawData?.category?.is_default,
        'category.default.',
        withdrawData?.category?.name
      )} ${t('common.withdrawal')} ${t('common.edit')} `}
      btnTitle={t('common.update')}
    />
  )
}
