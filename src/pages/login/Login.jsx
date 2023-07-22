import "./login.scss"
import { Link } from "react-router-dom"

export default function Login() {
    return (
        <>
            <div className="login p-5">
                <form className="text-center">
                    <p className="h4 mb-4">Login</p>
                    <input type="email" id="defaultLoginFormEmail" className="form-control mb-4" placeholder="E-mail" />
                    <input type="password" id="defaultLoginFormPassword" className="form-control mb-4" placeholder="Password" />
                    <div className="d-flex justify-content-between">
                        <div>
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="defaultLoginFormRemember" />&nbsp;
                                <label className="custom-control-label" htmlFor="defaultLoginFormRemember">Remember me</label>
                            </div>
                        </div>
                        <div>
                            <Link to={'/forgot-password'} >Forgot password?</Link>
                        </div>
                    </div>
                    <button className="btn btn-info btn-block mt-4" type="submit">Login</button>
                </form>
            </div>
        </>
    )
}
