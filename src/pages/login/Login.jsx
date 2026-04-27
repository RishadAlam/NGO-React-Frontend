import Cookies from 'js-cookie'
import { create } from 'mutative'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthDataState, useIsAuthorizedState } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import AuthShell from '../../components/_helper/AuthShell'
import LoaderSm from '../../components/loaders/LoaderSm'
import { setSessionStorage } from '../../helper/GetDataFromStorage'
import Eye from '../../icons/Eye'
import EyeOff from '../../icons/EyeOff'
import xFetch from '../../utilities/xFetch'

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
)

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isPlainText, SetIsPlainText] = useState(false)
  const [loading, setLoading] = useLoadingState({})
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const [, setAuthData] = useAuthDataState()
  const [, setIsAuthorized] = useIsAuthorizedState()
  const [inputs, setInputs] = useState({ email: '', password: '', rememberMe: false })
  const [errors, SetErrors] = useState({ email: '', password: '' })

  useEffect(() => {
    document.title = 'Login'
  }, [])

  const setChange = (name, val) => {
    setInputs((prev) => create(prev, (d) => { d[name] = val }))
    SetErrors((prev) => create(prev, (d) => {
      val === '' ? (d[name] = `${name} is required!`) : delete d[name]
    }))
  }

  const loginUser = (event) => {
    event.preventDefault()
    if (inputs.email === '' || inputs.password === '') {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }
    setLoading({ ...loading, login: true })
    const requestData = { email: inputs.email, password: inputs.password }
    const controller = new AbortController()
    xFetch('login', requestData, null, controller.signal, null, 'POST')
      .then((response) => {
        setLoading({ ...loading, login: false })
        if (response.success) {
          inputs.rememberMe
            ? Cookies.set('accessToken', response.access_token, { expires: 30 })
            : setSessionStorage('accessToken', response.access_token)
          setIsAuthorized(true)
          setAuthData((prev) => create(prev, (d) => {
            d.accessToken = `Bearer ${response.access_token}`
            d.id = response?.id
            d.name = response?.name
            d.email = response?.email
            d.email_verified_at = response?.email_verified_at ? true : false
            d.phone = response?.phone
            d.status = response?.status
            d.role = response?.role
            d.permissions = response?.permissions
          }))
          toast.success(response.message)
          navigate(from, { replace: true })
          return
        }
        if (response?.otp_sended && response?.user_id) {
          toast.success(response?.errors?.message)
          return navigate('/account-verification', {
            state: { id: response.user_id, message: response?.errors?.message }
          })
        }
        SetErrors(response?.errors || response)
      })
      .catch((error) => {
        setLoading({ ...loading, login: false })
        SetErrors(error?.errors || error)
      })
    controller.abort()
  }

  return (
    <AuthShell
      title={t('auth.login_title', 'Welcome back')}
      subtitle={t('auth.login_subtitle', 'Sign in to manage your cooperative')}
      footer={
        <span>
          {t('auth.no_account', 'Need help?')}
          <Link to="/forgot-password">{t('auth.forgot_link', 'Reset password')}</Link>
        </span>
      }>
      <form onSubmit={loginUser} noValidate>
        {errors?.message && <div className="auth-alert">{errors.message}</div>}

        <div className="auth-field">
          <label htmlFor="email">{t('auth.email', 'Email')}</label>
          <div className="input-wrap">
            <span className="leading-icon"><MailIcon /></span>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              className={errors?.email ? 'has-error' : ''}
              placeholder={t('auth.email_placeholder', 'name@example.com')}
              value={inputs.email}
              onChange={(e) => setChange('email', e.target.value)}
              disabled={loading?.login}
            />
          </div>
          {errors?.email && <div className="field-error">{errors.email}</div>}
        </div>

        <div className="auth-field">
          <label htmlFor="password">{t('auth.password', 'Password')}</label>
          <div className="input-wrap">
            <span className="leading-icon"><LockIcon /></span>
            <input
              type={isPlainText ? 'text' : 'password'}
              id="password"
              name="password"
              autoComplete="current-password"
              className={errors?.password ? 'has-error' : ''}
              placeholder="••••••••"
              value={inputs.password}
              onChange={(e) => setChange('password', e.target.value)}
              disabled={loading?.login}
            />
            <span className="trailing-icon is-button" onClick={() => SetIsPlainText((p) => !p)}>
              {isPlainText ? <Eye size={18} /> : <EyeOff size={18} />}
            </span>
          </div>
          {errors?.password && <div className="field-error">{errors.password}</div>}
        </div>

        <div className="auth-row">
          <label>
            <input
              type="checkbox"
              checked={inputs.rememberMe}
              onChange={(e) => setChange('rememberMe', e.target.checked)}
              disabled={loading?.login}
            />
            {t('auth.remember_me', 'Remember me')}
          </label>
          <Link to="/forgot-password">{t('auth.forgot_password', 'Forgot password?')}</Link>
        </div>

        <button
          type="submit"
          className="auth-btn"
          disabled={Object.keys(errors).length || loading?.login}>
          {t('auth.sign_in', 'Sign in')}
          {loading?.login && <LoaderSm size={18} clr="#fff" />}
        </button>
      </form>
    </AuthShell>
  )
}
