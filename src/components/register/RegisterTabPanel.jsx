import { Suspense, lazy } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from '../_helper/errorFallback/ErrorFallback'
import Loader from '../loaders/Loader'
import TabPanel from '../utilities/TabPanel'
import ClientRegisterDetails from './ClientRegisterDetails'

const ClientAccounts = lazy(() => import('./ClientAccounts'))

export default function RegisterTabPanel({ registerTabValue, data }) {
  return (
    <>
      <div className="mt-3">
        <TabPanel value={registerTabValue} index={1}>
          <ClientRegisterDetails data={data} />
        </TabPanel>
        <TabPanel value={registerTabValue} index={2}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loader />}>
              <ClientAccounts module="saving" prefix="active" />
            </Suspense>
          </ErrorBoundary>
        </TabPanel>
        <TabPanel value={registerTabValue} index={3}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loader />}>
              <ClientAccounts module="saving" prefix="pending" />
            </Suspense>
          </ErrorBoundary>
        </TabPanel>
        <TabPanel value={registerTabValue} index={4}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loader />}>
              <ClientAccounts module="saving" prefix="hold" />
            </Suspense>
          </ErrorBoundary>
        </TabPanel>
        <TabPanel value={registerTabValue} index={5}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loader />}>
              <ClientAccounts module="saving" prefix="closed" />
            </Suspense>
          </ErrorBoundary>
        </TabPanel>
        <TabPanel value={registerTabValue} index={6}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loader />}>
              <ClientAccounts module="loan" prefix="active" />
            </Suspense>
          </ErrorBoundary>
        </TabPanel>
        <TabPanel value={registerTabValue} index={7}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loader />}>
              <ClientAccounts module="loan" prefix="pending" />
            </Suspense>
          </ErrorBoundary>
        </TabPanel>
        <TabPanel value={registerTabValue} index={8}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loader />}>
              <ClientAccounts module="loan" prefix="hold" />
            </Suspense>
          </ErrorBoundary>
        </TabPanel>
        <TabPanel value={registerTabValue} index={9}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loader />}>
              <ClientAccounts module="loan" prefix="closed" />
            </Suspense>
          </ErrorBoundary>
        </TabPanel>
      </div>
    </>
  )
}
