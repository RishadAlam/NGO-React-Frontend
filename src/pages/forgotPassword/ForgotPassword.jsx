import { create } from 'mutative'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoaderSm from '../../loaders/Loadersm'
import { postRequest } from '../../utilities/xFetch'
import '../login/login.scss'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState({})
  const [error, setError] = useState({
    email: ''
  })

  const setChange = (val) => {
    setEmail(val)
    setError((prevError) =>
      create(prevError, (draftErrors) => {
        draftErrors?.message ? delete draftErrors.message : ''
        val === '' ? (draftErrors.email = 'Email Address is required!') : delete draftErrors.email

        if (val !== '') {
          !/\S+@\S+\.\S+/.test(val)
            ? (draftErrors.email = 'Email is invalid!')
            : delete draftErrors.confirmPassword
        }
      })
    )
  }

  const emailSubmit = (event) => {
    event.preventDefault()
    setLoading({ ...loading, email: true })

    const requestData = {
      email: email
    }
    postRequest('forget-password', requestData, null, 'POST').then((result) => {
      setLoading({ ...loading, email: false })
      if (result.success) {
        return navigate('/account-verification')
      }

      setError(result?.errors)
    })
  }
  console.log(loading)

  return (
    <>
      <div className="login p-5">
        <form className="text-center" onSubmit={emailSubmit}>
          <h2 className="mb-4">Find Your Accoun & Reset Password</h2>
          {error?.message && error?.message !== '' && (
            <div className="alert alert-danger" role="alert">
              <strong>{error?.message}</strong>
            </div>
          )}
          <input
            type="email"
            id="defaultLoginFormEmail"
            className={`form-control ${error?.email ? ' is-invalid' : ''}`}
            placeholder="Email Address"
            value={email || ''}
            onChange={(e) => setChange(e.target.value)}
          />
          {error?.email && <div className="invalid-feedback text-start">{error?.email}</div>}
          <button
            className="btn btn-primary btn-block mt-4"
            type="submit"
            disabled={Object.keys(error).length || loading?.email}>
            <p className="d-flex">
              Send Passsword Reset OTP{' '}
              {loading?.email && <LoaderSm size={20} clr="#1c3faa" className="ms-2" />}
            </p>
          </button>
        </form>
      </div>
    </>
  )
}
