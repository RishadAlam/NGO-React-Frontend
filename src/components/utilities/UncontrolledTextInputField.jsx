import TextField from '@mui/material/TextField'

export default function UncontrolledTextInputField({
  label,
  variant,
  defaultValue,
  error,
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
    <TextField
      className="form-control"
      value={defaultValue}
      label={isRequired ? requiredLabel : label}
      variant={variant || 'standard'}
      error={error ? true : false}
      disabled={disabled ? true : false}
    />
  )
}
