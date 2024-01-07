import TabPanel from '../utilities/TabPanel'
import RegisterBox from './RegisterBox'

export default function RegisterTabPanel({ registerTabValue }) {
  return (
    <>
      <div className="mt-3">
        <TabPanel value={registerTabValue} index={1}>
          <RegisterBox className="rounded-top-2">Item One</RegisterBox>
        </TabPanel>
        <TabPanel value={registerTabValue} index={2}>
          <RegisterBox className="rounded-top-2">Item Two</RegisterBox>
        </TabPanel>
        <TabPanel value={registerTabValue} index={3}>
          <RegisterBox className="rounded-top-2">Item Three</RegisterBox>
        </TabPanel>
      </div>
    </>
  )
}
