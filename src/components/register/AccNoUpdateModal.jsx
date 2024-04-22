import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { isEmpty } from '../../helper/isEmpty'
import Save from '../../icons/Save'
import XCircle from '../../icons/XCircle'
import tsNumbers from '../../libs/tsNumbers'
import xFetch from '../../utilities/xFetch'
import Button from '../utilities/Button'
import ModalPro from '../utilities/ModalPro'
import TextInputField from '../utilities/TextInputField'

export default function AccNoUpdateModal({ open, setOpen, defaultField = null, mutate }) {
  const [accNo, setAccNo] = useState(defaultField || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({})
  const { accessToken } = useAuthDataValue()
  const { t } = useTranslation()

  const onSubmit = (event) => {
    event.preventDefault()

    if (isEmpty(accNo?.id)) {
      toast.error(t('common_validation.required_categories_are_empty'))
      return
    }

    setIsLoading(true)
    xFetch('categories', accNo, null, accessToken, null, 'POST')
      .then((response) => {
        setIsLoading(false)
        if (response?.success) {
          toast.success(response.message)
          mutate()
          setOpen(false)
          setAccNo()
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
        setIsLoading(false)
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
              <div className="d-flex align-items-accNo justify-content-between">
                <b className="text-uppercase">{`${t('common.acc_no')} ${t('common.edit')}`}</b>
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
                <div className="col-12 mb-3">
                  <TextInputField
                    label={t('common.acc_no')}
                    isRequired={true}
                    defaultValue={tsNumbers(accNo) || ''}
                    setChange={(val) => setAccNo(tsNumbers(val, true))}
                    error={error?.acc_no}
                    autoFocus={true}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
            <div className="card-footer text-end">
              <Button
                type="submit"
                name={t('common.update')}
                className={'btn-primary py-2 px-3'}
                loading={isLoading}
                endIcon={<Save size={20} />}
                disabled={Object.keys(error).length || isLoading}
              />
            </div>
          </form>
        </div>
      </ModalPro>
    </>
  )
}
