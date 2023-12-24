import { useTranslation } from 'react-i18next'
import { defaultNameCheck } from '../../helper/defaultNameCheck'
import useFetch from '../../hooks/useFetch'
import Save from '../../icons/Save'
import XCircle from '../../icons/XCircle'
import Button from '../utilities/Button'
import DatePickerInputField from '../utilities/DatePickerInputField'
import ModalPro from '../utilities/ModalPro'
import SelectBoxField from '../utilities/SelectBoxField'
import TextInputField from '../utilities/TextInputField'
import UncontrolledTextInputField from '../utilities/UncontrolledTextInputField'

export default function IncomeCategoriesFormModal({
  open,
  setOpen,
  error,
  modalTitle,
  btnTitle,
  defaultValues,
  setChange,
  loading,
  onSubmit
}) {
  const { t } = useTranslation()
  const { data: { data: accounts = [] } = [] } = useFetch({ action: 'accounts/active' })
  const { data: { data: categories = [] } = [] } = useFetch({
    action: 'accounts/incomes/categories/active'
  })

  const accountSelectBoxConfig = {
    options: accounts,
    value: defaultValues?.account || null,
    getOptionLabel: (option) =>
      defaultNameCheck(t, option.is_default, 'account.default.', option.name),
    onChange: (e, option) => setChange(option, 'account_id'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

  const categoriesSelectBoxConfig = {
    options: categories,
    value: defaultValues?.category || null,
    getOptionLabel: (option) =>
      defaultNameCheck(t, option.is_default, 'income_categories.default.', option.name),
    onChange: (e, option) => setChange(option, 'income_category_id'),
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
              {error?.message && error?.message !== '' && (
                <div className="alert alert-danger" role="alert">
                  <strong>{error?.message}</strong>
                </div>
              )}
              <div className="row">
                {typeof defaultValues?.account !== 'undefined' && (
                  <div className="col-md-6 mb-3">
                    <SelectBoxField
                      label={t('common.account')}
                      config={accountSelectBoxConfig}
                      isRequired={true}
                      error={error?.account_id}
                      disabled={loading?.IncomeForm}
                    />
                  </div>
                )}
                <div className="col-md-6 mb-3">
                  <SelectBoxField
                    label={t('common.category')}
                    config={categoriesSelectBoxConfig}
                    isRequired={true}
                    error={error?.income_category_id}
                    disabled={loading?.IncomeForm}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <DatePickerInputField
                    label={t('common.date')}
                    isRequired={true}
                    defaultValue={defaultValues?.date || ''}
                    setChange={(val) => setChange(val, 'date')}
                    error={error?.date}
                    disabled={loading?.IncomeForm}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <TextInputField
                    label={t('common.amount')}
                    type="number"
                    isRequired={true}
                    defaultValue={defaultValues?.amount || ''}
                    setChange={(val) => setChange(val, 'amount')}
                    error={error?.amount}
                    autoFocus={true}
                    disabled={loading?.IncomeForm}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <UncontrolledTextInputField
                    label={t('common.previous_balance')}
                    isRequired={true}
                    defaultValue={defaultValues?.previous_balance || ''}
                    error={error?.previous_balance}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <UncontrolledTextInputField
                    label={t('common.balance')}
                    isRequired={true}
                    defaultValue={defaultValues?.balance || ''}
                    error={error?.balance}
                    disabled={true}
                  />
                </div>
                <div
                  className={`${
                    typeof defaultValues?.account !== 'undefined' ? 'col-md-12' : 'col-md-6'
                  } mb-3`}>
                  <TextInputField
                    label={t('common.description')}
                    defaultValue={defaultValues?.description || ''}
                    setChange={(val) => setChange(val, 'description')}
                    error={error?.description}
                    disabled={loading?.IncomeForm}
                  />
                </div>
              </div>
            </div>
            <div className="card-footer text-end">
              <Button
                type="submit"
                name={btnTitle}
                className={'btn-primary py-2 px-3'}
                loading={loading?.IncomeForm || false}
                endIcon={<Save size={20} />}
                disabled={Object.keys(error).length || loading?.IncomeForm}
              />
            </div>
          </form>
        </div>
      </ModalPro>
    </>
  )
}
