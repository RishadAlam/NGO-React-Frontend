import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import LoanCollectionReport from '../../components/collection/LoanCollectionReport'
import { isEmpty } from '../../helper/isEmpty'
import useFetch from '../../hooks/useFetch'
import { dynamicBreadcrumb } from './SavingReport'

export default function LoanReport({ isRegular = true }) {
  const { category_id } = useParams()
  const { t } = useTranslation()
  const prefix = isRegular ? 'regular' : 'pending'
  const endpoint = isEmpty(category_id)
    ? `collection/loan/${prefix}/collection-sheet`
    : `collection/loan/${prefix}/collection-sheet/${category_id}`

  const { data: { data: { category_name = '', report = [] } = [] } = [], isLoading } = useFetch({
    action: endpoint
  })

  return (
    <>
      <section className="staff">
        <div className="row align-items-center my-3">
          <div className="col-sm-6">
            <Breadcrumb breadcrumbs={dynamicBreadcrumb(category_name, category_id, t, isRegular)} />
          </div>
        </div>
        <LoanCollectionReport
          data={report}
          loading={isLoading}
          hasCategoryId={!isEmpty(category_id)}
        />
      </section>
    </>
  )
}
