import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

export default function SelectDropdownField({
  label,
  variant,
  defaultValue,
  options = [],
  placeholder,
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
    <FormControl
      className="form-control m-0"
      variant={variant || 'standard'}
      sx={{ m: 1, minWidth: 120 }}
      error={error ? true : false}>
      <InputLabel id="demo-simple-select-error-label">
        {isRequired ? requiredLabel : label}
      </InputLabel>
      <Select
        labelId="demo-simple-select-error-label"
        id="demo-simple-select-error"
        value={defaultValue || ''}
        label={isRequired ? requiredLabel : label}
        onChange={(e) => setChange(e.target.value)}
        disabled={disabled ? true : false}>
        {placeholder && (
          <MenuItem disabled value="">
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options.length > 0 &&
          options.map((option, index) => (
            <MenuItem key={index} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
      </Select>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  )
}
