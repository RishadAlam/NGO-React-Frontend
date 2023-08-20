import Cookies from 'js-cookie'
import { create } from 'mutative'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthDataState, useIsAuthorizedState } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import LoaderSm from '../../components/loaders/LoaderSm'
import { setSessionStorage } from '../../helper/GetDataFromStorage'
import Eye from '../../icons/Eye'
import EyeOff from '../../icons/EyeOff'
import xFetch from '../../utilities/xFetch'
import './login.scss'

export default function Login() {
  // States & Hooks
  const navigate = useNavigate()
  const [isPlainText, SetIsPlainText] = useState(false)
  const [loading, setLoading] = useLoadingState({})
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const [authData, setAuthData] = useAuthDataState()
  const [isAutorized, setIsAuthorized] = useIsAuthorizedState()
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, SetErrors] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    document.title = 'Login'
  }, [])

  // Set the OnChange Values
  const setChange = (name, val) => {
    setInputs((prevInputs) =>
      create(prevInputs, (draftInputs) => {
        draftInputs[name] = val
      })
    )

    // Set Errors
    SetErrors((prevErrors) =>
      create(prevErrors, (draftErrors) => {
        val === '' ? (draftErrors[name] = `${name} is required!`) : delete draftErrors[name]
      })
    )
  }

  // Submit Form
  const loginUser = (event) => {
    event.preventDefault()
    if (inputs.email === '' || inputs.password === '') {
      toast.error('Required fields are empty!')
      return
    }

    setLoading({ ...loading, login: true })
    const requestData = {
      email: inputs.email,
      password: inputs.password
    }

    const controller = new AbortController()
    xFetch('login', requestData, null, controller.signal, null, 'POST').then((response) => {
      setLoading({ ...loading, login: false })

      if (response.success) {
        inputs.rememberMe
          ? Cookies.set('accessToken', response.access_token, { expires: 30 })
          : setSessionStorage('accessToken', response.access_token)

        setIsAuthorized(true)
        setAuthData((prevAuthData) =>
          create(prevAuthData, (draftAuthData) => {
            draftAuthData.accessToken = `Bearer ${response.access_token}`
            draftAuthData.id = response?.id
            draftAuthData.name = response?.name
            draftAuthData.email = response?.email
            draftAuthData.email_verified_at = response?.email_verified_at ? true : false
            draftAuthData.phone = response?.phone
            draftAuthData.status = response?.status
            draftAuthData.role = response?.role
            draftAuthData.permissions = response?.permissions
          })
        )

        toast.success(response.message)
        navigate(from, { replace: true })
        return
      }
      SetErrors(response?.errors || response)
    })
    controller.abort()
  }

  return (
    <>
      <div className="login p-5">
        <form className="text-center" onSubmit={loginUser}>
          <p className="h4 mb-4">Login</p>

          {errors?.message && errors?.message !== '' && (
            <div className="alert alert-danger" role="alert">
              <strong>{errors?.message}</strong>
            </div>
          )}

          <div className="input-group position-relative mb-4">
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${errors?.email ? 'is-invalid' : ''}`}
              placeholder="E-mail"
              value={inputs?.email || ''}
              onChange={(e) => setChange('email', e.target.value)}
              disabled={loading?.login}
            />
            {errors?.email && <div className="invalid-feedback text-start">{errors?.email}</div>}
          </div>

          <div className="input-group position-relative mb-4">
            <input
              type={isPlainText ? 'text' : 'password'}
              id="password"
              name="password"
              className={`form-control pe-4 ${errors?.password ? 'is-invalid' : ''}`}
              placeholder="Password"
              value={inputs?.password || ''}
              onChange={(e) => setChange('password', e.target.value)}
              disabled={loading?.login}
            />
            <span className="eye" onClick={() => SetIsPlainText((prev) => !prev)}>
              {isPlainText ? <Eye size={20} /> : <EyeOff size={20} />}
            </span>
            {errors.password && (
              <div className="invalid-feedback text-start">{errors.password}</div>
            )}
          </div>

          <div className="d-flex justify-content-between">
            <div>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="rememberMe"
                  name="rememberMe"
                  onChange={(e) => setChange('rememberMe', e.target.checked)}
                  disabled={loading?.login}
                />
                &nbsp;
                <label className="cursor-pointer" htmlFor="rememberMe">
                  Remember me
                </label>
              </div>
            </div>
            <div>
              <Link to={'/forgot-password'}>Forgot password?</Link>
            </div>
          </div>

          <button
            className="btn btn-primary btn-block mt-4"
            type="submit"
            disabled={Object.keys(errors).length || loading?.login}>
            <div className="d-flex">
              Login
              {loading?.login && <LoaderSm size={20} clr="#1c3faa" className="ms-2" />}
            </div>
          </button>
        </form>
      </div>
    </>
  )
}
