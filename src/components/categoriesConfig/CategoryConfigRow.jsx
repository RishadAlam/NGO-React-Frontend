import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { getFilteredAccount } from '../../helper/getFilteredAccount'
import { isEmptyArray } from '../../helper/isEmptyObject'
import InputFieldSetup from '../_helper/InputFieldSetup'
import AndroidSwitch from '../utilities/AndroidSwitch'
import SelectBoxField from '../utilities/SelectBoxField'

function CategoryConfigRow({ config, index, accounts, setChange, loading, error }) {
  const { t } = useTranslation()

  // Define select box configurations
  const selectBoxConfig = (key, accIdKey) => ({
    options: accounts,
    value: config[key],
    getOptionLabel: (option) =>
      option.is_default ? t(`account.default.${option.name}`) : option.name,
    onChange: (e, option) => setChange(option, accIdKey, index),
    isOptionEqualToValue: (option, value) => option.id === value.id
  })

  // Update the config properties if they are empty arrays
  const updateConfigIfEmpty = (key, accIdKey) => {
    if (isEmptyArray(config[key] || [])) {
      config[key] = getFilteredAccount(accounts, config[accIdKey]) || null
    }
  }

  // Update the configuration properties
  updateConfigIfEmpty('s_reg_fee_account', 's_reg_fee_acc_id')
  updateConfigIfEmpty('s_col_fee_account', 's_col_fee_acc_id')
  updateConfigIfEmpty('l_reg_fee_account', 'l_reg_fee_acc_id')
  updateConfigIfEmpty('l_col_fee_account', 'l_col_fee_acc_id')
  updateConfigIfEmpty('s_with_fee_account', 's_with_fee_acc_id')
  updateConfigIfEmpty('ls_with_fee_account', 'ls_with_fee_acc_id')

  // Define select box configurations using the helper function
  const s_reg_fee_select_box_config = selectBoxConfig('s_reg_fee_account', 's_reg_fee_acc_id')
  const s_col_fee_select_box_config = selectBoxConfig('s_col_fee_account', 's_col_fee_acc_id')
  const l_reg_fee_select_box_config = selectBoxConfig('l_reg_fee_account', 'l_reg_fee_acc_id')
  const l_col_fee_select_box_config = selectBoxConfig('l_col_fee_account', 'l_col_fee_acc_id')
  const s_with_fee_select_box_config = selectBoxConfig('s_with_fee_account', 's_with_fee_acc_id')
  const ls_with_fee_select_box_config = selectBoxConfig('ls_with_fee_account', 'ls_with_fee_acc_id')

  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        {config?.category?.is_default
          ? t(`category.default.${config?.category?.name}`)
          : config?.category?.name}
      </td>
      <td>
        <InputFieldSetup
          val={config?.saving_acc_reg_fee}
          name="saving_acc_reg_fee"
          index={index}
          setChange={setChange}
          disabled={loading}
          error={error?.saving_acc_reg_fee}
        />
        <SelectBoxField
          label=""
          config={s_reg_fee_select_box_config}
          error={error?.s_reg_fee_acc_id}
          disabled={loading}
        />
      </td>
      <td>
        <InputFieldSetup
          val={config?.saving_acc_closing_fee}
          name="saving_acc_closing_fee"
          index={index}
          setChange={setChange}
          disabled={loading}
          error={error?.saving_acc_closing_fee}
        />
        <SelectBoxField
          label=""
          config={s_col_fee_select_box_config}
          error={error?.s_col_fee_acc_id}
          disabled={loading}
        />
      </td>
      <td>
        <InputFieldSetup
          val={config?.loan_acc_reg_fee}
          name="loan_acc_reg_fee"
          index={index}
          setChange={setChange}
          disabled={loading}
          error={error?.loan_acc_reg_fee}
        />
        <SelectBoxField
          label=""
          config={l_reg_fee_select_box_config}
          error={error?.l_reg_fee_acc_id}
          disabled={loading}
        />
      </td>
      <td>
        <InputFieldSetup
          val={config?.loan_acc_closing_fee}
          name="loan_acc_closing_fee"
          index={index}
          setChange={setChange}
          disabled={loading}
          error={error?.loan_acc_closing_fee}
        />
        <SelectBoxField
          label=""
          config={l_col_fee_select_box_config}
          error={error?.l_col_fee_acc_id}
          disabled={loading}
        />
      </td>
      <td>
        <InputFieldSetup
          val={config?.saving_withdrawal_fee}
          name="saving_withdrawal_fee"
          index={index}
          setChange={setChange}
          disabled={loading}
          error={error?.saving_withdrawal_fee}
        />
        <SelectBoxField
          label=""
          config={s_with_fee_select_box_config}
          error={error?.s_with_fee_acc_id}
          disabled={loading}
        />
      </td>
      <td>
        <InputFieldSetup
          val={config?.loan_saving_withdrawal_fee}
          name="loan_saving_withdrawal_fee"
          index={index}
          setChange={setChange}
          disabled={loading}
          error={error?.loan_saving_withdrawal_fee}
        />
        <SelectBoxField
          label=""
          config={ls_with_fee_select_box_config}
          error={error?.ls_with_fee_acc_id}
          disabled={loading}
        />
      </td>
      <td>
        <InputFieldSetup
          val={config?.min_saving_withdrawal}
          name="min_saving_withdrawal"
          index={index}
          setChange={setChange}
          disabled={loading}
          error={error?.min_saving_withdrawal}
        />
      </td>
      <td>
        <InputFieldSetup
          val={config?.max_saving_withdrawal}
          name="max_saving_withdrawal"
          index={index}
          setChange={setChange}
          disabled={loading}
          error={error?.max_saving_withdrawal}
        />
      </td>
      <td>
        <InputFieldSetup
          val={config?.min_loan_saving_withdrawal}
          name="min_loan_saving_withdrawal"
          index={index}
          setChange={setChange}
          disabled={loading}
          error={error?.min_loan_saving_withdrawal}
        />
      </td>
      <td>
        <InputFieldSetup
          val={config?.max_loan_saving_withdrawal}
          name="max_loan_saving_withdrawal"
          index={index}
          setChange={setChange}
          disabled={loading}
          error={error?.max_loan_saving_withdrawal}
        />
      </td>
      <td>
        <InputFieldSetup
          val={config?.saving_acc_check_time_period}
          name="saving_acc_check_time_period"
          index={index}
          setChange={setChange}
          disabled={loading}
          error={error?.saving_acc_check_time_period}
        />
      </td>
      <td>
        <InputFieldSetup
          val={config?.loan_acc_check_time_period}
          name="loan_acc_check_time_period"
          index={index}
          setChange={setChange}
          disabled={loading}
          error={error?.loan_acc_check_time_period}
        />
      </td>
      <td>
        <AndroidSwitch
          value={config?.disable_unchecked_saving_acc}
          toggleStatus={(e) => setChange(e.target.checked, 'disable_unchecked_saving_acc', index)}
        />
      </td>
      <td>
        <AndroidSwitch
          value={config?.disable_unchecked_loan_acc}
          toggleStatus={(e) => setChange(e.target.checked, 'disable_unchecked_loan_acc', index)}
        />
      </td>
      <td>
        <InputFieldSetup
          val={config?.inactive_saving_acc_disable_time_period}
          name="inactive_saving_acc_disable_time_period"
          index={index}
          setChange={setChange}
          disabled={loading}
          error={error?.inactive_saving_acc_disable_time_period}
        />
      </td>
      <td>
        <InputFieldSetup
          val={config?.inactive_loan_acc_disable_time_period}
          name="inactive_loan_acc_disable_time_period"
          index={index}
          setChange={setChange}
          disabled={loading}
          error={error?.inactive_loan_acc_disable_time_period}
        />
      </td>
    </tr>
  )
}

export default memo(CategoryConfigRow)
