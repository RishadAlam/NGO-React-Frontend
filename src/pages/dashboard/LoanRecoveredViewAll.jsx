import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import Avatar from '../../components/utilities/Avatar'
import ReactTable from '../../components/utilities/tables/ReactTable'
import useFetch from '../../hooks/useFetch'
import Home from '../../icons/Home'
import LoanRecovered from '../../icons/LoanRecovered'
import { DashLoanCollectionTableColumns } from '../../resources/staticData/tableColumns'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'

export default function LoanRecoveredViewAll() {
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const avatar = (name, img) => <Avatar name={name} img={img} />
  const columns = useMemo(
    () => DashLoanCollectionTableColumns(t, windowWidth, avatar, descParser),
    [t, windowWidth]
  )

  const { data: { data: collections = [] } = {}, isLoading } = useFetch({
    action: 'dashboard/loan-recovered'
  })

  const breadcrumbs = [
    { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
    { name: t('dashboard.cards.Loan_Recovered'), icon: <LoanRecovered size={16} />, active: true }
  ]

  return (
    <section className="staff">
      <div className="row align-items-center my-3">
        <div className="col-sm-6">
          <Breadcrumb breadcrumbs={breadcrumbs} />
        </div>
      </div>
      {isLoading ? (
        <ReactTableSkeleton />
      ) : (
        <ReactTable
          title={t('dashboard.cards.Loan_Recovered')}
          columns={columns}
          data={collections}
        />
      )}
    </section>
  )
}

const descParser = (value) => (
  <div className="view ql-editor" dangerouslySetInnerHTML={{ __html: value }} />
)
