import { useMemo } from 'react'
import { DashLoanCollectionTableColumns } from '../../resources/staticData/tableColumns,js'
import ReactTable from '../utilities/tables/ReactTable'

export default function LoanCollectionLists() {
  const columns = useMemo(() => DashLoanCollectionTableColumns(), [])
  const data = []

  return <ReactTable title={'Recent Loan Collections'} columns={columns} data={data} />
}
