import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import xFetch from '../../utilities/xFetch'
import TransferFormModal from './TransferFormModal'

export default function TransferRegistration({ isOpen, setIsOpen, mutate }) {
  const { t } = useTranslation()
  const { accessToken } = useAuthDataValue()
  const [loading, setLoading] = useLoadingState({})
  const [transferData, setTransferData] = useState({
    tx_acc_id: '',
    rx_acc_id: '',
    amount: 0,
    tx_prev_balance: 0,
    tx_balance: 0,
    rx_prev_balance: 0,
    rx_balance: 0,
    description: '',
    date: new Date(),
    account: null
  })
  const [errors, setErrors] = useState({
    account_id: '',
    transfer_category_id: '',
    amount: ''
  })

  const setChange = (val, name) => {
    setTransferData((prevData) =>
      create(prevData, (draftData) => {
        if (name === 'account_id') {
          draftData.account_id = val?.id || ''
          draftData.previous_balance = val?.balance
          draftData.balance = parseInt(val?.balance) + parseInt(draftData.amount)
          draftData.account = val
          return
        }
        if (name === 'transfer_category_id') {
          draftData.transfer_category_id = val?.id || ''
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
            name === 'account_id' ? 'account' : name === 'transfer_category_id' ? 'category' : name
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
      transferData.account_id === '' ||
      transferData.transfer_category_id === '' ||
      transferData.amount === '' ||
      transferData.amount === 0 ||
      transferData.previous_balance === '' ||
      transferData.balance === '' ||
      transferData.date === ''
    ) {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    setLoading({ ...loading, transferForm: true })
    xFetch('transfers', transferData, null, accessToken, null, 'POST')
      .then((response) => {
        setLoading({ ...loading, transferForm: false })
        if (response?.success) {
          toast.success(response.message)
          mutate()
          setIsOpen(false)
          setTransferData({
            account_id: '',
            transfer_category_id: '',
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
        setLoading({ ...loading, transferForm: false })
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
      <TransferFormModal
        open={isOpen}
        setOpen={setIsOpen}
        error={errors}
        modalTitle={t('transfer.Transfer_Registration')}
        btnTitle={t('common.registration')}
        defaultValues={transferData}
        setChange={setChange}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
