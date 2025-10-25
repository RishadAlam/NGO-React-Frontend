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
import TransactionModal from './TransactionModal'

export default function StoreTransaction({ open, setOpen, prefix, mutate }) {
  const { id } = useParams()
  const { t } = useTranslation()
  const { accessToken } = useAuthDataValue()
  const [errors, setErrors] = useState({ amount: '', description: '' })
  const [loading, setLoading] = useLoadingState({})
  const [transactionConfigs, setTransactionConfigs] = useState({})
  const [transactionType, setTransactionType] = useState('')
  const [transactionData, setTransactionData] = useState({
    tx_acc_id: id,
    type: transactionType,
    amount: 0,
    balance: 0,
    balance_remaining: 0,
    rx_acc_id: '',
    description: ''
  })

  const endpoint = `client/registration/transaction/${prefix}`
  const { data: { data } = [], isError } = useFetch({
    action: `${endpoint}/${id}`
  })

  useEffect(() => {
    if (data?.account) {
      setTransactionData((prevData) =>
        create(prevData, (draftData) => {
          draftData.balance = data?.account?.balance || 0
          draftData.balance_remaining =
            Number(draftData.balance || 0) - Number(draftData?.amount || 0)
        })
      )
    }

    if (data?.config) {
      setTransactionConfigs(data?.config)
    }

    !isEmpty(isError) && setErrors(isError)
  }, [data, isError])

  const setChange = (val, name) => {
    if (name === 'amount') {
      val = tsNumbers(val, true)
      val = Number(val)
    }

    setTransactionData((prevData) =>
      create(prevData, (draftData) => {
        if (name === 'field_id') {
          draftData.field_id = val?.id || ''
          draftData.field = val || null
          draftData.center_id = ''
          draftData.center = ''
          return
        }
        if (name === 'center_id') {
          draftData.center_id = val?.id || ''
          draftData.center = val || null
          return
        }
        if (name === 'category_id') {
          draftData.category_id = val?.id || ''
          draftData.category = val || null
          return
        }
        if (name === 'rx_account') {
          draftData.rx_account_id = val?.id || ''
          draftData.rx_account = val || null
          return
        }
        if (name === 'amount') {
          draftData[name] = val
          draftData.balance_remaining = Number(draftData.balance) - val
          return
        }

        draftData[name] = val
      })
    )

    if (name === 'type') {
      setTransactionType(val)
    }

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message

        if (name === 'amount') {
          if (!Number(val)) {
            draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_invalid`)}`
            return
          }

          const config = transactionConfigs[transactionType] || {}
          if (isEmpty(config)) {
            draftErr[name] = t('common_validation.transaction_type_not_selected')
            return
          }

          if (Number(config?.max) > 0 && (val < Number(config?.min) || val > Number(config?.max))) {
            draftErr[name] = `${t(`common.${name}`)} ${t(
              `common_validation.crossed_the_limitations`
            )}`
            return
          }

          if (val > Number(transactionData?.balance)) {
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
    if (transactionData.amount === '' || transactionData.description === '') {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }
    setLoading({ ...loading, transactionForm: true })
    xFetch(endpoint, transactionData, null, accessToken, null, 'POST')
      .then((response) => {
        setLoading({ ...loading, transactionForm: false })
        if (response?.success) {
          toast.success(response.message)
          setOpen(false)
          setTransactionData({})
          mutate()
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
        setLoading({ ...loading, transactionForm: false })
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
    <TransactionModal
      open={open}
      setOpen={setOpen}
      transactionData={transactionData}
      prefix={prefix}
      min={data?.min || 0}
      max={data?.max || 0}
      setChange={setChange}
      onSubmit={onSubmit}
      errors={errors}
      loading={loading}
    />
  )
}
