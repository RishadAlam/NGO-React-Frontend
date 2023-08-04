import { create } from 'mutative'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import checkPassword from '../../helper/checkPassword'
import CheckCircle from '../../icons/CheckCircle'
import Eye from '../../icons/Eye'
import EyeOff from '../../icons/EyeOff'
import XCircle from '../../icons/XCircle'
import LoaderSm from '../../loaders/Loadersm'
import '../../pages/login/login.scss'
import xFetch from '../../utilities/xFetch'

export default function ResetPassword({ userId, loading, setLoading }) {
  // States
  const navigate = useNavigate()
  const [isPlainText, SetIsPlainText] = useState({
    password: false,
    confirmPassword: false
  })
  const [inputs, setInputs] = useState({
    password: '',
    confirmPassword: ''
  })
  const [errors, SetErrors] = useState({
    password: '',
    confirmPassword: '',
    passwordLength: true,
    passwordUppercase: true,
    passwordLowercase: true,
    passwordDigits: true,
    passwordSpecial: true
  })

  // Set the OnChange Value
  const setChange = (name, val) => {
    setInputs((prevInputs) =>
      create(prevInputs, (draftInputs) => {
        draftInputs[name] = val
      })
    )

    // Set Errors
    SetErrors((prevErrors) =>
      create(prevErrors, (draftErrors) => {
        draftErrors?.message ? delete draftErrors.message : ''
        if (name === 'password') {
          val === '' ? (draftErrors.password = 'password required!') : delete draftErrors.password
          checkPassword(val, SetErrors)
        } else {
          val === ''
            ? (draftErrors.confirmPassword = 'Confirm password required!')
            : delete draftErrors.confirmPassword
          if (val !== '') {
            inputs.password !== val
              ? (draftErrors.confirmPassword = 'Confirm password does not match!')
              : delete draftErrors.confirmPassword
          }
        }
      })
    )
  }

  // Submit Form
  const submitPassword = (event) => {
    event.preventDefault()
    if (inputs.password === '' || inputs.confirmPassword === '' || userId === '') {
      toast.error('Required fields are empty!')
      return
    }

    setLoading({ ...loading, resetPassword: true })
    const requestData = {
      user_id: userId,
      new_password: inputs.password,
      confirm_password: inputs.confirmPassword
    }

    const controller = new AbortController()
    xFetch('reset-password', requestData, null, controller.signal, null, 'PUT').then((response) => {
      setLoading({ ...loading, resetPassword: false })

      if (response?.success) {
        toast.success(response.message)
        return navigate('/login')
      }
      SetErrors(response?.errors || response)
    })
    controller.abort()
  }

  return (
    <>
      <div className="login p-5">
        <form className="text-center" onSubmit={submitPassword}>
          <p className="h4 mb-4">Reset Password</p>
          {errors?.message && errors?.message !== '' && (
            <div className="alert alert-danger" role="alert">
              <strong>{errors?.message}</strong>
            </div>
          )}

          <input type="hidden" name="id" value={userId || ''} disabled />

          <div className="input-group position-relative mb-4">
            <input
              type={isPlainText.password ? 'text' : 'password'}
              className={`form-control pe-4 ${errors?.password ? 'is-invalid' : ''}`}
              name="password"
              placeholder="New Password"
              value={inputs.password || ''}
              onChange={(e) => setChange('password', e.target.value)}
              disabled={loading?.resetPassword}
            />
            <span
              className="eye"
              onClick={() => SetIsPlainText((prev) => ({ ...prev, password: !prev.password }))}>
              {isPlainText.password ? <Eye size={20} /> : <EyeOff size={20} />}
            </span>
            {errors?.password && (
              <div className="invalid-feedback text-start">{errors?.password}</div>
            )}
          </div>

          <div className="input-group position-relative mb-2">
            <input
              type={isPlainText.confirmPassword ? 'text' : 'password'}
              className={`form-control pe-4 ${errors?.confirmPassword ? 'is-invalid' : ''}`}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={inputs.confirmPassword || ''}
              onChange={(e) => setChange('confirmPassword', e.target.value)}
              disabled={loading?.resetPassword}
            />
            <span
              className="eye"
              onClick={() =>
                SetIsPlainText((prev) => ({ ...prev, confirmPassword: !prev.confirmPassword }))
              }>
              {isPlainText.confirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </span>
            {errors?.confirmPassword && (
              <div className="invalid-feedback text-start">{errors?.confirmPassword}</div>
            )}
          </div>

          <ul className="text-start">
            <li className={errors?.passwordUppercase ? 'text-danger' : 'text-success'}>
              <b>{errors?.passwordUppercase ? <XCircle /> : <CheckCircle />}</b>
              &nbsp; at least one uppercase character
            </li>
            <li className={errors?.passwordLowercase ? 'text-danger' : 'text-success'}>
              <b>{errors?.passwordLowercase ? <XCircle /> : <CheckCircle />}</b>
              &nbsp; at least one lowercase character
            </li>
            <li className={errors?.passwordDigits ? 'text-danger' : 'text-success'}>
              <b>{errors?.passwordDigits ? <XCircle /> : <CheckCircle />}</b>
              &nbsp; at least one digit/number
            </li>
            <li className={errors?.passwordSpecial ? 'text-danger' : 'text-success'}>
              <b>{errors?.passwordSpecial ? <XCircle /> : <CheckCircle />}</b>
              &nbsp; at least one special character
            </li>
            <li className={errors?.passwordLength ? 'text-danger' : 'text-success'}>
              <b>{errors?.passwordLength ? <XCircle /> : <CheckCircle />}</b>
              &nbsp; Minimum 8 Cheracters
            </li>
          </ul>

          <button
            className="btn btn-primary btn-block"
            type="submit"
            disabled={Object.keys(errors).length || loading?.resetPassword}>
            <div className="d-flex">
              Reset Password
              {loading?.resetPassword && <LoaderSm size={20} clr="#1c3faa" className="ms-2" />}
            </div>
          </button>
        </form>
      </div>
    </>
  )
}
