import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowInnerWidthValue } from '../../atoms/windowSize.js'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import Avatar from '../../components/utilities/Avatar'
import useFetch from '../../hooks/useFetch'
import { DashWithdrawalTableColumns } from '../../resources/staticData/tableColumns.js'
import ReactTable from '../utilities/tables/ReactTable.jsx'

export default function WithdrawalLists({ title, endpoint }) {
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const avatar = (name, img) => <Avatar name={name} img={img} />
  const columns = useMemo(
    () => DashWithdrawalTableColumns(t, windowWidth, avatar, descParser),
    [t, windowWidth]
  )

  const { data: { data = [] } = [], isLoading } = useFetch({ action: endpoint })

  return isLoading ? (
    <ReactTableSkeleton />
  ) : (
    <ReactTable title={title} columns={columns} data={data} />
  )
}

const descParser = (value) => (
  <div className="view ql-editor" dangerouslySetInnerHTML={{ __html: value }}></div>
)
