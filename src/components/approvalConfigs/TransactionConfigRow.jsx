import { useTranslation } from 'react-i18next'
import { defaultNameCheck } from '../../helper/defaultNameCheck'
import InputFieldSetup from '../_helper/InputFieldSetup'
import SelectBoxField from '../utilities/SelectBoxField'

export default function TransactionConfigRow({
  config,
  data_key,
  index,
  accounts,
  setChange,
  loading,
  error
}) {
  const { t } = useTranslation()
  if (!config[data_key]?.account) {
    config[data_key]['account'] =
      accounts?.filter((account) => account.id === config[data_key].fee_store_acc_id)[0] || null
  }

  const selectBoxConfig = {
    options: accounts,
    value: config[data_key]?.account,
    getOptionLabel: (option) =>
      defaultNameCheck(t, option.is_default, 'account.default.', option.name),
    onChange: (e, option) => setChange(option, 'fee_store_acc_id', data_key),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

  return (
    <tr>
      <td>{index + 1}</td>
      <td>{data_key}</td>
      <td>
        <InputFieldSetup
          val={config[data_key]?.fee}
          name="fee"
          index={data_key}
          setChange={setChange}
          disabled={loading}
          error={error?.fee}
        />
      </td>
      <td>
        <SelectBoxField
          label=""
          config={selectBoxConfig}
          error={error?.fee_store_acc_id}
          disabled={loading}
        />
      </td>
      <td>
        <InputFieldSetup
          val={config[data_key]?.min}
          name="min"
          index={data_key}
          setChange={setChange}
          disabled={loading}
          error={error?.min}
        />
      </td>
      <td>
        <InputFieldSetup
          val={config[data_key]?.max}
          name="max"
          index={data_key}
          setChange={setChange}
          disabled={loading}
          error={error?.max}
        />
      </td>
    </tr>
  )
}
