import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import LoanCollectionReport from '../../components/collection/LoanCollectionReport'
import { isEmpty } from '../../helper/isEmpty'
import useFetch from '../../hooks/useFetch'
import BusinessOpportunity from '../../icons/BusinessOpportunity'
import Chrome from '../../icons/Chrome'
import Globe from '../../icons/Globe'
import Home from '../../icons/Home'
import Loan from '../../icons/Loan'

export default function LoanReport() {
  const { category_id } = useParams()
  const { t } = useTranslation()
  const endpoint = isEmpty(category_id)
    ? 'collection/loan/regular/collection-sheet'
    : `collection/loan/regular/collection-sheet/${category_id}`

  const { data: { data: regularCollections = [] } = [], isLoading } = useFetch({
    action: endpoint
  })

  return (
    <>
      <section className="staff">
        <div className="row align-items-center my-3">
          <div className="col-sm-6">
            <Breadcrumb
              breadcrumbs={[
                { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
                {
                  name: t('menu.label.regular_collection'),
                  icon: <BusinessOpportunity size={16} />,
                  active: false
                },
                {
                  name: t('menu.collection.Loan_Collection'),
                  icon: <Loan size={16} />,
                  active: true
                },
                isEmpty(category_id)
                  ? {
                      name: t('common.category'),
                      icon: <Chrome size={16} />,
                      active: true
                    }
                  : {
                      name: t('common.field'),
                      icon: <Globe size={16} />,
                      active: true
                    }
              ]}
            />
          </div>
        </div>
        <div className="staff-table">
          <LoanCollectionReport
            data={regularCollections}
            loading={isLoading}
            step={isEmpty(category_id) ? 1 : 2}
          />
        </div>
      </section>
    </>
  )
}
