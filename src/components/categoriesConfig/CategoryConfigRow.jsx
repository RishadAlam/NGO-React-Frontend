import { useTranslation } from 'react-i18next'
import InputFieldSetup from '../_helper/InputFieldSetup'
import AndroidSwitch from '../utilities/AndroidSwitch'
import SelectBoxField from '../utilities/SelectBoxField'

export default function CategoryConfigRow({ config, index, accounts, setChange, loading, error }) {
  const { t } = useTranslation()

  if (!config?.s_reg_fee_account) {
    config['s_reg_fee_account'] =
      accounts?.filter((account) => account.id === config.s_reg_fee_acc_id)[0] || null
  }
  if (!config?.s_col_fee_account) {
    config['s_col_fee_account'] =
      accounts?.filter((account) => account.id === config.s_col_fee_acc_id)[0] || null
  }
  if (!config?.l_reg_fee_account) {
    config['l_reg_fee_account'] =
      accounts?.filter((account) => account.id === config.l_reg_fee_acc_id)[0] || null
  }
  if (!config?.l_col_fee_account) {
    config['l_col_fee_account'] =
      accounts?.filter((account) => account.id === config.l_col_fee_acc_id)[0] || null
  }
  if (!config?.s_with_fee_account) {
    config['s_with_fee_account'] =
      accounts?.filter((account) => account.id === config.s_with_fee_acc_id)[0] || null
  }
  if (!config?.ls_with_fee_account) {
    config['ls_with_fee_account'] =
      accounts?.filter((account) => account.id === config.ls_with_fee_acc_id)[0] || null
  }

  const s_reg_fee_select_box_config = {
    options: accounts,
    value: config.s_reg_fee_account,
    getOptionLabel: (option) =>
      option.is_default ? t(`account.default.${option.name}`) : option.name,
    onChange: (e, option) => setChange(option, 's_reg_fee_acc_id', index),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const s_col_fee_select_box_config = {
    options: accounts,
    value: config.s_col_fee_account,
    getOptionLabel: (option) =>
      option.is_default ? t(`account.default.${option.name}`) : option.name,
    onChange: (e, option) => setChange(option, 's_col_fee_acc_id', index),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const l_reg_fee_select_box_config = {
    options: accounts,
    value: config.l_reg_fee_account,
    getOptionLabel: (option) =>
      option.is_default ? t(`account.default.${option.name}`) : option.name,
    onChange: (e, option) => setChange(option, 'l_reg_fee_acc_id', index),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const l_col_fee_select_box_config = {
    options: accounts,
    value: config.l_col_fee_account,
    getOptionLabel: (option) =>
      option.is_default ? t(`account.default.${option.name}`) : option.name,
    onChange: (e, option) => setChange(option, 'l_col_fee_acc_id', index),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const s_with_fee_select_box_config = {
    options: accounts,
    value: config.s_with_fee_account,
    getOptionLabel: (option) =>
      option.is_default ? t(`account.default.${option.name}`) : option.name,
    onChange: (e, option) => setChange(option, 's_with_fee_acc_id', index),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }
  const ls_with_fee_select_box_config = {
    options: accounts,
    value: config.ls_with_fee_account,
    getOptionLabel: (option) =>
      option.is_default ? t(`account.default.${option.name}`) : option.name,
    onChange: (e, option) => setChange(option, 'ls_with_fee_acc_id', index),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

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
