import { create } from 'mutative'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Eye from '../../icons/Eye'
import EyeOff from '../../icons/EyeOff'
import './login.scss'

export default function Login() {
  const [isPlainText, SetIsPlainText] = useState(false)
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, SetErrors] = useState({
    email: '',
    password: ''
  })

  const setChange = (name, val) => {
    setInputs((prevInputs) =>
      create(prevInputs, (draftInputs) => {
        draftInputs[name] = val
      })
    )

    SetErrors((prevErrors) =>
      create(prevErrors, (draftErrors) => {
        val === '' ? (draftErrors[name] = `${name} is required!`) : delete draftErrors[name]
      })
    )
  }

  return (
    <>
      <div className="login p-5">
        <form className="text-center">
          <p className="h4 mb-4">Login</p>

          <div className="input-group position-relative mb-4">
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${errors?.email ? 'is-invalid' : ''}`}
              placeholder="E-mail"
              value={inputs?.email || ''}
              onChange={(e) => setChange('email', e.target.value)}
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
                />
                &nbsp;
                <label className="custom-control-label" htmlFor="rememberMe">
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
            disabled={Object.keys(errors).length}>
            Login
          </button>
        </form>
      </div>
    </>
  )
}
