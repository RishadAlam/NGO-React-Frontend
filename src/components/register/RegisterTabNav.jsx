import { Tabs } from '@mui/material'
import Tab from '@mui/material/Tab'
import CheckPatch from '../../icons/CheckPatch'
import Clock from '../../icons/Clock'
import Dollar from '../../icons/Dollar'
import Trash from '../../icons/Trash'
import UserCheck from '../../icons/UserCheck'

export default function RegisterTabNav({ registerTabValue, setRegisterTabValue }) {
  return (
    <div className="border-top">
      <Tabs
        value={registerTabValue}
        onChange={(e, value) => setRegisterTabValue(value)}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile>
        <Tab label="&nbsp; Register Account" value={1} icon={<UserCheck />} iconPosition="start" />
        <Tab
          label="&nbsp; Running Savings Account"
          value={2}
          icon={<Dollar />}
          iconPosition="start"
        />
        <Tab
          label="&nbsp; Pending Savings Account"
          value={3}
          icon={<CheckPatch />}
          iconPosition="start"
        />
        <Tab label="&nbsp; Hold Savings Account" value={4} icon={<Clock />} iconPosition="start" />
        <Tab label="&nbsp; Closed Saving Account" value={5} icon={<Trash />} iconPosition="start" />
        <Tab label="&nbsp; Running Loan Account" value={6} icon={<Dollar />} iconPosition="start" />
        <Tab
          label="&nbsp; Pending Loan Account"
          value={7}
          icon={<CheckPatch />}
          iconPosition="start"
        />
        <Tab label="&nbsp; Hold Loan Account" value={8} icon={<Clock />} iconPosition="start" />
        <Tab label="&nbsp; Closed Loan Account" value={8} icon={<Trash />} iconPosition="start" />
      </Tabs>
    </div>
  )
}
