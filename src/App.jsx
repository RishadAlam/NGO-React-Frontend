import { Route, Routes } from "react-router-dom"
import Login from './pages/login/Login'

export default function App() {
  return (
    <>
      <Routes>
        {/* UnAuthenticate Routes */}
        <Route path="/login" element={<Login />} />

      </Routes>
    </>
  )
}
