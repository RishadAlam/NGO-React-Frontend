import 'bootstrap/dist/css/bootstrap.css'
import 'rsuite/dist/rsuite.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import RecoilNexus from 'recoil-nexus'
import App from './App.jsx'
import AuthProvider from './components/_helper/AuthProvider.jsx'
import ErrorFallback from './components/_helper/errorFallback/ErrorFallback.jsx'
import './scss/app.scss'

const mobileRouterFuture = window.matchMedia('(max-width: 767.98px)').matches
  ? { v7_startTransition: true }
  : undefined

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <RecoilNexus />
      <BrowserRouter future={mobileRouterFuture}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <AuthProvider>
            <HelmetProvider>
              <App />
            </HelmetProvider>
          </AuthProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
)
