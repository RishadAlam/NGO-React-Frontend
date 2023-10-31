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
    tx_account: null,
    rx_account: null
  })
  const [errors, setErrors] = useState({
    tx_acc_id: '',
    rx_acc_id: '',
    amount: ''
  })

  const setChange = (val, name) => {
    setTransferData((prevData) =>
      create(prevData, (draftData) => {
        if (name === 'tx_acc_id') {
          draftData.tx_acc_id = val?.id || ''
          draftData.tx_prev_balance = val?.balance
          draftData.tx_balance = parseInt(val?.balance) - parseInt(draftData.amount)
          draftData.tx_account = val
          return
        }
        if (name === 'rx_acc_id') {
          draftData.rx_acc_id = val?.id || ''
          draftData.rx_prev_balance = val?.balance
          draftData.rx_balance = parseInt(val?.balance) + parseInt(draftData.amount)
          draftData.rx_account = val
          return
        }
        if (name === 'amount') {
          draftData.amount = parseInt(val)
          draftData.tx_balance = parseInt(draftData.tx_prev_balance) - parseInt(val)
          draftData.rx_balance = parseInt(draftData.rx_prev_balance) + parseInt(val)
          return
        }
        draftData[name] = val
      })
    )

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr?.message

        if ((val === '' || val === null) && name !== 'description') {
          const key = name === 'tx_acc_id' || name === 'rx_acc_id' ? 'account' : name
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
      transferData.tx_acc_id === '' ||
      transferData.rx_acc_id === '' ||
      transferData.amount === '' ||
      transferData.amount === 0 ||
      transferData.tx_prev_balance === '' ||
      transferData.tx_balance < 0 ||
      transferData.rx_prev_balance === '' ||
      transferData.rx_balance <= 0 ||
      transferData.date === ''
    ) {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }

    setLoading({ ...loading, transferForm: true })
    xFetch('accounts/transfers', transferData, null, accessToken, null, 'POST')
      .then((response) => {
        setLoading({ ...loading, transferForm: false })
        if (response?.success) {
          toast.success(response.message)
          mutate()
          setIsOpen(false)
          setTransferData({
            tx_acc_id: '',
            rx_acc_id: '',
            amount: 0,
            tx_prev_balance: 0,
            tx_balance: 0,
            rx_prev_balance: 0,
            rx_balance: 0,
            description: '',
            date: new Date(),
            tx_account: null,
            rx_account: null
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
        modalTitle={t('account_transfer.Transfer_Registration')}
        btnTitle={t('common.registration')}
        defaultValues={transferData}
        setChange={setChange}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
