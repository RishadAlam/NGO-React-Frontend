import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import xFetch from '../../utilities/xFetch'
import AccountFormModal from './AccountFormModal'

export default function AccountRegistration({ isOpen, setIsOpen, mutate }) {
  const { t } = useTranslation()
  const { accessToken } = useAuthDataValue()
  const [accountData, setAccountData] = useState({
    name: '',
    acc_no: '',
    initial_balance: 0,
    acc_details: ''
  })
  const [errors, setErrors] = useState({ name: '' })
  const [loading, setLoading] = useLoadingState({})
  const setChange = (val, name) => {
    setAccountData((prevData) =>
      create(prevData, (draftData) => {
        draftData[name] = val
      })
    )

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message
        val === '' && name === 'name'
          ? (draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_required`)}`)
          : delete draftErr[name]
      })
    )
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (accountData.name === '') {
      toast.error(t('common_validation.required_accounts_are_empty'))
      return
    }

    setLoading({ ...loading, accountForm: true })
    xFetch('accounts', accountData, null, accessToken, null, 'POST')
      .then((response) => {
        setLoading({ ...loading, accountForm: false })
        if (response?.success) {
          toast.success(response.message)
          mutate()
          setIsOpen(false)
          setAccountData({
            name: '',
            acc_no: '',
            initial_balance: 0,
            acc_details: ''
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
        setLoading({ ...loading, accountForm: false })
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
      <AccountFormModal
        open={isOpen}
        setOpen={setIsOpen}
        error={errors}
        modalTitle={t('account.Account_Registration')}
        btnTitle={t('common.registration')}
        defaultValues={accountData}
        setChange={setChange}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}
