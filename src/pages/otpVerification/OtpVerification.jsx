import "../login/login.scss"

export default function OtpVerification() {
    return (
        <>
            <div className="login p-5">
                <form className="text-center">
                    <h2 className="mb-4">OTP Verification</h2>
                    <input type="number" id="defaultLoginFormEmail" className="form-control mb-4" placeholder="OTP" />
                    <button className="btn btn-info btn-block" type="submit">Submit</button>
                </form>
            </div>
        </>
    )
}
