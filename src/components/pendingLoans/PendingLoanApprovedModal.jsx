import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import useFetch from '../../hooks/useFetch'
import Info from '../../icons/Info'
import Save from '../../icons/Save'
import XCircle from '../../icons/XCircle'
import tsNumbers from '../../libs/tsNumbers'
import xFetch from '../../utilities/xFetch'
import Button from '../utilities/Button'
import DatePickerInputField from '../utilities/DatePickerInputField'
import ModalPro from '../utilities/ModalPro'
import SelectBoxField from '../utilities/SelectBoxField'
import TextInputField from '../utilities/TextInputField'

export default function PendingLoanApprovedModal({ open, setOpen, mutate, data = {} }) {
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
      option.is_default ? t(`account.default.${option.name}`) : option.name,
    onChange: (e, option) => {
      setAccount(option)
      setError({})
    },
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

  const onSubmit = (event) => {
    event.preventDefault()

    setLoading({ ...loading, loanApproval: true })
    xFetch(
      `client/registration/loan/loan-approved/${data?.id}`,
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
                <b className="text-uppercase">{`${t('common.loan')} ${t('common.approval')}`}</b>
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
                    label={t('common.field')}
                    defaultValue={data?.field || ''}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 col-xl-4 mb-3">
                  <TextInputField
                    label={t('common.center')}
                    defaultValue={data?.center || ''}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 col-xl-4 mb-3">
                  <TextInputField
                    label={t('common.category')}
                    defaultValue={data?.category || ''}
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
                    label={t('common.name')}
                    defaultValue={data?.name || ''}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 col-xl-4 mb-3">
                  <DatePickerInputField
                    label={t('common.start_date')}
                    defaultValue={data?.start_date || ''}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 col-xl-4 mb-3">
                  <DatePickerInputField
                    label={t('common.duration_date')}
                    defaultValue={data?.duration_date || ''}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 col-xl-4 mb-3">
                  <TextInputField
                    label={t('common.deposit')}
                    defaultValue={tsNumbers(`৳${data?.payable_deposit}/-`) || ''}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 col-xl-4 mb-3">
                  <TextInputField
                    label={t('common.loan_given')}
                    defaultValue={tsNumbers(`৳${data?.loan_given}/-`) || ''}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 col-xl-4 mb-3">
                  <TextInputField
                    label={t('common.total_installment')}
                    defaultValue={tsNumbers(data?.total_installment) || ''}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 col-xl-4 mb-3">
                  <TextInputField
                    label={t('common.interest')}
                    defaultValue={tsNumbers(`${data?.payable_interest}%`) || ''}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 col-xl-4 mb-3">
                  <TextInputField
                    label={`${t('common.total')} ${t('common.interest')}`}
                    defaultValue={tsNumbers(data?.total_payable_interest) || ''}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 col-xl-4 mb-3">
                  <TextInputField
                    label={t('common.total_payable_loan_with_interest')}
                    defaultValue={tsNumbers(data?.total_payable_loan_with_interest) || ''}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 col-xl-4 mb-3">
                  <TextInputField
                    label={t('common.loan_installment')}
                    defaultValue={tsNumbers(data?.loan_installment) || ''}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 col-xl-4 mb-3">
                  <TextInputField
                    label={t('common.interest_installment')}
                    defaultValue={tsNumbers(data?.interest_installment) || ''}
                    disabled={true}
                  />
                </div>
                {!data?.is_loan_approved && permissions.includes('pending_loan_approval') && (
                  <div className="col-md-6 mb-3">
                    <SelectBoxField
                      label={t('common.account')}
                      config={accountSelectBoxConfig}
                      isRequired={true}
                      error={error?.account}
                      disabled={loading?.loanApproval}
                    />
                    <span className="text-info">
                      <Info size={15} /> {t('common.deduct_loan_msg')}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {!data?.is_loan_approved && permissions.includes('pending_loan_approval') && (
              <div className="card-footer text-end">
                <Button
                  type="submit"
                  name={t('common.approval')}
                  className={'btn-primary py-2 px-3'}
                  loading={loading?.loanApproval || false}
                  endIcon={<Save size={20} />}
                  disabled={loading?.loanApproval || false}
                />
              </div>
            )}
          </form>
        </div>
      </ModalPro>
    </>
  )
}
