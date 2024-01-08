import { useState } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
import AccountSummary from './AccountSummary'
import RegisterBox from './RegisterBox'
import './RegisterBox.scss'
import RegisterTabNav from './RegisterTabNav'
import RegisterTabPanel from './RegisterTabPanel'

export default function Register() {
  const { id } = useParams()
  const [registerTabValue, setRegisterTabValue] = useState(1)
  const { data: { data = [] } = [], isLoading } = useFetch({ action: `client/registration/${id}` })

  return (
    <>
      <RegisterBox className="rounded-bottom-2 pb-0">
        <AccountSummary data={data} />
        <RegisterTabNav
          registerTabValue={registerTabValue}
          setRegisterTabValue={setRegisterTabValue}
        />
      </RegisterBox>
      <RegisterTabPanel registerTabValue={registerTabValue} data={data} />
    </>
  )
}
