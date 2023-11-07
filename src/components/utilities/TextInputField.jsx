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
      // id="input-with-icon-textfield"
      className="form-control"
      label={isRequired ? requiredLabel : label}
      type={type || 'text'}
      defaultValue={defaultValue}
      onChange={(e) => setChange(e.target.value)}
      //   InputProps={{
      //     startAdornment: <InputAdornment position="start">{icon}</InputAdornment>
      //   }}
      variant={variant || 'standard'}
      error={error ? true : false}
      helperText={typeof error === 'string' ? error : ''}
      autoFocus={autoFocus}
      disabled={disabled ? true : false}
    />
  )
}
