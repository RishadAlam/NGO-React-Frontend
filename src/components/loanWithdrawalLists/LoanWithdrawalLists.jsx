import { useMemo } from 'react'
import { DashWithdrawalTableColumns } from '../../resources/staticData/tableColumns,js'
import ReactTable from '../utilities/tables/ReactTable'

export default function LoanWithdrawalLists() {
  const columns = useMemo(() => DashWithdrawalTableColumns(), [])
  const data = []

  return <ReactTable title={'Recent Loan Withdrawals'} columns={columns} data={data} />
}
