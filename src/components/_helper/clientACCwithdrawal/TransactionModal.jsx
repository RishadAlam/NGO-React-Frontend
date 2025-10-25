import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { defaultNameCheck } from '../../../helper/defaultNameCheck'
import { isEmpty } from '../../../helper/isEmpty'
import useFetch from '../../../hooks/useFetch'
import Save from '../../../icons/Save'
import XCircle from '../../../icons/XCircle'
import tsNumbers from '../../../libs/tsNumbers'
import Button from '../../utilities/Button'
import ModalPro from '../../utilities/ModalPro'
import RadioInputGroup from '../../utilities/RadioInputGroup'
import SelectBoxField from '../../utilities/SelectBoxField'
import TextAreaInputField from '../../utilities/TextAreaInputField'
import TextInputField from '../../utilities/TextInputField'

export default function TransactionModal({
  open,
  setOpen,
  transactionData,
  prefix,
  min,
  max,
  setChange,
  onSubmit,
  errors,
  loading
}) {
  const { id } = useParams()
  const { t } = useTranslation()

  const { data: { data: fields = [] } = [] } = useFetch({ action: 'fields/active' })

  const categoryParam =
    transactionData?.type === `${prefix}_to_saving`
      ? 'saving=true'
      : transactionData?.type === `${prefix}_to_loan`
        ? 'loan=true'
        : false

  const { data: { data: categories = [] } = [] } = useFetch({
    action: `categories/active?${categoryParam}`
  })

  const { data: { data: centers = [] } = [] } = useFetch({
    action: 'centers/active',
    queryParams: transactionData.field_id ? { field_id: transactionData.field_id } : null
  })

  const accountPrefix =
    transactionData?.type === `${prefix}_to_saving` ? 'saving-accounts' : 'loan-accounts'
  const { data: { data: accounts = [] } = [] } = useFetch({
    action: `client/registration/${accountPrefix}/${transactionData?.field_id || ''}/${transactionData?.center_id || ''}/${transactionData?.category_id || ''}`
  })

  const fieldConfig = {
    options: fields,
    value: transactionData?.field || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setChange(option, 'field_id'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const categoryConfig = {
    options: categories.sort((a, b) => (a.group > b.group ? 1 : -1)),
    value: transactionData?.category || null,
    getOptionLabel: (option) =>
      defaultNameCheck(t, option.is_default, 'category.default.', option.name),
    onChange: (e, option) => setChange(option, 'category_id'),
    groupBy: (option) => option.group,
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const centerConfig = {
    options: centers?.length
      ? centers.filter((center) => Number(center?.field_id) === Number(transactionData.field_id))
      : [],
    value: transactionData?.center || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setChange(option, 'center_id'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const accountsConfig = {
    options: accounts,
    value: transactionData.rx_account || null,
    getOptionLabel: (option) =>
      `${tsNumbers(option.acc_no)} | ${option?.client_registration?.name}`,
    onChange: (e, option) => setChange(option, 'rx_account'),
    filterOptions: (options, state) =>
      state.inputValue
        ? options.filter(
            (option) => option.acc_no.includes(tsNumbers(state.inputValue, true)) && option.id != id
          )
        : options,
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

  return (
    <>
      <ModalPro open={open} handleClose={() => setOpen(false)}>
        <div className="card">
          <form onSubmit={onSubmit}>
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <b className="text-uppercase">{t('common.transaction')}</b>
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
                <div
                  className={`col-md-${isEmpty(transactionData?.type) ? 12 : 6} col-lg-${isEmpty(transactionData?.type) ? 12 : 4} mb-3`}>
                  <RadioInputGroup
                    label={`${t('common.transaction')} ${t('common.account')} ${t('common.type')}`}
                    options={[
                      { label: t('common.saving_account'), value: `${prefix}_to_saving` },
                      { label: t('common.loan_account'), value: `${prefix}_to_loan` }
                    ]}
                    isRequired={true}
                    defaultValue={transactionData?.type || ''}
                    setChange={(val) => setChange(val, 'type')}
                    error={errors?.type}
                    disabled={loading?.transactionForm}
                  />
                </div>
                {!isEmpty(transactionData?.type) && (
                  <>
                    <div className="col-md-6 col-lg-4 mb-3">
                      <SelectBoxField
                        label={t('common.field')}
                        config={fieldConfig}
                        isRequired={true}
                        error={errors?.field_id}
                        disabled={loading?.transactionForm}
                      />
                    </div>
                    <div className="col-md-6 col-lg-4 mb-3">
                      <SelectBoxField
                        label={t('common.center')}
                        config={centerConfig}
                        isRequired={true}
                        error={errors?.center_id}
                        disabled={loading?.transactionForm}
                      />
                    </div>
                    <div className="col-md-6 col-lg-4 mb-3">
                      <SelectBoxField
                        label={t('common.category')}
                        config={categoryConfig}
                        isRequired={true}
                        error={errors?.category_id}
                        disabled={loading?.transactionForm}
                      />
                    </div>
                    <div className="col-md-6 col-lg-4 mb-3">
                      <SelectBoxField
                        label={`${t('common.transaction')} ${t('common.account')}`}
                        config={accountsConfig}
                        disabled={loading?.transactionForm}
                      />
                    </div>
                    <div className="col-md-6 col-lg-4 mb-3">
                      <TextInputField
                        label={`${t('common.present')} ${t('common.balance')}`}
                        isRequired={true}
                        defaultValue={tsNumbers(`$${transactionData?.balance || 0}/-`) || ''}
                        setChange={(val) => setChange(val, 'balance')}
                        error={errors?.balance}
                        disabled={true}
                      />
                    </div>
                    <div className="col-md-6 col-lg-4 mb-3">
                      <TextInputField
                        label={t('common.amount')}
                        isRequired={true}
                        defaultValue={tsNumbers(transactionData?.amount || '')}
                        setChange={(val) => setChange(val, 'amount')}
                        error={errors?.amount}
                        autoFocus={true}
                        disabled={loading?.transactionForm}
                      />
                      {(Number(max) > 0 || Number(min) > 0) && (
                        <span className="text-info d-block mt-1">
                          {`${t('common.min')} ${t('common.amount')}: ${tsNumbers(`$${min}/-`)} ${t(
                            'common.max'
                          )} ${t('common.amount')}: ${tsNumbers(`$${max}/-`)} `}
                        </span>
                      )}
                    </div>
                    <div className="col-md-6 col-lg-4 mb-3">
                      <TextInputField
                        label={t('common.balance_remaining')}
                        isRequired={true}
                        defaultValue={
                          tsNumbers(`$${transactionData?.balance_remaining || 0}/-`) || ''
                        }
                        setChange={(val) => setChange(val, 'balance_remaining')}
                        error={errors?.balance_remaining}
                        disabled={true}
                      />
                    </div>
                    <div className="col-md-12 mb-3 text-start">
                      <TextAreaInputField
                        label={t('common.description')}
                        defaultValue={transactionData?.description}
                        isRequired={true}
                        setChange={(val) => setChange(val, 'description')}
                        error={errors?.description}
                        disabled={loading?.transactionForm}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="card-footer text-end">
              <Button
                type="submit"
                name={t('common.submit')}
                className={'btn-primary py-2 px-3'}
                loading={loading?.transactionForm || false}
                endIcon={<Save size={20} />}
                disabled={Object.keys(errors).length || loading?.transactionForm}
              />
            </div>
          </form>
        </div>
      </ModalPro>
    </>
  )
}
