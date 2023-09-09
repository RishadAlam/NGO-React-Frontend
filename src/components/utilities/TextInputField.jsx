import TextField from '@mui/material/TextField'

export default function TextInputField({ label, type, icon, variant, defaultValue, error }) {
  return (
    <TextField
      id="input-with-icon-textfield"
      className="form-control"
      label={label}
      type={type || 'text'}
      defaultValue={defaultValue}
      //   InputProps={{
      //     startAdornment: <InputAdornment position="start">{icon}</InputAdornment>
      //   }}
      variant={variant || 'standard'}
      error={error}
      helperText={error}
    />
  )
}
