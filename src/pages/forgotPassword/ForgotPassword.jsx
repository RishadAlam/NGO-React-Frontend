import { useState } from "react";
import "../login/login.scss"
import { create } from "mutative";

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState({
        "email": ''
    });

    const setChange = (val) => {
        setEmail(val)
        setError(prevError => create(prevError, (draftErrors) => {
            val === '' ? draftErrors.email = "Email Address is required!" : delete draftErrors.email
            if (val !== '') {
                !(/\S+@\S+\.\S+/.test(val)) ? draftErrors.email = "Email is invalid!" : delete draftErrors.confirmPassword
            }
        }))
    }

    return (
        <>
            <div className="login p-5">
                <form className="text-center">
                    <h2 className="mb-4">Find Your Accoun & Reset Password</h2>
                    <input type="email" id="defaultLoginFormEmail" className={`form-control ${error.email ? " is-invalid" : ""}`} placeholder="Email Address" value={email || ''} onChange={e => setChange(e.target.value)} />
                    {error.email &&
                        <div class="invalid-feedback text-start">
                            {error.email}
                        </div>
                    }
                    <button className="btn btn-primary btn-block mt-4" type="submit" disabled={Object.keys(error).length}>Send Passsword Reset OTP</button>
                </form>
            </div>
        </>
    )
}
