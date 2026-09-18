import React from 'react'
import LoaderSm from '../loaders/LoaderSm'
import { useMediaQuery } from '@mui/material'
import { useTranslation } from 'react-i18next'
import XCircle from '../../icons/XCircle'

export default function Button({
  name,
  type = 'button',
  disabled,
  loading,
  style,
  className,
  onclick,
  endIcon,
  'aria-label': ariaLabel,
  title
}) {
  const mobile = useMediaQuery('(max-width:767.98px)', { noSsr: true })
  const { t } = useTranslation()
  const isUnnamedClose =
    mobile && type === 'button' && !name && !ariaLabel && endIcon?.type === XCircle
  const trailingIcon = loading ? (
    <LoaderSm size={20} clr="var(--primary-color)" className="ms-2" />
  ) : (
    endIcon
  )

  return (
    <>
      <button
        className={`btn btn-block ${className || 'btn-primary'}${isUnnamedClose ? ' mobile-dialog-close' : ''}`}
        type={type}
        aria-label={ariaLabel || (isUnnamedClose ? t('localization.shared.close') : undefined)}
        title={title}
        disabled={disabled}
        style={style}
        onClick={onclick}>
        <div className="d-inline-flex align-items-center justify-content-center">
          {name}
          {trailingIcon ? (
            <span className="ms-2 d-inline-flex align-items-center">{trailingIcon}</span>
          ) : null}
        </div>
      </button>
    </>
  )
}
