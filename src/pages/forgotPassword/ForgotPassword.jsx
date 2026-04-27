import { create } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useLoadingState } from '../../atoms/loaderAtoms'
import AuthShell from '../../components/_helper/AuthShell'
import LoaderSm from '../../components/loaders/LoaderSm'
import xFetch from '../../utilities/xFetch'

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)

export default function ForgotPassword() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useLoadingState({})
  const [email, setEmail] = useState('')
  const [error, setError] = useState({ email: '' })

  const setChange = (val) => {
    setEmail(val)
    setError((prev) => create(prev, (d) => {
      d?.message && delete d.message
      val === '' ? (d.email = 'Email Address is required!') : delete d.email
      if (val !== '' && !/\S+@\S+\.\S+/.test(val)) d.email = 'Email is invalid!'
    }))
  }

  const emailSubmit = (event) => {
    event.preventDefault()
    if (email === '') {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }
    setLoading({ ...loading, email: true })
    const controller = new AbortController()
    xFetch('forget-password', { email }, null, controller.signal, null, 'POST').then((response) => {
      setLoading({ ...loading, email: false })
      if (response?.success) {
        toast.success(response.message)
        return navigate('/account-verification', { state: { id: response.id } })
      }
      setError(response?.errors || response)
    })
    controller.abort()
  }

  return (
    <AuthShell
      title={t('auth.forgot_title', 'Forgot password?')}
      subtitle={t('auth.forgot_subtitle', 'Enter your email — we will send a reset OTP')}
      footer={
        <span>
          {t('auth.remember_creds', 'Remembered it?')}
          <Link to="/login">{t('auth.back_to_login', 'Back to sign in')}</Link>
        </span>
      }>
      <form onSubmit={emailSubmit} noValidate>
        {error?.message && <div className="auth-alert">{error.message}</div>}

        <div className="auth-field">
          <label htmlFor="email">{t('auth.email', 'Email')}</label>
          <div className="input-wrap">
            <span className="leading-icon"><MailIcon /></span>
            <input
              type="email"
              id="email"
              autoComplete="email"
              className={error?.email ? 'has-error' : ''}
              placeholder={t('auth.email_placeholder', 'name@example.com')}
              value={email}
              onChange={(e) => setChange(e.target.value)}
              disabled={loading?.email}
            />
          </div>
          {error?.email && <div className="field-error">{error.email}</div>}
        </div>

        <button
          type="submit"
          className="auth-btn"
          disabled={Object.keys(error).length || loading?.email}>
          {t('auth.send_otp', 'Send Reset OTP')}
          {loading?.email && <LoaderSm size={18} clr="#fff" />}
        </button>
      </form>
    </AuthShell>
  )
}
