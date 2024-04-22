import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { isEmpty } from '../../helper/isEmpty'
import useFetch from '../../hooks/useFetch'
import Save from '../../icons/Save'
import XCircle from '../../icons/XCircle'
import xFetch from '../../utilities/xFetch'
import Button from '../utilities/Button'
import ModalPro from '../utilities/ModalPro'
import SelectBoxField from '../utilities/SelectBoxField'

export default function CenterUpdateModal({ open, setOpen, defaultField = null, mutate }) {
  const [center, setField] = useState(defaultField || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({})
  const { accessToken } = useAuthDataValue()
  const { t } = useTranslation()
  const { data: { data: centers = [] } = [] } = useFetch({ action: 'centers/active' })

  const selectBoxConfig = {
    options: centers,
    value: center,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setField(option),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

  const onSubmit = (event) => {
    event.preventDefault()

    if (isEmpty(center?.id)) {
      toast.error(t('common_validation.required_centers_are_empty'))
      return
    }

    setIsLoading(true)
    xFetch('centers', center, null, accessToken, null, 'POST')
      .then((response) => {
        setIsLoading(false)
        if (response?.success) {
          toast.success(response.message)
          mutate()
          setOpen(false)
          setField()
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
              <div className="d-flex align-items-center justify-content-between">
                <b className="text-uppercase">{`${t('common.center')} ${t('common.edit')}`}</b>
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
                  <SelectBoxField
                    label={t('common.center')}
                    config={selectBoxConfig}
                    isRequired={true}
                    error={error?.center}
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
