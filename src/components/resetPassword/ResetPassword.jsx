import { create } from 'mutative'
import { useId, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import LoaderSm from '../loaders/LoaderSm'
import checkPassword from '../../helper/checkPassword'
import CheckCircle from '../../icons/CheckCircle'
import Eye from '../../icons/Eye'
import EyeOff from '../../icons/EyeOff'
import XCircle from '../../icons/XCircle'
import xFetch from '../../utilities/xFetch'
import { useMediaQuery } from '@mui/material'

const LockIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
)

export default function ResetPassword({ userId, loading, setLoading }) {
  const { t } = useTranslation()
  const mobile = useMediaQuery('(max-width:767.98px)', { noSsr: true })
  const PasswordToggle = mobile ? 'button' : 'span'
  const errorId = useId()
  const [isPlainText, SetIsPlainText] = useState({ password: false, confirmPassword: false })
  const [inputs, setInputs] = useState({ password: '', confirmPassword: '' })
  const [errors, SetErrors] = useState({
    password: '',
    confirmPassword: '',
    passwordLength: true,
    passwordUppercase: true,
    passwordLowercase: true,
    passwordDigits: true,
    passwordSpecial: true
  })
  const validationMessage = (message) =>
    typeof message === 'string' && message.startsWith('localization.domain.') ? t(message) : message

  const setChange = (name, val) => {
    setInputs((prev) =>
      create(prev, (d) => {
        d[name] = val
      })
    )
    SetErrors((prev) =>
      create(prev, (d) => {
        d?.message && delete d.message
        if (name === 'password') {
          val === '' ? (d.password = 'localization.domain.password_required') : delete d.password
          checkPassword(val, SetErrors)
        } else {
          val === ''
            ? (d.confirmPassword = 'localization.domain.confirm_password_required')
            : delete d.confirmPassword
          if (val !== '' && inputs.password !== val)
            d.confirmPassword = 'localization.domain.password_mismatch'
        }
      })
    )
  }

  const submitPassword = (event) => {
    event.preventDefault()
    if (!inputs.password || !inputs.confirmPassword || !userId) {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }
    setLoading({ ...loading, resetPassword: true })
    const controller = new AbortController()
    xFetch(
      'reset-password',
      {
        user_id: userId,
        new_password: inputs.password,
        confirm_password: inputs.confirmPassword
      },
      null,
      controller.signal,
      null,
      'PUT'
    ).then((response) => {
      setLoading({ ...loading, resetPassword: false })
      if (response?.success) {
        toast.success(response.message)
        return (window.location.href = '/login')
      }
      SetErrors(response?.errors || response)
    })
    controller.abort()
  }

  const Rule = ({ ok, label }) => (
    <li className={ok ? 'ok' : ''}>
      {ok ? <CheckCircle size={14} /> : <XCircle size={14} />} {label}
    </li>
  )

  return (
    <form onSubmit={submitPassword} noValidate>
      {errors?.message && <div className="auth-alert">{errors.message}</div>}
      <input type="hidden" name="id" value={userId || ''} />

      <div className="auth-field">
        <label>{t('auth.new_password', 'New password')}</label>
        <div className="input-wrap">
          <span className="leading-icon">
            <LockIcon />
          </span>
          <input
            type={isPlainText.password ? 'text' : 'password'}
            aria-label={t('auth.new_password')}
            aria-invalid={Boolean(errors?.password)}
            aria-describedby={errors?.password ? `${errorId}-password` : undefined}
            className={errors?.password ? 'has-error' : ''}
            placeholder="••••••••"
            value={inputs.password}
            onChange={(e) => setChange('password', e.target.value)}
            disabled={loading?.resetPassword}
          />
          <PasswordToggle
            className={`trailing-icon is-button${mobile ? ' mobile-password-toggle' : ''}`}
            type={mobile ? 'button' : undefined}
            aria-label={
              mobile
                ? t(
                    isPlainText.password
                      ? 'localization.shared.hide_password'
                      : 'localization.shared.show_password'
                  )
                : undefined
            }
            aria-pressed={mobile ? isPlainText.password : undefined}
            onClick={() => SetIsPlainText((p) => ({ ...p, password: !p.password }))}>
            {isPlainText.password ? <Eye size={18} /> : <EyeOff size={18} />}
          </PasswordToggle>
        </div>
        {errors?.password && (
          <div id={`${errorId}-password`} className="field-error">
            {validationMessage(errors.password)}
          </div>
        )}
      </div>

      <div className="auth-field">
        <label>{t('auth.confirm_password', 'Confirm password')}</label>
        <div className="input-wrap">
          <span className="leading-icon">
            <LockIcon />
          </span>
          <input
            type={isPlainText.confirmPassword ? 'text' : 'password'}
            aria-label={t('auth.confirm_password')}
            aria-invalid={Boolean(errors?.confirmPassword)}
            aria-describedby={errors?.confirmPassword ? `${errorId}-confirm` : undefined}
            className={errors?.confirmPassword ? 'has-error' : ''}
            placeholder="••••••••"
            value={inputs.confirmPassword}
            onChange={(e) => setChange('confirmPassword', e.target.value)}
            disabled={loading?.resetPassword}
          />
          <PasswordToggle
            className={`trailing-icon is-button${mobile ? ' mobile-password-toggle' : ''}`}
            type={mobile ? 'button' : undefined}
            aria-label={
              mobile
                ? t(
                    isPlainText.confirmPassword
                      ? 'localization.shared.hide_password'
                      : 'localization.shared.show_password'
                  )
                : undefined
            }
            aria-pressed={mobile ? isPlainText.confirmPassword : undefined}
            onClick={() => SetIsPlainText((p) => ({ ...p, confirmPassword: !p.confirmPassword }))}>
            {isPlainText.confirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </PasswordToggle>
        </div>
        {errors?.confirmPassword && (
          <div id={`${errorId}-confirm`} className="field-error">
            {validationMessage(errors.confirmPassword)}
          </div>
        )}
      </div>

      <ul className="auth-strength">
        <Rule ok={!errors?.passwordLength} label={t('auth.rule_length', 'Min 8 characters')} />
        <Rule ok={!errors?.passwordUppercase} label={t('auth.rule_upper', 'Uppercase letter')} />
        <Rule ok={!errors?.passwordLowercase} label={t('auth.rule_lower', 'Lowercase letter')} />
        <Rule ok={!errors?.passwordDigits} label={t('auth.rule_digit', 'Digit (0-9)')} />
        <Rule ok={!errors?.passwordSpecial} label={t('auth.rule_special', 'Special char')} />
      </ul>

      <button
        type="submit"
        className="auth-btn"
        disabled={Object.keys(errors).length || loading?.resetPassword}>
        {t('auth.reset_password_btn', 'Reset password')}
        {loading?.resetPassword && <LoaderSm size={18} clr="#fff" />}
      </button>
    </form>
  )
}
