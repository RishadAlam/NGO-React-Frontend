import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'

export default function SelectBoxField({
  label,
  variant,
  config,
  error,
  isRequired = false,
  disabled = false,
  ariaLabel
}) {
  const { t } = useTranslation()
  const inputId = useId()
  const errorId = `${inputId}-error`
  const requiredLabel = (
    <span>
      {label}
      <span className="text-danger">*</span>
    </span>
  )

  return (
    <>
      <div className="select-box-field" style={{ minWidth: '150px' }}>
        <Autocomplete
          clearText={t('localization.shared.clear')}
          openText={t('localization.shared.open')}
          closeText={t('localization.shared.close')}
          loadingText={t('common.loading')}
          noOptionsText={t('localization.shared.no_options')}
          {...config}
          id={config?.id ?? inputId}
          disabled={disabled ? true : false}
          renderInput={(params) => (
            <TextField
              {...params}
              inputProps={{
                ...params.inputProps,
                ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
                'aria-invalid': Boolean(error),
                'aria-required': isRequired,
                'aria-describedby': error ? errorId : undefined
              }}
              label={isRequired ? requiredLabel : label}
              variant={variant || 'standard'}
            />
          )}
        />
        {error && (
          <span id={errorId} className="text-danger my-3">
            {error}
          </span>
        )}
      </div>
    </>
  )
}
