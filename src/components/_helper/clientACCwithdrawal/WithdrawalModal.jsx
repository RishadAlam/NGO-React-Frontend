import { useTranslation } from 'react-i18next'
import Save from '../../../icons/Save'
import XCircle from '../../../icons/XCircle'
import tsNumbers from '../../../libs/tsNumbers'
import Button from '../../utilities/Button'
import ModalPro from '../../utilities/ModalPro'
import TextAreaInputField from '../../utilities/TextAreaInputField'
import TextInputField from '../../utilities/TextInputField'

export default function WithdrawalModal({
  open,
  setOpen,
  withdrawData,
  min,
  max,
  setChange,
  onSubmit,
  errors,
  loading,
  modalTitle,
  btnTitle
}) {
  const { t } = useTranslation()

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
                  <TextInputField
                    label={t('common.amount')}
                    isRequired={true}
                    defaultValue={tsNumbers(withdrawData?.amount || '')}
                    setChange={(val) => setChange(val, 'amount')}
                    error={errors?.amount}
                    autoFocus={true}
                    disabled={loading?.withdrawForm}
                  />
                  {(max > 0 || min > 0) && (
                    <span className="text-info d-block mt-1">
                      {`${t('common.min')} ${t('common.amount')}: ${tsNumbers(`$${min}/-`)} ${t(
                        'common.max'
                      )} ${t('common.amount')}: ${tsNumbers(`$${max}/-`)} `}
                    </span>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <TextInputField
                    label={t('common.balance_remaining')}
                    isRequired={true}
                    defaultValue={tsNumbers(`$${withdrawData?.balance_remaining || 0}/-`) || ''}
                    setChange={(val) => setChange(val, 'balance_remaining')}
                    error={errors?.balance_remaining}
                    disabled={true}
                  />
                </div>
                <div className="col-md-12 mb-3 text-start">
                  <TextAreaInputField
                    label={t('common.description')}
                    defaultValue={withdrawData?.description}
                    isRequired={true}
                    setChange={(val) => setChange(val, 'description')}
                    error={errors?.description}
                    disabled={loading?.withdrawForm}
                  />
                </div>
              </div>
            </div>
            <div className="card-footer text-end">
              <Button
                type="submit"
                name={btnTitle}
                className={'btn-primary py-2 px-3'}
                loading={loading?.withdrawForm || false}
                endIcon={<Save size={20} />}
                disabled={Object.keys(errors).length || loading?.withdrawForm}
              />
            </div>
          </form>
        </div>
      </ModalPro>
    </>
  )
}
