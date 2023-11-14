import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLoadingState } from '../../atoms/loaderAtoms'
import OtpVerification from '../../components/otpVerification/OtpVerification'
import ResetPassword from '../../components/resetPassword/ResetPassword'

export default function AccountVerification() {
  const location = useLocation()
  const userId = location?.state?.id
  const message = location?.state?.message || null

  const [loading, setLoading] = useLoadingState({})
  const [step, setStep] = useState(1)

  return (
    <>
      {step === 1 && (
        <OtpVerification
          userId={userId}
          setStep={setStep}
          loading={loading}
          setLoading={setLoading}
          message={message}
        />
      )}
      {step === 2 && <ResetPassword userId={userId} loading={loading} setLoading={setLoading} />}
    </>
  )
}
