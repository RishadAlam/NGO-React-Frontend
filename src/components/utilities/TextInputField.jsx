import TextField from '@mui/material/TextField'

export default function TextInputField({
  label,
  type,
  icon,
  variant,
  defaultValue,
  error,
  setChange,
  isRequired = false,
  autoFocus = false,
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
      label={isRequired ? requiredLabel : label}
      type={type || 'text'}
      // defaultValue={defaultValue}
      value={defaultValue}
      onChange={(e) => setChange(e.target.value)}
      variant={variant || 'standard'}
      error={error ? true : false}
      helperText={typeof error === 'string' ? error : ''}
      autoFocus={autoFocus}
      required={isRequired}
      disabled={disabled ? true : false}
    />
  )
}
