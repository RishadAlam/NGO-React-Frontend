import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'

export default function RadioInputGroup({
  label,
  defaultValue,
  options = [],
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
    <>
      <FormControl className="w-100">
        <FormLabel>{isRequired ? requiredLabel : label}</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          className="border rounded-2 px-2 w-100"
          ref={(el) => {
            if (el) {
              el.style.setProperty('border-color', error ? 'red' : '#8884d8', 'important')
            }
          }}>
          {options?.map((option, index) => (
            <FormControlLabel
              key={index}
              value={option.value}
              checked={option.value === defaultValue}
              control={<Radio />}
              onChange={(e) => setChange(e.target.value)}
              label={option.label}
              disabled={disabled}
            />
          ))}
        </RadioGroup>
      </FormControl>
      {error && <span className="text-danger my-3">{error}</span>}
    </>
  )
}
