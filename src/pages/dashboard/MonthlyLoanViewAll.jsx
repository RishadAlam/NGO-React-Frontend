import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import Avatar from '../../components/utilities/Avatar'
import ReactTable from '../../components/utilities/tables/ReactTable'
import useFetch from '../../hooks/useFetch'
import Home from '../../icons/Home'
import PersonalLoan from '../../icons/PersonalLoan'
import { DashLoanCollectionTableColumns } from '../../resources/staticData/tableColumns'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'

export default function MonthlyLoanViewAll() {
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const avatar = (name, img) => <Avatar name={name} img={img} />
  const columns = useMemo(
    () => DashLoanCollectionTableColumns(t, windowWidth, avatar, descParser),
    [t, windowWidth]
  )

  const { data: { data: collections = [] } = {}, isLoading } = useFetch({
    action: 'dashboard/monthly-loan'
  })

  const breadcrumbs = [
    { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
    { name: t('dashboard.cards.Monthly_Loan_Collections'), icon: <PersonalLoan size={16} />, active: true }
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
          title={t('dashboard.cards.Monthly_Loan_Collections')}
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
