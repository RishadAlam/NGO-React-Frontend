import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLoadingState } from '../../atoms/loaderAtoms'
import AuthShell from '../../components/_helper/AuthShell'
import OtpVerification from '../../components/otpVerification/OtpVerification'
import ResetPassword from '../../components/resetPassword/ResetPassword'

export default function AccountVerification() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const userId = location?.state?.id
  const purpose = location?.state?.purpose === 'recovery' ? 'recovery' : 'verification'
  const [resetToken, setResetToken] = useState(null)
  const message = location?.state?.message || null
  const [loading, setLoading] = useLoadingState({})
  const [step, setStep] = useState(1)

  const isOtp = step === 1
  return (
    <AuthShell
      title={
        isOtp
          ? t('auth.verify_account', 'Verify your account')
          : t('auth.set_new_password', 'Set a new password')
      }
      subtitle={
        isOtp
          ? t('auth.otp_subtitle', 'We sent a 6-digit code to your email')
          : t('auth.reset_subtitle', 'Choose a strong password to secure your account')
      }
      footer={
        <span>
          <Link to="/login">{t('auth.back_to_login', 'Back to sign in')}</Link>
        </span>
      }>
      {isOtp ? (
        <OtpVerification
          userId={userId}
          purpose={purpose}
          onVerified={(response) => {
            if (purpose === 'verification') return navigate('/login', { replace: true })
            setResetToken(response.reset_token)
            setStep(2)
          }}
          loading={loading}
          setLoading={setLoading}
          message={message}
        />
      ) : (
        <ResetPassword
          userId={userId}
          resetToken={resetToken}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </AuthShell>
  )
}
