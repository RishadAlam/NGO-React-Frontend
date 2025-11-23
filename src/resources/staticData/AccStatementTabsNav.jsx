import { Check } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import CashWithdrawal from '../../icons/CashWithdrawal'
import Dollar from '../../icons/Dollar'
import SaveEnergy from '../../icons/SaveEnergy'
import Transaction from '../../icons/Transactions'

export default function AccStatementTabsNav() {
  const { t } = useTranslation()

  return [
    {
      label: t('account_transaction.Transaction_List'),
      value: 1,
      icon: (
        <span className="me-2">
          <Dollar />
        </span>
      )
    },
    {
      label: t('menu.label.regular_collection'),
      value: 2,
      icon: (
        <span className="me-2">
          <SaveEnergy />
        </span>
      )
    },
    {
      label: t('menu.withdrawal.Saving_Withdrawal'),
      value: 3,
      icon: (
        <span className="me-2">
          <CashWithdrawal />
        </span>
      )
    },
    {
      label: t('common.transactions'),
      value: 4,
      icon: (
        <span className="me-2">
          <Transaction />
        </span>
      )
    },
    {
      label: t('common.fee_collections'),
      value: 5,
      icon: (
        <span className="me-2">
          <Dollar />
        </span>
      )
    },
    {
      label: t('common.account_check'),
      value: 6,
      icon: (
        <span className="me-2">
          <Check />
        </span>
      )
    }
  ]
}
