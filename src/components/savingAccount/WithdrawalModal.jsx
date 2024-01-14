import { create } from 'mutative'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useLoadingState } from '../../atoms/loaderAtoms'
import { isEmpty } from '../../helper/isEmpty'
import useFetch from '../../hooks/useFetch'
import Save from '../../icons/Save'
import XCircle from '../../icons/XCircle'
import tsNumbers from '../../libs/tsNumbers'
import Button from '../utilities/Button'
import ModalPro from '../utilities/ModalPro'
import TextAreaInputField from '../utilities/TextAreaInputField'
import TextInputField from '../utilities/TextInputField'

export default function WithdrawalModal({ open, setOpen, error, modalTitle, btnTitle }) {
  const { id } = useParams()
  const { t } = useTranslation()
  const [errors, setErrors] = useState({ amount: '', description: '' })
  const [loading, setLoading] = useLoadingState({})
  const [withdrawData, setWithdrawData] = useState({
    saving_account_id: id,
    name: '',
    amount: 0,
    balance: 0,
    remaining_balance: 0,
    description: ''
  })

  const {
    data: { data } = [],
    isLoading,
    isError
  } = useFetch({
    action: `collection/withdrawal/saving/${id}`
  })

  useEffect(() => {
    data &&
      setWithdrawData((prevData) =>
        create(prevData, (draftData) => {
          draftData.name = data?.name || ''
          draftData.balance = data?.balance || 0
          draftData.remaining_balance = data?.balance || 0
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
          draftData.remaining_balance = draftData.balance - val
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
    // event.preventDefault()
    // if (fieldData.name === '') {
    //   toast.error(t('common_validation.required_fields_are_empty'))
    //   return
    // }
    // setLoading({ ...loading, fieldForm: true })
    // xFetch('fields', fieldData, null, accessToken, null, 'POST')
    //   .then((response) => {
    //     setLoading({ ...loading, fieldForm: false })
    //     if (response?.success) {
    //       toast.success(response.message)
    //       mutate()
    //       setIsOpen(false)
    //       setFieldData({
    //         name: '',
    //         description: ''
    //       })
    //       return
    //     }
    //     setErrors((prevErr) =>
    //       create(prevErr, (draftErr) => {
    //         if (!response?.errors) {
    //           draftErr.message = response?.message
    //           return
    //         }
    //         return rawReturn(response?.errors || response)
    //       })
    //     )
    //   })
    //   .catch((errResponse) => {
    //     setLoading({ ...loading, fieldForm: false })
    //     setErrors((prevErr) =>
    //       create(prevErr, (draftErr) => {
    //         if (!errResponse?.errors) {
    //           draftErr.message = errResponse?.message
    //           return
    //         }
    //         return rawReturn(errResponse?.errors || errResponse)
    //       })
    //     )
    //   })
  }

  return (
    <>
      <ModalPro open={open} handleClose={() => setOpen(false)}>
        <div className="card">
          <form onSubmit={onSubmit}>
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <b className="text-uppercase">{modalTitle}</b>
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
                    disabled={loading?.fieldForm}
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
                  <TextInputField
                    label={t('common.amount')}
                    isRequired={true}
                    defaultValue={tsNumbers(withdrawData?.amount || '')}
                    setChange={(val) => setChange(val, 'amount')}
                    error={errors?.amount}
                    autoFocus={true}
                    disabled={loading?.fieldForm}
                  />
                  {data?.max > 0 && (
                    <span className="text-info d-block mt-1">
                      {`${t('common.min')} ${t('common.amount')}: ${tsNumbers(
                        `$${data?.min}/-`
                      )} ${t('common.max')} ${t('common.amount')}: ${tsNumbers(
                        `$${data?.max}/-`
                      )} `}
                    </span>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <TextInputField
                    label={t('common.remaining_balance')}
                    isRequired={true}
                    defaultValue={tsNumbers(`$${withdrawData?.remaining_balance || 0}/-`) || ''}
                    setChange={(val) => setChange(val, 'remaining_balance')}
                    error={errors?.remaining_balance}
                    disabled={true}
                  />
                </div>
                <div className="col-md-12 mb-3 text-start">
                  <TextAreaInputField
                    label={t('common.description')}
                    defaultValue={withdrawData?.description}
                    setChange={(val) => setChange(val, 'description')}
                    error={errors?.description}
                    disabled={loading?.fieldForm}
                  />
                </div>
              </div>
            </div>
            <div className="card-footer text-end">
              <Button
                type="submit"
                name={btnTitle}
                className={'btn-primary py-2 px-3'}
                loading={loading?.fieldForm || false}
                endIcon={<Save size={20} />}
                disabled={Object.keys(errors).length || loading?.fieldForm}
              />
            </div>
          </form>
        </div>
      </ModalPro>
    </>
  )
}
