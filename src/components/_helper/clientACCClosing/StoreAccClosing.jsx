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
import WithdrawalModal from './ClosingModal'

export default function StoreAccClosing({ open, setOpen, prefix }) {
  const { id } = useParams()
  const { t } = useTranslation()
  const endpoint = `closing/${prefix}`
  const { accessToken } = useAuthDataValue()
  const [errors, setErrors] = useState({ description: '' })
  const [loading, setLoading] = useLoadingState({})
  const [closingData, setClosingData] = useState({
    account_id: id,
    name: '',
    balance: 0,
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
      setClosingData((prevData) =>
        create(prevData, (draftData) => {
          draftData.name = data?.name || ''
          draftData.balance = data?.balance || 0
          draftData['closing_fee'] = data?.closing_fee || 0
          draftData['closing_fee_acc_id'] = data?.closing_fee_acc_id
          draftData['total_installment'] = data?.total_installment || 0
          draftData['total_rec_installment'] = data?.total_rec_installment || 0

          if (prefix === 'saving') {
            draftData['interest'] = data?.interest
            draftData['total_balance'] = data?.total_balance
          } else {
            draftData['loan_given'] = data?.loan_given || 0
            draftData['total_loan_rec'] = data?.total_loan_rec || 0
            draftData['total_loan_remaining'] = data?.total_loan_remaining || 0
            draftData['total_interest'] = data?.total_interest || 0
            draftData['total_interest_rec'] = data?.total_interest_rec || 0
            draftData['total_interest_remaining'] = data?.total_interest_remaining || 0
          }
        })
      )
    !isEmpty(isError) && setErrors(isError)
  }, [data, isError])

  const setChange = (val, name) => {
    if (name === 'amount') {
      val = tsNumbers(val, true)
    }

    setClosingData((prevData) =>
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
    if (closingData.amount === '' || closingData.description === '') {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }
    setLoading({ ...loading, withdrawForm: true })
    xFetch(endpoint, closingData, null, accessToken, null, 'POST')
      .then((response) => {
        setLoading({ ...loading, withdrawForm: false })
        if (response?.success) {
          toast.success(response.message)
          setOpen(false)
          setClosingData({})
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
      closingData={closingData}
      prefix={prefix}
      setChange={setChange}
      onSubmit={onSubmit}
      errors={errors}
      loading={loading}
      modalTitle={`${t(`common.${prefix}`)} ${t('common.closing')}`}
      btnTitle={t('common.submit')}
    />
  )
}
