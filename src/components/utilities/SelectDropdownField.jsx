import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

export default function SelectDropdownField({ label, variant, defaultValue, error, onChange }) {
  return (
    <FormControl
      className="form-control m-0"
      variant={variant || 'standard'}
      sx={{ m: 1, minWidth: 120 }}
      error={error}>
      <InputLabel id="demo-simple-select-error-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-error-label"
        id="demo-simple-select-error"
        value={defaultValue}
        label={label}
        // onChange={onChange}
        renderValue={(value) => `⚠️  - ${value}`}>
        <MenuItem disabled value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  )
}
