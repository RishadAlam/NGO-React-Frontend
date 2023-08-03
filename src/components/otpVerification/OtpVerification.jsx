import { create } from 'mutative'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import LoaderSm from '../../loaders/Loadersm'
import '../../pages/login/login.scss'
import xFetch from '../../utilities/xFetch'

export default function OtpVerification({ userId, setStep, loading, setLoading }) {
  // States
  const [otp, setOtp] = useState('')
  const [error, setError] = useState({
    otp: ''
  })

  // Set Onchange Value
  const setChange = (val) => {
    setOtp(val)
    setError((prevError) =>
      create(prevError, (draftErrors) => {
        draftErrors?.message ? delete draftErrors.message : ''
        val === '' ? (draftErrors.otp = 'OTP is required!') : delete draftErrors.otp
        if (val !== '') {
          val.length !== 6 ? (draftErrors.otp = 'OTP is invalid!') : delete draftErrors.otp
        }
      })
    )
  }

  // Submit Data
  const otpSubmit = (event) => {
    event.preventDefault()
    if (otp === '') {
      toast.error('Required fields are empty!')
      return
    }

    setLoading({ ...loading, otp: true })
    const requestData = {
      otp: otp
    }

    xFetch('account-verification', requestData, null, 'POST').then((response) => {
      setLoading({ ...loading, otp: false })

      if (response?.success) {
        toast.success(response.message)
        setStep(2)
        return
      }
      setError(response?.errors || response)
    })
  }

  // Resend OTP
  const resendOTP = () => {
    if (userId === '' || userId === undefined) {
      toast.error('Undefined User!')
      return
    }

    setLoading({ ...loading, resendOtp: true })
    xFetch(`otp-resend/${userId}`).then((response) => {
      setLoading({ ...loading, resendOtp: false })

      if (response?.success) {
        toast.success(response.message)
        return
      }
      setError(response?.errors || response)
    })
  }

  return (
    <>
      <div className="login p-5">
        <form className="text-center" onSubmit={otpSubmit}>
          <h2 className="mb-4">OTP Verification</h2>
          {error?.message && error?.message !== '' && (
            <div className="alert alert-danger" role="alert">
              <strong>{error?.message}</strong>
            </div>
          )}

          <input
            type="number"
            id="defaultLoginFormEmail"
            className={`form-control ${error?.otp ? ' is-invalid' : ''}`}
            placeholder="OTP"
            value={otp || ''}
            onChange={(e) => setChange(e.target.value)}
            disabled={loading?.otp}
          />
          {error?.otp && <div className="invalid-feedback text-start">{error?.otp}</div>}

          <div className="text-end mt-2">
            {loading?.resendOtp ? (
              <div className="d-inline-block">
                <LoaderSm size={30} clr="#1c3faa" className="ms-2" />
              </div>
            ) : (
              <p className="text-warning cursor-pointer" onClick={resendOTP}>
                Did not get OTP? Resend OTP{' '}
              </p>
            )}
          </div>
          <button
            className="btn btn-primary btn-block mt-4"
            type="submit"
            disabled={Object.keys(error).length || loading?.otp}>
            <div className="d-flex">
              Submit
              {loading?.otp && <LoaderSm size={20} clr="#1c3faa" className="ms-2" />}
            </div>
          </button>
        </form>
      </div>
    </>
  )
}
