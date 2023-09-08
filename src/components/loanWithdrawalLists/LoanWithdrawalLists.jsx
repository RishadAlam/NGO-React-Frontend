import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import { DashWithdrawalTableColumns } from '../../resources/staticData/tableColumns.js'
import ReactTable from '../utilities/tables/ReactTable'

export default function LoanWithdrawalLists() {
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const columns = useMemo(() => DashWithdrawalTableColumns(t, windowWidth), [t, windowWidth])
  const data = []

  return <ReactTable title={t('dashboard.Recent_Loan_Withdrawals')} columns={columns} data={data} />
}
