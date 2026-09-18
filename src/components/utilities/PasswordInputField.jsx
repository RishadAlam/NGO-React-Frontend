import { Visibility, VisibilityOff } from '@mui/icons-material'
import { FormControl, IconButton, Input, InputAdornment, InputLabel } from '@mui/material'
import { useId, useState } from 'react'
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
  const inputId = useId()
  const errorId = `${inputId}-error`
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
        <InputLabel htmlFor={inputId}>{requiredLabel}</InputLabel>
        <Input
          id={inputId}
          inputProps={{ 'aria-describedby': error ? errorId : undefined, 'aria-required': true }}
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
      {error && (
        <span id={errorId} className="text-danger my-3">
          {error}
        </span>
      )}
    </>
  )
}
