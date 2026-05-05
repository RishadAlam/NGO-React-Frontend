import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import Avatar from '../../components/utilities/Avatar'
import ReactTable from '../../components/utilities/tables/ReactTable'
import useFetch from '../../hooks/useFetch'
import Home from '../../icons/Home'
import LoanGiven from '../../icons/LoanGiven'
import { RegisteredLoanTableColumns } from '../../resources/staticData/tableColumns'

export default function LoanGivenViewAll() {
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const columns = useMemo(
    () => RegisteredLoanTableColumns(t, windowWidth, avatar),
    [t, windowWidth]
  )

  const { data: { data: loans = [] } = {}, isLoading } = useFetch({
    action: 'dashboard/loan-given'
  })

  const breadcrumbs = [
    { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
    { name: t('dashboard.cards.Loan_Given'), icon: <LoanGiven size={16} />, active: true }
  ]

  return (
    <section className="staff">
      <div className="row align-items-center my-3">
        <div className="col-sm-6">
          <Breadcrumb breadcrumbs={breadcrumbs} />
        </div>
      </div>
      <div className="staff-table">
        {isLoading ? (
          <ReactTableSkeleton />
        ) : (
          <ReactTable
            title={t('dashboard.cards.Loan_Given')}
            columns={columns}
            data={loans}
            rowLinkPath="/loan-account"
            rowLinkPrefix="id"
          />
        )}
      </div>
    </section>
  )
}

const avatar = (name, img) => <Avatar name={name} img={img} />
