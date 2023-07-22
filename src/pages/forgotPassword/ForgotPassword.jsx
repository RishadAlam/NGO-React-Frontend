import "../login/login.scss"

export default function ForgotPassword() {
    return (
        <>
            <div className="login p-5">
                <form className="text-center">
                    <h2 className="mb-4">Find Your Accoun & Reset Password</h2>
                    <input type="email" id="defaultLoginFormEmail" className="form-control mb-4" placeholder="Email Address" />
                    <button className="btn btn-info btn-block" type="submit">Send Passsword Reset OTP</button>
                </form>
            </div>
        </>
    )
}
