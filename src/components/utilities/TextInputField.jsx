import TextField from '@mui/material/TextField'
import useMediaQuery from '@mui/material/useMediaQuery'

export default function TextInputField({
  label,
  type,
  variant,
  defaultValue,
  error,
  setChange,
  isRequired = false,
  autoFocus = false,
  disabled = false,
  inputMode,
  ariaLabel
}) {
  const mobile = useMediaQuery('(max-width:767.98px)', { noSsr: true })
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
      helperText={typeof error === 'string' ? error : typeof error === 'object' ? error[0] : ''}
      autoFocus={autoFocus && !mobile}
      required={isRequired}
      disabled={disabled ? true : false}
      inputProps={inputMode || ariaLabel ? { inputMode, 'aria-label': ariaLabel } : undefined}
    />
  )
}
