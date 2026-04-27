import { create } from 'mutative'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import LoaderSm from '../loaders/LoaderSm'
import xFetch from '../../utilities/xFetch'

const OTP_LEN = 6
const RESEND_COOLDOWN = 30

export default function OtpVerification({ userId, setStep, loading, setLoading, message = null }) {
  const { t } = useTranslation()
  const [digits, setDigits] = useState(() => Array(OTP_LEN).fill(''))
  const [error, setError] = useState({ otp: '', message })
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN)
  const inputRefs = useRef([])

  useEffect(() => {
    if (cooldown <= 0) return
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [cooldown])

  const otp = digits.join('')

  const setDigit = (idx, val) => {
    const clean = val.replace(/\D/g, '').slice(0, 1)
    setDigits((prev) => create(prev, (d) => { d[idx] = clean }))
    setError((prev) => create(prev, (d) => {
      delete d?.message
      const joined = [...digits.slice(0, idx), clean, ...digits.slice(idx + 1)].join('')
      joined.length === OTP_LEN ? delete d.otp : (d.otp = '')
    }))
    if (clean && idx < OTP_LEN - 1) inputRefs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && idx > 0) inputRefs.current[idx - 1]?.focus()
    if (e.key === 'ArrowRight' && idx < OTP_LEN - 1) inputRefs.current[idx + 1]?.focus()
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LEN)
    if (!pasted) return
    e.preventDefault()
    const arr = Array(OTP_LEN).fill('')
    pasted.split('').forEach((c, i) => { arr[i] = c })
    setDigits(arr)
    inputRefs.current[Math.min(pasted.length, OTP_LEN - 1)]?.focus()
  }

  const otpSubmit = (event) => {
    event.preventDefault()
    if (otp.length !== OTP_LEN) {
      toast.error(t('common_validation.required_fields_are_empty'))
      return
    }
    setLoading({ ...loading, otp: true })
    const controller = new AbortController()
    xFetch('account-verification', { otp }, null, controller.signal, null, 'POST').then((response) => {
      setLoading({ ...loading, otp: false })
      if (response?.success) {
        toast.success(response.message)
        setStep(2)
        return
      }
      setError(response?.errors || response)
    })
    controller.abort()
  }

  const resendOTP = () => {
    if (!userId) {
      toast.error('Undefined User!')
      return
    }
    setLoading({ ...loading, resendOtp: true })
    xFetch(`otp-resend/${userId}`).then((response) => {
      setLoading({ ...loading, resendOtp: false })
      if (response?.success) {
        toast.success(response.message)
        setCooldown(RESEND_COOLDOWN)
        return
      }
      setError(response?.errors || response)
    })
  }

  return (
    <form onSubmit={otpSubmit} noValidate>
      {error?.message && <div className="auth-alert">{error.message}</div>}

      <div className="auth-field">
        <label>{t('auth.otp_label', 'Enter 6-digit code')}</label>
        <div className="otp-boxes" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={error?.otp ? 'has-error' : ''}
              disabled={loading?.otp}
              autoFocus={i === 0}
            />
          ))}
        </div>
        {error?.otp && <div className="field-error">{error.otp}</div>}
      </div>

      <div className="otp-resend">
        {loading?.resendOtp ? (
          <LoaderSm size={20} clr="var(--primary-color)" />
        ) : cooldown > 0 ? (
          <>
            {t('auth.otp_resend_in', 'Resend code in')} <strong>{cooldown}s</strong>
          </>
        ) : (
          <>
            {t('auth.otp_didnt_get', "Didn't get the code?")}
            <button type="button" onClick={resendOTP}>
              {t('auth.resend_otp', 'Resend OTP')}
            </button>
          </>
        )}
      </div>

      <button
        type="submit"
        className="auth-btn"
        disabled={otp.length !== OTP_LEN || loading?.otp}>
        {t('auth.verify', 'Verify')}
        {loading?.otp && <LoaderSm size={18} clr="#fff" />}
      </button>
    </form>
  )
}
