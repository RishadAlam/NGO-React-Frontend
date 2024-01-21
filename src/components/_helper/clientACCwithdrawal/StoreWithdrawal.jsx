import { create, rawReturn } from 'mutative'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useAuthDataValue } from '../../../atoms/authAtoms'
import { useLoadingState } from '../../../atoms/loaderAtoms'
import { isEmpty } from '../../../helper/isEmpty'
import useFetch from '../../../hooks/useFetch'
import tsNumbers from '../../../libs/tsNumbers'
import xFetch from '../../../utilities/xFetch'
import WithdrawalModal from './WithdrawalModal'

export default function StoreWithdrawal({ open, setOpen, prefix }) {
  const { id } = useParams()
  const { t } = useTranslation()
  const endpoint = `withdrawal/${prefix}`
  const { accessToken } = useAuthDataValue()
  const [errors, setErrors] = useState({ amount: '', description: '' })
  const [loading, setLoading] = useLoadingState({})
  const [withdrawData, setWithdrawData] = useState({
    account_id: id,
    name: '',
    amount: 0,
    balance: 0,
    balance_remaining: 0,
    description: ''
  })

  const {
    data: { data } = [],
    isLoading,
    isError
  } = useFetch({
    action: `${endpoint}/${id}`
  })

  useEffect(() => {
    data &&
      setWithdrawData((prevData) =>
        create(prevData, (draftData) => {
          draftData.name = data?.name || ''
          draftData.balance = data?.balance || 0
          draftData.balance_remaining = data?.balance || 0
        })
      )
    !isEmpty(isError) && setErrors(isError)
  }, [data, isError])

  const setChange = (val, name) => {
    if (name === 'amount') {
      val = tsNumbers(val, true)
    }

    setWithdrawData((prevData) =>
      create(prevData, (draftData) => {
        if (name === 'amount') {
          draftData[name] = val
          draftData.balance_remaining = draftData.balance - val
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
          if (data?.max > 0 && (val < data?.min || val > data?.max)) {
            draftErr[name] = `${t(`common.${name}`)} ${t(
              `common_validation.crossed_the_limitations`
            )}`
            return
          }
          if (val > data?.balance) {
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
    if (withdrawData.amount === '' || withdrawData.description === '') {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }
    setLoading({ ...loading, withdrawForm: true })
    xFetch(endpoint, withdrawData, null, accessToken, null, 'POST')
      .then((response) => {
        setLoading({ ...loading, withdrawForm: false })
        if (response?.success) {
          toast.success(response.message)
          setOpen(false)
          setWithdrawData({})
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
      min={data?.min || 0}
      max={data?.max || 0}
      setChange={setChange}
      onSubmit={onSubmit}
      errors={errors}
      loading={loading}
      modalTitle={t('common.withdrawal')}
      btnTitle={t('common.withdrawal')}
    />
  )
}
