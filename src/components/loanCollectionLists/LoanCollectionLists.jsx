import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import Avatar from '../../components/utilities/Avatar'
import { DashLoanCollectionTableColumns } from '../../resources/staticData/tableColumns.js'
import ReactTable from '../utilities/tables/ReactTable'

export default function LoanCollectionLists({ collections, isLoading }) {
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const avatar = (name, img) => <Avatar name={name} img={img} />
  const columns = useMemo(
    () => DashLoanCollectionTableColumns(t, windowWidth, avatar, descParser),
    [t, windowWidth]
  )

  return isLoading ? (
    <ReactTableSkeleton />
  ) : (
    <ReactTable
      title={t('dashboard.Recent_Loan_Collections')}
      columns={columns}
      data={collections}
    />
  )
}

const descParser = (value) => (
  <div className="view ql-editor" dangerouslySetInnerHTML={{ __html: value }}></div>
)
