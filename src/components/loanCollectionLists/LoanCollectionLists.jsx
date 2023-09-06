import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DashLoanCollectionTableColumns } from '../../resources/staticData/tableColumns,js'
import ReactTable from '../utilities/tables/ReactTable'

export default function LoanCollectionLists() {
  const { t } = useTranslation()
  const columns = useMemo(() => DashLoanCollectionTableColumns(t), [t])
  const data = []

  return <ReactTable title={t('dashboard.Recent_Loan_Collections')} columns={columns} data={data} />
}
