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
import ClosingModal from './ClosingModal'

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
            draftData['total_balance'] =
              parseInt(parseInt(data?.balance) + parseInt(data?.interest)) -
              parseInt(data?.closing_fee)
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

    !isEmpty(isError)
      ? setErrors(isError)
      : data &&
        setErrors((prevError) =>
          create(prevError, (draftError) => {
            if (data?.closing_fee > data.balance) {
              draftError['balance'] = t('common_validation.insufficient_balance')
              draftError['closing_fee'] = t('common_validation.insufficient_balance')
            }
            if (data?.total_loan_remaining > 0) {
              draftError['total_loan_remaining'] = t('common_validation.outstanding_loan_detected')
            }
            if (data?.total_interest_remaining > 0) {
              draftError['total_interest_remaining'] = t(
                'common_validation.outstanding_interest_detected'
              )
            }
          })
        )
  }, [data, isError])

  const setChange = (val, name) => {
    if (name === 'interest') {
      val = tsNumbers(val, true)
    }

    setClosingData((prevData) =>
      create(prevData, (draftData) => {
        if (name === 'interest') {
          draftData[name] = val
          draftData.total_balance = parseInt(
            parseInt(parseInt(draftData?.balance) + parseInt(val || 0)) -
              parseInt(draftData?.closing_fee)
          )
          return
        }

        draftData[name] = val
      })
    )

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message

        if (name === 'interest' && !Number(val) && val != 0) {
          draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_invalid`)}`
          return
        }

        if (
          parseInt(
            parseInt(parseInt(closingData?.balance) + parseInt(val || 0)) -
              parseInt(closingData?.closing_fee)
          ) < 0
        ) {
          draftErr['balance'] = t('common_validation.insufficient_balance')
        } else if (
          parseInt(
            parseInt(parseInt(closingData?.balance) + parseInt(val || 0)) -
              parseInt(closingData?.closing_fee)
          ) >= 0
        ) {
          delete draftErr.balance
          delete draftErr.closing_fee
        }

        isEmpty(val)
          ? (draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_required`)}`)
          : delete draftErr[name]
      })
    )
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (isEmpty(closingData.description)) {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }
    console.log(closingData.total_balance)
    if (closingData.total_balance < 0) {
      toast.error(t('common_validation.insufficient_balance'))
      return
    }
    if (closingData?.total_loan_remaining > 0) {
      toast.error(t('common_validation.outstanding_loan_detected'))
      return
    }
    if (closingData?.total_interest_remaining > 0) {
      toast.error(t('common_validation.outstanding_interest_detected'))
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
    <ClosingModal
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
