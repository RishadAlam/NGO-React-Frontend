import { useTranslation } from 'react-i18next'
import { defaultNameCheck } from '../../../helper/defaultNameCheck'
import useFetch from '../../../hooks/useFetch'
import Info from '../../../icons/Info'
import Save from '../../../icons/Save'
import XCircle from '../../../icons/XCircle'
import tsNumbers from '../../../libs/tsNumbers'
import Button from '../../utilities/Button'
import ModalPro from '../../utilities/ModalPro'
import SelectBoxField from '../../utilities/SelectBoxField'
import TextAreaInputField from '../../utilities/TextAreaInputField'
import TextInputField from '../../utilities/TextInputField'

export default function ClosingModal({
  open,
  setOpen,
  closingData,
  prefix,
  setChange,
  onSubmit,
  errors,
  loading,
  modalTitle,
  btnTitle
}) {
  const { t } = useTranslation()
  const { data: { data: accounts = [] } = [] } = useFetch({ action: 'accounts/active' })

  const accountSelectBoxConfig = {
    options: accounts,
    value: closingData.withdrawal_account || null,
    getOptionLabel: (option) =>
      defaultNameCheck(t, option.is_default, 'account.default.', option.name),
    onChange: (e, option) => setChange(option, 'withdrawal_account'),
    isOptionEqualToValue: (option, value) => option.id === value.id
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
              <span className="text-info">
                <Info size={15} /> {t('common.closing_modal_msg')}
              </span>
              <div className="row mt-3">
                <div className="col-md-6 mb-3">
                  <TextInputField
                    label={t('common.name')}
                    isRequired={true}
                    defaultValue={closingData?.name || ''}
                    error={errors?.name}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <TextInputField
                    label={`${t('common.present')} ${t('common.balance')}`}
                    isRequired={true}
                    defaultValue={tsNumbers(`$${closingData?.balance || 0}/-`)}
                    error={errors?.balance}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <TextInputField
                    label={t('common.closing_fee')}
                    isRequired={true}
                    defaultValue={tsNumbers(closingData?.closing_fee || 0)}
                    error={errors?.closing_fee}
                    disabled={true}
                  />
                </div>
                {prefix === 'saving' && (
                  <div className="col-md-6 mb-3">
                    <TextInputField
                      label={`${t('common.interest')} (${t('common.taka')})`}
                      isRequired={true}
                      defaultValue={tsNumbers(closingData?.interest || '')}
                      setChange={(val) => setChange(val, 'interest')}
                      error={errors?.interest}
                      autoFocus={true}
                      disabled={loading?.closingForm}
                    />
                  </div>
                )}
                <div className="col-md-6 mb-3">
                  <TextInputField
                    label={`${t('common.balance_remaining')} (${t('common.balance')} - ${t('common.closing_fee')} + ${t('common.interest')})`}
                    isRequired={true}
                    defaultValue={tsNumbers(closingData?.total_balance || 0)}
                    error={errors?.total_balance}
                    disabled={true}
                  />
                  {errors?.balance && <span className="text-danger">{errors?.balance}</span>}
                </div>
                {prefix === 'loan' && (
                  <>
                    <div className="col-md-6 mb-3">
                      <TextInputField
                        label={t('common.loan_given')}
                        isRequired={true}
                        defaultValue={tsNumbers(closingData?.loan_given || 0)}
                        error={errors?.loan_given}
                        disabled={true}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <TextInputField
                        label={t('common.total_loan_rec')}
                        isRequired={true}
                        defaultValue={tsNumbers(closingData?.total_loan_rec || 0)}
                        error={errors?.total_loan_rec}
                        disabled={true}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <TextInputField
                        label={t('common.total_loan_remaining')}
                        isRequired={true}
                        defaultValue={tsNumbers(closingData?.total_loan_remaining || 0)}
                        disabled={true}
                      />
                      {errors?.total_loan_remaining && (
                        <span className="text-danger">{errors?.total_loan_remaining}</span>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <TextInputField
                        label={t('common.total_interest')}
                        isRequired={true}
                        defaultValue={tsNumbers(closingData?.total_interest || 0)}
                        error={errors?.total_interest}
                        disabled={true}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <TextInputField
                        label={t('common.total_interest_rec')}
                        isRequired={true}
                        defaultValue={tsNumbers(closingData?.total_interest_rec || 0)}
                        error={errors?.total_interest_rec}
                        disabled={true}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <TextInputField
                        label={t('common.total_interest_remaining')}
                        isRequired={true}
                        defaultValue={tsNumbers(closingData?.total_interest_remaining || 0)}
                        disabled={true}
                      />
                      {errors?.total_interest_remaining && (
                        <span className="text-danger">{errors?.total_interest_remaining}</span>
                      )}
                    </div>
                  </>
                )}
                <div className="col-md-6 mb-3">
                  <TextInputField
                    label={t('common.total_installment')}
                    isRequired={true}
                    defaultValue={tsNumbers(closingData?.total_installment || 0)}
                    error={errors?.total_installment}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <TextInputField
                    label={t('common.total_rec_installment')}
                    isRequired={true}
                    defaultValue={tsNumbers(closingData?.total_rec_installment || 0)}
                    error={errors?.total_rec_installment}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <SelectBoxField
                    label={t('common.withdrawal_account')}
                    config={accountSelectBoxConfig}
                    isRequired={true}
                    error={errors?.withdrawal_account}
                    disabled={loading?.withdrawal_account}
                  />
                  <span className="text-info">
                    <Info size={15} /> {t('common.deduct_withdrawal_msg')}
                  </span>
                </div>
                <div className="col-md-12 mb-3 text-start">
                  <TextAreaInputField
                    label={t('common.description')}
                    defaultValue={closingData?.description}
                    isRequired={true}
                    setChange={(val) => setChange(val, 'description')}
                    error={errors?.description}
                    disabled={loading?.closingForm}
                  />
                </div>
              </div>
            </div>
            <div className="card-footer text-end">
              <Button
                type="submit"
                name={btnTitle}
                className={'btn-primary py-2 px-3'}
                loading={loading?.closingForm || false}
                endIcon={<Save size={20} />}
                disabled={Object.keys(errors).length || loading?.closingForm}
              />
            </div>
          </form>
        </div>
      </ModalPro>
    </>
  )
}
