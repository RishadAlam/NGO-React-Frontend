import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

export default function DatePickerInputField({
  label,
  defaultValue,
  error,
  setChange,
  isRequired = false,
  disabled = false
}) {
  const requiredLabel = (
    <span>
      {label}
      <span className="text-danger">*</span>
    </span>
  )

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={isRequired ? requiredLabel : label}
        className="form-control"
        value={(defaultValue && new Date(defaultValue)) || new Date()}
        format="dd/MM/yyyy"
        onChange={(newValue) => setChange(newValue)}
        error={error ? true : false}
        disabled={disabled ? true : false}
      />
      {error && <span className="text-danger my-3">{error}</span>}
    </LocalizationProvider>
  )
}
