import 'bootstrap/dist/css/bootstrap.css'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import RecoilNexus from 'recoil-nexus'
import App from './App.jsx'
import AuthProvider from './components/_helper/AuthProvider.jsx'
import './scss/app.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <RecoilNexus />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={'Loading...'}>
            <App />
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
)
