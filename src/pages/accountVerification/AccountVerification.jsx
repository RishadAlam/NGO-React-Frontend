import { useState } from 'react'
import OtpVerification from '../../components/otpVerification/OtpVerification'
import ResetPassword from '../../components/resetPassword/ResetPassword'

export default function AccountVerification() {
  const [loading, setLoading] = useState({})
  const [userId, setUserId] = useState('')
  const [step, setStep] = useState(1)
  return (
    <>
      {step === 1 && (
        <OtpVerification
          setStep={setStep}
          setUserId={setUserId}
          loading={loading}
          setLoading={setLoading}
        />
      )}
      {step === 2 && <ResetPassword userId={userId} loading={loading} setLoading={setLoading} />}
    </>
  )
}
