import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import { DashLoanCollectionTableColumns } from '../../resources/staticData/tableColumns,js'
import ReactTable from '../utilities/tables/ReactTable'

export default function LoanCollectionLists() {
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const columns = useMemo(() => DashLoanCollectionTableColumns(t, windowWidth), [t, windowWidth])
  const data = []

  return <ReactTable title={t('dashboard.Recent_Loan_Collections')} columns={columns} data={data} />
}
