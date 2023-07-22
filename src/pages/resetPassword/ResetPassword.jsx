import "../login/login.scss"

export default function ResetPassword() {
    return (
        <>
            <div className="login p-5">
                <form className="text-center">
                    <p className="h4 mb-4">Reset Password</p>
                    <input type="email" id="defaultLoginFormEmail" className="form-control mb-4" placeholder="E-mail" disabled />
                    <input type="password" id="defaultLoginFormPassword" className="form-control mb-4" placeholder="New Password" />
                    <input type="password" id="defaultLoginFormPassword" className="form-control mb-4" placeholder="Confirm Password" />
                    <button className="btn btn-info btn-block" type="submit">Reset Password</button>
                </form>
            </div>
        </>
    )
}
