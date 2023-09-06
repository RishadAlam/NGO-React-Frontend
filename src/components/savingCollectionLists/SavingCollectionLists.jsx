import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DashSavingCollectionTableColumns } from '../../resources/staticData/tableColumns,js'
import ReactTable from '../utilities/tables/ReactTable'

export default function SavingCollectionLists() {
  const { t } = useTranslation()
  const columns = useMemo(() => DashSavingCollectionTableColumns(t), [t])
  const data = []

  return (
    <ReactTable title={t('dashboard.Recent_Saving_Collections')} columns={columns} data={data} />
  )
}
