import { useMemo } from 'react'
import { DashWithdrawalTableColumns } from '../../resources/staticData/tableColumns,js'
import ReactTable from '../utilities/tables/ReactTable'

export default function SavingWithdrawalLists() {
  const columns = useMemo(() => DashWithdrawalTableColumns(), [])
  const data = []

  return <ReactTable title={'Recent Saving Withdrawals'} columns={columns} data={data} />
}
