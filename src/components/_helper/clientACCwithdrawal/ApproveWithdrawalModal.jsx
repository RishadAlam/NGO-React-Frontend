import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../../atoms/authAtoms'
import { useLoadingState } from '../../../atoms/loaderAtoms'
import { defaultNameCheck } from '../../../helper/defaultNameCheck'
import { isEmptyObject } from '../../../helper/isEmptyObject'
import useFetch from '../../../hooks/useFetch'
import Info from '../../../icons/Info'
import Save from '../../../icons/Save'
import XCircle from '../../../icons/XCircle'
import dateFormat from '../../../libs/dateFormat'
import tsNumbers from '../../../libs/tsNumbers'
import xFetch from '../../../utilities/xFetch'
import Button from '../../utilities/Button'
import ModalPro from '../../utilities/ModalPro'
import SelectBoxField from '../../utilities/SelectBoxField'
import TextInputField from '../../utilities/TextInputField'

export default function ApproveWithdrawalModal({ open, setOpen, mutate, data = {} }) {
  const { t } = useTranslation()
  const [error, setError] = useState({})
  const [account, setAccount] = useState()
  const [loading, setLoading] = useLoadingState({})
  const { data: { data: accounts = [] } = [] } = useFetch({ action: 'accounts/active' })
  const { accessToken, permissions } = useAuthDataValue()

  const accountSelectBoxConfig = {
    options: accounts,
    value: account || null,
    getOptionLabel: (option) =>
      defaultNameCheck(t, option.is_default, 'account.default.', option.name),
    onChange: (e, option) => {
      setAccount(option)
      setError({})
    },
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (!checkValidation(data, account, setError, t)) return

    setLoading({ ...loading, loanApproval: true })
    xFetch(
      `withdrawal/saving/approved/${data?.id}`,
      { account: account?.id },
      null,
      accessToken,
      null,
      'PUT'
    )
      .then((response) => {
        setLoading({ ...loading, loanApproval: false })
        if (response?.success) {
          toast.success(response.message)
          mutate()
          setOpen(false)
          setAccount(undefined)
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
        setLoading({ ...loading, loanApproval: false })
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
      <ModalPro open={open} handleClose={() => setOpen(false)}>
        <div className="card">
          <form onSubmit={onSubmit}>
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <b className="text-uppercase">{t('menu.withdrawal.Saving_Withdrawal')}</b>
                <Button
                  className={'text-danger p-0'}
                  loading={false}
                  endIcon={<XCircle size={24} />}
                  onclick={() => setOpen(false)}
                />
              </div>
            </div>
            <div className="card-body">
              {error?.message && error?.message !== '' && (
                <div className="alert alert-danger" role="alert">
                  <strong>{error?.message}</strong>
                </div>
              )}
              <div className="row">
                <div className="col-md-6 col-xl-4 mb-3">
                  <TextInputField
                    label={t('common.category')}
                    defaultValue={
                      defaultNameCheck(
                        t,
                        data?.category?.is_default,
                        'category.default.',
                        data?.category?.name
                      ) || ''
                    }
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 col-xl-4 mb-3">
                  <TextInputField
                    label={t('common.name')}
                    defaultValue={data?.name || ''}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 col-xl-4 mb-3">
                  <TextInputField
                    label={t('common.acc_no')}
                    defaultValue={tsNumbers(data?.acc_no) || ''}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 col-xl-4 mb-3">
                  <TextInputField
                    label={`${t('common.account')} ${t('common.balance')}`}
                    defaultValue={tsNumbers(`৳${data?.balance}/-`) || ''}
                    disabled={true}
                    error={error?.balance}
                  />
                </div>
                <div className="col-md-6 col-xl-4 mb-3">
                  <TextInputField
                    label={t('common.amount')}
                    defaultValue={tsNumbers(`৳${data?.amount}/-`) || ''}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 col-xl-4 mb-3">
                  <TextInputField
                    label={t('common.creator')}
                    defaultValue={data?.creator || ''}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 col-xl-4 mb-3">
                  <TextInputField
                    label={t('common.created_at')}
                    defaultValue={
                      tsNumbers(dateFormat(data?.created_at, 'dd/MM/yyyy hh:mm a')) || ''
                    }
                    disabled={true}
                  />
                </div>
                {data?.fee > 0 && (
                  <div className="col-md-6 col-xl-4 mb-3">
                    <TextInputField
                      label={`${t('common.withdrawal')} ${t('common.fee')}`}
                      defaultValue={tsNumbers(`৳${data?.fee}/-`) || ''}
                      disabled={true}
                      error={error?.fee}
                    />
                  </div>
                )}
                {!data?.is_loan_approved &&
                  permissions.includes('pending_saving_withdrawal_approval') && (
                    <div className="col-md-6 mb-3">
                      <SelectBoxField
                        label={t('common.account')}
                        config={accountSelectBoxConfig}
                        isRequired={true}
                        error={error?.account}
                        disabled={loading?.loanApproval}
                      />
                      <span className="text-info">
                        <Info size={15} /> {t('common.deduct_withdrawal_msg')}
                      </span>
                    </div>
                  )}
              </div>
            </div>
            {!data?.is_loan_approved &&
              permissions.includes('pending_saving_withdrawal_approval') && (
                <div className="card-footer text-end">
                  <Button
                    type="submit"
                    name={t('common.approval')}
                    className={'btn-primary py-2 px-3'}
                    loading={loading?.loanApproval || false}
                    endIcon={<Save size={20} />}
                    disabled={loading?.loanApproval || !isEmptyObject(error) || false}
                  />
                </div>
              )}
          </form>
        </div>
      </ModalPro>
    </>
  )
}

const checkValidation = (data, account, setError, t) => {
  const error = {}

  if (data?.amount > data?.balance) {
    error['balance'] = t('common_validation.insufficient_balance')
  }
  if (data?.fee > 0 && data?.balance < parseInt(data?.amount) + parseInt(data?.fee)) {
    error['fee'] = t('common_validation.insufficient_balance')
  }
  if (account && account?.balance < data?.amount) {
    error['account'] = t('common_validation.insufficient_balance')
  }
  if (isEmptyObject(error)) return true
  setError({ ...error })
  return false
}
