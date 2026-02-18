import TextField from '@mui/material/TextField'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { defaultNameCheck } from '../../helper/defaultNameCheck'
import { getFilteredAccount } from '../../helper/getFilteredAccount'
import tsNumbers from '../../libs/tsNumbers'
import AndroidSwitch from '../utilities/AndroidSwitch'
import SelectBoxField from '../utilities/SelectBoxField'

function CategoryConfigRow({ config, index, accounts, setChange, loading, error }) {
  const { t } = useTranslation()

  const DAY = t('common.day')
  const fieldLabels = {
    feeAccount: t('categories_config.field_labels.fee_account'),
    savingRegistrationFee: t('categories_config.field_labels.saving_registration_fee'),
    savingClosingFee: t('categories_config.field_labels.saving_closing_fee'),
    loanRegistrationFee: t('categories_config.field_labels.loan_registration_fee'),
    loanClosingFee: t('categories_config.field_labels.loan_closing_fee'),
    savingWithdrawalFee: t('categories_config.field_labels.saving_withdrawal_fee'),
    loanSavingWithdrawalFee: t('categories_config.field_labels.loan_saving_withdrawal_fee'),
    minSavingWithdrawal: t('categories_config.field_labels.min_saving_withdrawal'),
    maxSavingWithdrawal: t('categories_config.field_labels.max_saving_withdrawal'),
    minLoanSavingWithdrawal: t('categories_config.field_labels.min_loan_saving_withdrawal'),
    maxLoanSavingWithdrawal: t('categories_config.field_labels.max_loan_saving_withdrawal'),
    savingsAccount: t('categories_config.field_labels.savings_account'),
    loanAccount: t('categories_config.field_labels.loan_account')
  }

  const categoryName = defaultNameCheck(
    t,
    config?.category?.is_default,
    'category.default.',
    config?.category?.name
  )

  const getAccountValue = (accountKey, accIdKey) => {
    const accountValue = config?.[accountKey]

    if (accountValue && !Array.isArray(accountValue) && accountValue?.id) {
      return accountValue
    }

    return getFilteredAccount(accounts, config?.[accIdKey]) || null
  }

  const selectBoxConfig = (key, accIdKey) => ({
    options: accounts,
    value: getAccountValue(key, accIdKey),
    getOptionLabel: (option) =>
      defaultNameCheck(t, option.is_default, 'account.default.', option.name),
    onChange: (event, option) => setChange(option, accIdKey, index),
    isOptionEqualToValue: (option, value) => option.id === value?.id
  })

  const renderNumberField = (label, value, name, hasError) => (
    <div className="category-config-input">
      <TextField
        label={label}
        type="text"
        variant="outlined"
        value={value === '' || value === null || value === undefined ? '' : tsNumbers(value)}
        onChange={(event) => {
          const normalizedValue = tsNumbers(event.target.value, true).replace(/\D/g, '')
          setChange(normalizedValue, name, index)
        }}
        inputProps={{ inputMode: 'numeric', autoComplete: 'off' }}
        disabled={loading}
        error={hasError ? true : false}
        helperText={
          typeof hasError === 'string' ? hasError : typeof hasError === 'object' ? hasError[0] : ''
        }
      />
    </div>
  )

  const renderFeeField = (
    label,
    value,
    name,
    accountKey,
    accountIdKey,
    amountError,
    accountError
  ) => (
    <div className="category-config-fee-item">
      {renderNumberField(label, value, name, amountError)}
      <div className="category-config-input">
        <SelectBoxField
          label={fieldLabels.feeAccount}
          variant="outlined"
          config={selectBoxConfig(accountKey, accountIdKey)}
          error={accountError}
          disabled={loading}
        />
      </div>
    </div>
  )

  return (
    <article className="category-config-row-card">
      <header className="category-config-row-header">
        <h5 className="mb-0">{categoryName}</h5>
        <span>#{tsNumbers(index + 1)}</span>
      </header>

      <div className="category-config-row-body">
        <section className="category-config-section">
          <h6>{t('categories_config.account_reg_closing_fees')}</h6>
          <div className="category-config-grid category-config-grid-double">
            {renderFeeField(
              fieldLabels.savingRegistrationFee,
              config?.saving_acc_reg_fee,
              'saving_acc_reg_fee',
              's_reg_fee_account',
              's_reg_fee_acc_id',
              error?.saving_acc_reg_fee,
              error?.s_reg_fee_acc_id
            )}
            {renderFeeField(
              fieldLabels.savingClosingFee,
              config?.saving_acc_closing_fee,
              'saving_acc_closing_fee',
              's_col_fee_account',
              's_col_fee_acc_id',
              error?.saving_acc_closing_fee,
              error?.s_col_fee_acc_id
            )}
            {renderFeeField(
              fieldLabels.loanRegistrationFee,
              config?.loan_acc_reg_fee,
              'loan_acc_reg_fee',
              'l_reg_fee_account',
              'l_reg_fee_acc_id',
              error?.loan_acc_reg_fee,
              error?.l_reg_fee_acc_id
            )}
            {renderFeeField(
              fieldLabels.loanClosingFee,
              config?.loan_acc_closing_fee,
              'loan_acc_closing_fee',
              'l_col_fee_account',
              'l_col_fee_acc_id',
              error?.loan_acc_closing_fee,
              error?.l_col_fee_acc_id
            )}
          </div>
        </section>

        <section className="category-config-section">
          <h6>{t('categories_config.withdrawal_fees')}</h6>
          <div className="category-config-grid category-config-grid-double">
            {renderFeeField(
              fieldLabels.savingWithdrawalFee,
              config?.saving_withdrawal_fee,
              'saving_withdrawal_fee',
              's_with_fee_account',
              's_with_fee_acc_id',
              error?.saving_withdrawal_fee,
              error?.s_with_fee_acc_id
            )}
            {renderFeeField(
              fieldLabels.loanSavingWithdrawalFee,
              config?.loan_saving_withdrawal_fee,
              'loan_saving_withdrawal_fee',
              'ls_with_fee_account',
              'ls_with_fee_acc_id',
              error?.loan_saving_withdrawal_fee,
              error?.ls_with_fee_acc_id
            )}
          </div>
        </section>

        <section className="category-config-section">
          <h6>{t('categories_config.limitations_of_withdrawals')}</h6>
          <div className="category-config-grid category-config-grid-double">
            {renderNumberField(
              fieldLabels.minSavingWithdrawal,
              config?.min_saving_withdrawal,
              'min_saving_withdrawal',
              error?.min_saving_withdrawal
            )}
            {renderNumberField(
              fieldLabels.maxSavingWithdrawal,
              config?.max_saving_withdrawal,
              'max_saving_withdrawal',
              error?.max_saving_withdrawal
            )}
            {renderNumberField(
              fieldLabels.minLoanSavingWithdrawal,
              config?.min_loan_saving_withdrawal,
              'min_loan_saving_withdrawal',
              error?.min_loan_saving_withdrawal
            )}
            {renderNumberField(
              fieldLabels.maxLoanSavingWithdrawal,
              config?.max_loan_saving_withdrawal,
              'max_loan_saving_withdrawal',
              error?.max_loan_saving_withdrawal
            )}
          </div>
        </section>

        <section className="category-config-section">
          <h6>{`${t('categories_config.period_of_account_checking')} (${DAY})`}</h6>
          <div className="category-config-grid category-config-grid-double">
            {renderNumberField(
              fieldLabels.savingsAccount,
              config?.saving_acc_check_time_period,
              'saving_acc_check_time_period',
              error?.saving_acc_check_time_period
            )}
            {renderNumberField(
              fieldLabels.loanAccount,
              config?.loan_acc_check_time_period,
              'loan_acc_check_time_period',
              error?.loan_acc_check_time_period
            )}
          </div>
        </section>

        <section className="category-config-section">
          <h6>{t('categories_config.disable_unchecked_accounts')}</h6>
          <div className="category-config-toggle-grid">
            <div className="category-config-toggle-item">
              <p className="mb-0">{fieldLabels.savingsAccount}</p>
              <AndroidSwitch
                value={Boolean(config?.disable_unchecked_saving_acc)}
                toggleStatus={(e) =>
                  setChange(e.target.checked, 'disable_unchecked_saving_acc', index)
                }
                disabled={loading}
              />
            </div>

            <div className="category-config-toggle-item">
              <p className="mb-0">{fieldLabels.loanAccount}</p>
              <AndroidSwitch
                value={Boolean(config?.disable_unchecked_loan_acc)}
                toggleStatus={(e) =>
                  setChange(e.target.checked, 'disable_unchecked_loan_acc', index)
                }
                disabled={loading}
              />
            </div>
          </div>
        </section>

        <section className="category-config-section">
          <h6>{`${t('categories_config.period_of_inactive_account_disable')} (${DAY})`}</h6>
          <div className="category-config-grid category-config-grid-double">
            {renderNumberField(
              fieldLabels.savingsAccount,
              config?.inactive_saving_acc_disable_time_period,
              'inactive_saving_acc_disable_time_period',
              error?.inactive_saving_acc_disable_time_period
            )}
            {renderNumberField(
              fieldLabels.loanAccount,
              config?.inactive_loan_acc_disable_time_period,
              'inactive_loan_acc_disable_time_period',
              error?.inactive_loan_acc_disable_time_period
            )}
          </div>
        </section>
      </div>
    </article>
  )
}

export default memo(CategoryConfigRow)
