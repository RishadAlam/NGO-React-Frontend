import { useState } from 'react'
import OtpVerification from '../../components/otpVerification/OtpVerification'
import ResetPassword from '../../components/resetPassword/ResetPassword'

export default function AccountVerification() {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState(1)
  return (
    <>
      {step === 1 && <OtpVerification setStep={setStep} />}
      {step === 2 && <ResetPassword email={email} setEmail={setEmail} setStep={setStep} />}
    </>
  )
}
