import { useState } from 'react'
import AccountSummary from './AccountSummary'
import RegisterBox from './RegisterBox'
import './RegisterBox.scss'
import RegisterTabNav from './RegisterTabNav'
import RegisterTabPanel from './RegisterTabPanel'

export default function Register() {
  const [registerTabValue, setRegisterTabValue] = useState(1)

  return (
    <>
      <RegisterBox className="rounded-bottom-2 pb-0">
        <AccountSummary />
        <RegisterTabNav
          registerTabValue={registerTabValue}
          setRegisterTabValue={setRegisterTabValue}
        />
      </RegisterBox>
      <RegisterTabPanel registerTabValue={registerTabValue} />
    </>
  )
}
