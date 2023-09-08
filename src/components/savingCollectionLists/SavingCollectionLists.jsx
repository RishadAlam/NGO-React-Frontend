import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import { DashSavingCollectionTableColumns } from '../../resources/staticData/tableColumns.js'
import ReactTable from '../utilities/tables/ReactTable'

export default function SavingCollectionLists() {
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const columns = useMemo(() => DashSavingCollectionTableColumns(t, windowWidth), [t, windowWidth])
  const data = []

  return (
    <ReactTable title={t('dashboard.Recent_Saving_Collections')} columns={columns} data={data} />
  )
}
