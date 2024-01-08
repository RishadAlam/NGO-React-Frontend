import { Suspense, lazy } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'
import ErrorFallback from '../_helper/errorFallback/ErrorFallback'
import Loader from '../loaders/Loader'
import TabPanel from '../utilities/TabPanel'
import ClientRegisterDetails from './ClientRegisterDetails'
import RegisterBox from './RegisterBox'

const SavingAccounts = lazy(() => import('./SavingAccounts'))

export default function RegisterTabPanel({ registerTabValue, data }) {
  const { t } = useTranslation()

  return (
    <>
      <div className="mt-3">
        <TabPanel value={registerTabValue} index={1}>
          <ClientRegisterDetails data={data} />
        </TabPanel>
        <TabPanel value={registerTabValue} index={2}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loader />}>
              <SavingAccounts />
            </Suspense>
          </ErrorBoundary>
        </TabPanel>
        <TabPanel value={registerTabValue} index={3}>
          <RegisterBox className="rounded-top-2">Item Three</RegisterBox>
        </TabPanel>
      </div>
    </>
  )
}
