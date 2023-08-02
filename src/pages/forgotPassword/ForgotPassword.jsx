import { create } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useLoadingState } from '../../atoms/loaderAtoms'
import LoaderSm from '../../loaders/Loadersm'
import xFetch from '../../utilities/xFetch'
import '../login/login.scss'

export default function ForgotPassword() {
  // States
  const navigate = useNavigate()
  const [loading, setLoading] = useLoadingState({})
  const [email, setEmail] = useState('')
  const [error, setError] = useState({
    email: ''
  })

  // Set the OnChange Values
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

  // Submit Form
  const emailSubmit = (event) => {
    event.preventDefault()
    if (email === '') {
      toast.error('Required fields are empty!')
      return
    }

    setLoading({ ...loading, email: true })
    const requestData = {
      email: email
    }

    xFetch('forget-password', requestData, null, 'POST').then((response) => {
      setLoading({ ...loading, email: false })

      if (response.success) {
        toast.success(response.message)
        return navigate('/account-verification', { state: { id: response.id } })
      }
      setError(response?.errors || response)
    })
  }

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
            disabled={loading?.email}
          />
          {error?.email && <div className="invalid-feedback text-start">{error?.email}</div>}
          <button
            className="btn btn-primary btn-block mt-4"
            type="submit"
            disabled={Object.keys(error).length || loading?.email}>
            <div className="d-flex">
              Send Passsword Reset OTP{' '}
              {loading?.email && <LoaderSm size={20} clr="#1c3faa" className="ms-2" />}
            </div>
          </button>
        </form>
      </div>
    </>
  )
}
