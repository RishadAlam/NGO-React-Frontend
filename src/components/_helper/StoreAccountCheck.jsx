import { create, rawReturn } from 'mutative'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import { isEmpty } from '../../helper/isEmpty'
import useFetch from '../../hooks/useFetch'
import Save from '../../icons/Save'
import XCircle from '../../icons/XCircle'
import tsNumbers from '../../libs/tsNumbers'
import xFetch from '../../utilities/xFetch'
import Button from '../utilities/Button'
import DatePickerInputField from '../utilities/DatePickerInputField'
import ModalPro from '../utilities/ModalPro'
import TextAreaInputField from '../utilities/TextAreaInputField'
import TextInputField from '../utilities/TextInputField'

export default function StoreAccountCheck({ open, setOpen, prefix }) {
  const { id } = useParams()
  const { t } = useTranslation()
  const endpoint = `${prefix}/check`
  const { accessToken } = useAuthDataValue()
  const [errors, setErrors] = useState({ next_check_in_at: '', description: '' })
  const [loading, setLoading] = useLoadingState({})
  const [withdrawData, setWithdrawData] = useState({
    account_id: id,
    name: '',
    installment: 0,
    balance: 0,
    next_check_in_at: new Date(),
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
          draftData.installment = data?.total_installment || 0
          draftData.next_check_in_at = new Date(data?.next_check_in_at)
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
        draftData[name] = val
      })
    )

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message

        val === ''
          ? (draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_required`)}`)
          : delete draftErr[name]
      })
    )
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (isEmpty(withdrawData.next_check_in_at) || isEmpty(withdrawData.description)) {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }
    setLoading({ ...loading, accountCheckForm: true })
    xFetch(endpoint, withdrawData, null, accessToken, null, 'POST')
      .then((response) => {
        setLoading({ ...loading, accountCheckForm: false })
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
        setLoading({ ...loading, accountCheckForm: false })
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

  // return (
  //   <WithdrawalModal
  //     open={open}
  //     setOpen={setOpen}
  //     withdrawData={withdrawData}
  //     min={data?.min || 0}
  //     max={data?.max || 0}
  //     setChange={setChange}
  //     onSubmit={onSubmit}
  //     errors={errors}
  //     loading={loading}
  //     modalTitle={t('common.withdrawal')}
  //     btnTitle={t('common.withdrawal')}
  //   />
  // )
  return (
    <ModalPro open={open} handleClose={() => setOpen(false)}>
      <div className="card">
        <form onSubmit={onSubmit}>
          <div className="card-header">
            <div className="d-flex align-items-center justify-content-between">
              <b className="text-uppercase">{t('common.account_check')}</b>
              <Button
                className={'text-danger p-0'}
                loading={false}
                endIcon={<XCircle size={24} />}
                onclick={() => setOpen(false)}
              />
            </div>
          </div>
          <div className="card-body">
            {errors?.message && errors?.message !== '' && (
              <div className="alert alert-danger" role="alert">
                <strong>{errors?.message}</strong>
              </div>
            )}
            <div className="row">
              <div className="col-md-6 mb-3">
                <TextInputField
                  label={t('common.name')}
                  isRequired={true}
                  defaultValue={withdrawData?.name || ''}
                  setChange={(val) => setChange(val, 'name')}
                  error={errors?.name}
                  autoFocus={true}
                  disabled={true}
                />
              </div>
              <div className="col-md-6 mb-3">
                <TextInputField
                  label={t('common.installment')}
                  isRequired={true}
                  defaultValue={tsNumbers(withdrawData?.installment || '')}
                  setChange={(val) => setChange(val, 'installment')}
                  error={errors?.installment}
                  autoFocus={true}
                  disabled={true}
                />
              </div>
              <div className="col-md-6 mb-3">
                <TextInputField
                  label={t('common.balance')}
                  isRequired={true}
                  defaultValue={tsNumbers(`$${withdrawData?.balance || 0}/-`) || ''}
                  setChange={(val) => setChange(val, 'balance')}
                  error={errors?.balance}
                  disabled={true}
                />
              </div>
              <div className="col-md-6 mb-3">
                <DatePickerInputField
                  label={t('common.next_check_in_at')}
                  isRequired={true}
                  defaultValue={withdrawData?.next_check_in_at}
                  setChange={(val) => setChange(val, 'next_check_in_at')}
                  error={errors?.next_check_in_at}
                  disabled={loading?.accountCheckForm}
                />
              </div>
              <div className="col-md-12 mb-3 text-start">
                <TextAreaInputField
                  label={t('common.description')}
                  defaultValue={withdrawData?.description}
                  setChange={(val) => setChange(val, 'description')}
                  error={errors?.description}
                  isRequired={true}
                  disabled={loading?.accountCheckForm}
                />
              </div>
            </div>
          </div>
          <div className="card-footer text-end">
            <Button
              type="submit"
              name={t('common.save')}
              className={'btn-primary py-2 px-3'}
              loading={loading?.accountCheckForm || false}
              endIcon={<Save size={20} />}
              disabled={Object.keys(errors).length || loading?.accountCheckForm}
            />
          </div>
        </form>
      </div>
    </ModalPro>
  )
}
