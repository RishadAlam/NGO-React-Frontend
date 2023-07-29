import { create } from 'mutative'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import LoaderSm from '../../loaders/Loadersm'
import '../../pages/login/login.scss'
import { postRequest } from '../../utilities/xFetch'

export default function OtpVerification({ setStep, setUserId, loading, setLoading }) {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState({
    otp: ''
  })

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

    postRequest('account-verification', requestData, null).then((result) => {
      setLoading({ ...loading, otp: false })

      if (result.success) {
        toast.success(result.message)
        setUserId(result.userId)
        setStep(2)
        return
      }
      setError(result?.errors || result)
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
          />
          {error?.otp && <div className="invalid-feedback text-start">{error?.otp}</div>}

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
