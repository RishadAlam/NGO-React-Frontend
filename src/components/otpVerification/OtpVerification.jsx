import { create } from "mutative";
import { useState } from "react";
import "../../pages/login/login.scss";

export default function OtpVerification({ setStep }) {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState({
        "otp": ''
    });

    const setChange = (val) => {
        setOtp(val)
        setError(prevError => create(prevError, (draftErrors) => {
            val === '' ? draftErrors.otp = "OTP is required!" : delete draftErrors.otp
            if (val !== '') {
                val.length < 6 ? draftErrors.otp = "OTP is invalid!" : delete draftErrors.otp
            }
        }))
    }

    const otpSubmit = event => {
        event.preventDefault()
        console.log(otp)
        setStep(3)
    }

    return (
        <>
            <div className="login p-5">
                <form className="text-center" onSubmit={otpSubmit}>
                    <h2 className="mb-4">OTP Verification</h2>
                    <input type="number" id="defaultLoginFormEmail" className={`form-control ${error?.otp ? " is-invalid" : ""}`} placeholder="OTP" value={otp || ''} onChange={e => setChange(e.target.value)} />
                    {error?.otp &&
                        <div className="invalid-feedback text-start">
                            {error?.otp}
                        </div>
                    }
                    <button className="btn btn-primary btn-block mt-4" type="submit" disabled={Object.keys(error).length}>Submit</button>
                </form>
            </div>
        </>
    )
}
