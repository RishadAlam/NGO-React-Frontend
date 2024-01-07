import { Tabs } from '@mui/material'
import Tab from '@mui/material/Tab'
import { useTranslation } from 'react-i18next'
import CheckPatch from '../../icons/CheckPatch'
import Clock from '../../icons/Clock'
import Dollar from '../../icons/Dollar'
import Trash from '../../icons/Trash'
import UserCheck from '../../icons/UserCheck'

export default function RegisterTabNav({ registerTabValue, setRegisterTabValue }) {
  const { t } = useTranslation()

  return (
    <div className="border-top">
      <Tabs
        value={registerTabValue}
        onChange={(e, value) => setRegisterTabValue(value)}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile>
        <Tab
          label={`${t('common.register_account')}`}
          value={1}
          icon={
            <span className="me-2">
              <UserCheck />
            </span>
          }
          iconPosition="start"
        />
        <Tab
          label={`${t('common.running')} ${t('common.saving_account')}`}
          value={2}
          icon={
            <span className="me-2">
              <Dollar />
            </span>
          }
          iconPosition="start"
        />
        <Tab
          label={`${t('common.pending')} ${t('common.saving_account')}`}
          value={3}
          icon={
            <span className="me-2">
              <CheckPatch />
            </span>
          }
          iconPosition="start"
        />
        <Tab
          label={`${t('common.hold')} ${t('common.saving_account')}`}
          value={4}
          icon={
            <span className="me-2">
              <Clock />
            </span>
          }
          iconPosition="start"
        />
        <Tab
          label={`${t('common.closed')} ${t('common.saving_account')}`}
          value={5}
          icon={
            <span className="me-2">
              <Trash />
            </span>
          }
          iconPosition="start"
        />
        <Tab
          label={`${t('common.running')} ${t('common.loan_account')}`}
          value={6}
          icon={
            <span className="me-2">
              <Dollar />
            </span>
          }
          iconPosition="start"
        />
        <Tab
          label={`${t('common.pending')} ${t('common.loan_account')}`}
          value={7}
          icon={
            <span className="me-2">
              <CheckPatch />
            </span>
          }
          iconPosition="start"
        />
        <Tab
          label={`${t('common.hold')} ${t('common.loan_account')}`}
          value={8}
          icon={
            <span className="me-2">
              <Clock />
            </span>
          }
          iconPosition="start"
        />
        <Tab
          label={`${t('common.hold')} ${t('common.loan_account')}`}
          value={8}
          icon={
            <span className="me-2">
              <Trash />
            </span>
          }
          iconPosition="start"
        />
      </Tabs>
    </div>
  )
}
