import { useMemo } from 'react'
import { DashSavingCollectionTableColumns } from '../../resources/staticData/tableColumns,js'
import ReactTable from '../utilities/tables/ReactTable'

export default function SavingCollectionLists() {
  const columns = useMemo(() => DashSavingCollectionTableColumns(), [])
  const data = []

  return <ReactTable title={'Recent Saving Collections'} columns={columns} data={data} />
}
