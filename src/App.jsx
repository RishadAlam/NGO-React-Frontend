import { Route, Routes } from "react-router-dom"
import Login from "./pages/login/Login"
import Layout from "./components/layout/Layout"
import ForgotPassword from "./pages/forgotPassword/ForgotPassword"
import OtpVerification from "./pages/otpVerification/OtpVerification";

export default function App() {
  return (
    <>
      <Routes>
        {/**
         * UnAuthenticate Routes
         */}
        <Route path="/login" element={<Layout />}>
          <Route index element={<Login />} />
        </Route>
        <Route path="/forgot-password" element={<Layout />}>
          <Route index element={<ForgotPassword />} />
        </Route>
        <Route path="/otp-verification" element={<Layout />}>
          <Route index element={<OtpVerification />} />
        </Route>
      </Routes>
    </>
  );
}
