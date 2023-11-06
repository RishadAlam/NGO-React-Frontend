import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

export default function SelectBoxField({
  label,
  variant,
  config,
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
    <>
      <div style={{ minWidth: '150px' }}>
        <Autocomplete
          {...config}
          id="combo-box-demo"
          disabled={disabled ? true : false}
          renderInput={(params) => (
            <TextField
              {...params}
              label={isRequired ? requiredLabel : label}
              variant={variant || 'standard'}
            />
          )}
        />
        {error && <span className="text-danger my-3">{error}</span>}
      </div>
    </>
  )
}
