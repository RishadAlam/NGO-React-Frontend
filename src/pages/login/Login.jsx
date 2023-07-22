import "./login.scss"

export default function Login() {
    return (
        <>
            <div className="login">
                <form className="text-center">
                    <p className="h4 mb-4">Sign in</p>
                    <input type="email" id="defaultLoginFormEmail" className="form-control mb-4" placeholder="E-mail" />
                    <input type="password" id="defaultLoginFormPassword" className="form-control mb-4" placeholder="Password" />
                    <div className="d-flex justify-content-around">
                        <div>
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="defaultLoginFormRemember" />
                                <label className="custom-control-label" htmlFor="defaultLoginFormRemember">Remember me</label>
                            </div>
                        </div>
                        <div>
                            <a href="">Forgot password?</a>
                        </div>
                    </div>
                    <button className="btn btn-info btn-block my-4" type="submit">Sign in</button>
                </form>
            </div>
        </>
    )
}
