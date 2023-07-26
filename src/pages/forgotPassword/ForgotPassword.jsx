import { useState } from 'react'
import FGPassword from '../../components/forgotPassword/ForgotPassword'
import OtpVerification from '../../components/otpVerification/OtpVerification'
import ResetPassword from '../../components/resetPassword/ResetPassword'
import '../login/login.scss'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState(1)

  const nextPage = (pageNo) => {
    console.log(pageNo)
  }

  return (
    <>
      {step === 1 && <FGPassword email={email} setEmail={setEmail} setStep={setStep} />}
      {step === 2 && <OtpVerification setStep={setStep} />}
      {step === 3 && <ResetPassword email={email} setEmail={setEmail} setStep={setStep} />}
    </>
  )
}
