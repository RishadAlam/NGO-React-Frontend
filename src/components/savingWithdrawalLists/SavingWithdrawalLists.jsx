import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DashWithdrawalTableColumns } from '../../resources/staticData/tableColumns,js'
import ReactTable from '../utilities/tables/ReactTable'

export default function SavingWithdrawalLists() {
  const { t } = useTranslation()
  const columns = useMemo(() => DashWithdrawalTableColumns(t), [t])
  const data = []

  return (
    <ReactTable title={t('dashboard.Recent_Saving_Withdrawals')} columns={columns} data={data} />
  )
}
