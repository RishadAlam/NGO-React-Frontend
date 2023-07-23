import { create } from "mutative";
import { useState } from "react";
import CheckCircle from "../../icons/CheckCircle";
import Eye from "../../icons/Eye";
import EyeOff from "../../icons/EyeOff";
import XCircle from "../../icons/XCircle";
import "../../pages/login/login.scss";

export default function ResetPassword({ email, setStep }) {
    const [isPlainText, SetIsPlainText] = useState({
        "password": false,
        "confirmPassword": false
    })
    const [inputs, setInputs] = useState({
        "password": "",
        "confirmPassword": ""
    })
    const [errors, SetErrors] = useState({
        "password": "",
        "confirmPassword": "",
        "passwordLength": true,
        "passwordUppercase": true,
        "passwordLowercase": true,
        "passwordDigits": true,
        "passwordSpecial": true,
    })

    const checkPassword = password => {
        const uppercaseRegExp = /(?=.*?[A-Z])/;
        const lowercaseRegExp = /(?=.*?[a-z])/;
        const digitsRegExp = /(?=.*?[0-9])/;
        const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;

        SetErrors(prevErrors => create(prevErrors, (draftErrors) => {
            password.length < 8 ? draftErrors.passwordLength = true : delete draftErrors.passwordLength
            !uppercaseRegExp.test(password) ? draftErrors.passwordUppercase = true : delete draftErrors.passwordUppercase
            !lowercaseRegExp.test(password) ? draftErrors.passwordLowercase = true : delete draftErrors.passwordLowercase
            !digitsRegExp.test(password) ? draftErrors.passwordDigits = true : delete draftErrors.passwordDigits
            !specialCharRegExp.test(password) ? draftErrors.passwordSpecial = true : delete draftErrors.passwordSpecial
        }))

    }

    const setChange = (name, val) => {
        setInputs(prevInputs => create(prevInputs, (draftInputs) => {
            draftInputs[name] = val
        }))

        SetErrors(prevErrors => create(prevErrors, (draftErrors) => {
            if (name === 'password') {
                val === '' ? draftErrors.password = "password required!" : delete draftErrors.password
                checkPassword(val)
            } else {
                val === '' ? draftErrors.confirmPassword = "Confirm password required!" : delete draftErrors.confirmPassword
                if (val !== '') {
                    inputs.password !== val ? draftErrors.confirmPassword = "Confirm password does not match!" : delete draftErrors.confirmPassword
                }
            }
        }))
    }

    return (
        <>
            <div className="login p-5">
                <form className="text-center">
                    <p className="h4 mb-4">Reset Password</p>

                    <input type="email" id="defaultLoginFormEmail" className="form-control mb-4" name="email" placeholder="E-mail" value={email || ''} disabled />

                    <div className="input-group position-relative mb-4">
                        <input type={isPlainText.password ? "text" : "password"} className={`form-control pe-4 ${errors?.password ? "is-invalid" : ""}`} name="password" placeholder="New Password" value={inputs.password || ''} onChange={e => setChange('password', e.target.value)} />
                        <span className="eye" onClick={() => SetIsPlainText(prev => ({ ...prev, password: !prev.password }))}>
                            {isPlainText.password ? <Eye size={20} /> : <EyeOff size={20} />}
                        </span>
                        {errors?.password &&
                            <div className="invalid-feedback text-start">
                                {errors?.password}
                            </div>
                        }
                    </div>

                    <div className="input-group position-relative mb-2">
                        <input type={isPlainText.confirmPassword ? "text" : "password"} className={`form-control pe-4 ${errors?.confirmPassword ? "is-invalid" : ""}`} name="confirmPassword" placeholder="Confirm Password" value={inputs.confirmPassword || ''} onChange={e => setChange('confirmPassword', e.target.value)} />
                        <span className="eye" onClick={() => SetIsPlainText(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}>
                            {isPlainText.confirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </span>
                        {errors?.confirmPassword &&
                            <div className="invalid-feedback text-start">
                                {errors?.confirmPassword}
                            </div>
                        }
                    </div>

                    <ul className="text-start">
                        <li className={errors?.passwordUppercase ? "text-danger" : "text-success"}><b>{errors?.passwordUppercase ? <XCircle /> : <CheckCircle />} </b> at least one uppercase character</li>
                        <li className={errors?.passwordLowercase ? "text-danger" : "text-success"}><b>{errors?.passwordLowercase ? <XCircle /> : <CheckCircle />} </b> at least one lowercase character</li>
                        <li className={errors?.passwordDigits ? "text-danger" : "text-success"}><b>{errors?.passwordDigits ? <XCircle /> : <CheckCircle />} </b> at least one digit/number</li>
                        <li className={errors?.passwordSpecial ? "text-danger" : "text-success"}><b>{errors?.passwordSpecial ? <XCircle /> : <CheckCircle />} </b> at least one special character</li>
                        <li className={errors?.passwordLength ? "text-danger" : "text-success"}><b>{errors?.passwordLength ? <XCircle /> : <CheckCircle />} </b> Minimum 8 Cheracters</li>
                    </ul>

                    <button className="btn btn-primary btn-block" type="submit" disabled={Object.keys(errors).length}>Reset Password</button>
                </form >
            </div >
        </>
    )
}
