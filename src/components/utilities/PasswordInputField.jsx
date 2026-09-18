import { Visibility, VisibilityOff } from '@mui/icons-material'
import { FormControl, IconButton, Input, InputAdornment, InputLabel } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function PasswordInputField({
  label,
  variant,
  defaultValue,
  error,
  setChange,
  disabled = false
}) {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleMouseDownPassword = (event) => event.preventDefault()

  const requiredLabel = (
    <span>
      {label}
      <span className="text-danger">*</span>
    </span>
  )

  return (
    <>
      <FormControl variant={variant || 'standard'} className="form-control">
        <InputLabel htmlFor="standard-adornment-password">{requiredLabel}</InputLabel>
        <Input
          //   id="standard-adornment-password"
          type={showPassword ? 'text' : 'password'}
          defaultValue={defaultValue}
          onChange={(e) => setChange(e.target.value)}
          error={error ? true : false}
          disabled={disabled ? true : false}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={t(
                  showPassword
                    ? 'localization.shared.hide_password'
                    : 'localization.shared.show_password'
                )}
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      {error && <span className="text-danger my-3">{error}</span>}
    </>
  )
}
