import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
import AccountTopMenus from '../_helper/AccountTopMenus'
import AccountSummary from './AccountSummary'
import RegisterBox from './RegisterBox'
import './RegisterBox.scss'
import RegisterTabNav from './RegisterTabNav'
import RegisterTabPanel from './RegisterTabPanel'

export default function Register() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [registerTabValue, setRegisterTabValue] = useState(1)
  const {
    data: { data = [] } = [],
    isLoading,
    mutate
  } = useFetch({ action: `client/registration/${id}` })

  return (
    <>
      <AccountTopMenus />
      <RegisterBox className="rounded-bottom-2 pb-0 shadow rounded-4">
        <AccountSummary data={data} />
        <RegisterTabNav
          registerTabValue={registerTabValue}
          setRegisterTabValue={setRegisterTabValue}
        />
      </RegisterBox>
      <RegisterTabPanel registerTabValue={registerTabValue} data={data} mutate={mutate} />
    </>
  )
}
