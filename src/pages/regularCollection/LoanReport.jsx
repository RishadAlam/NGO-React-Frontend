import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import LoanCollectionReport from '../../components/collection/LoanCollectionReport'
import { isEmpty } from '../../helper/isEmpty'
import useFetch from '../../hooks/useFetch'
import BusinessOpportunity from '../../icons/BusinessOpportunity'
import CheckPatch from '../../icons/CheckPatch'
import Chrome from '../../icons/Chrome'
import Globe from '../../icons/Globe'
import Home from '../../icons/Home'
import Loan from '../../icons/Loan'

export default function LoanReport({ isRegular = true }) {
  const { category_id } = useParams()
  const { t } = useTranslation()
  const prefix = isRegular ? 'regular' : 'pending'
  const endpoint = isEmpty(category_id)
    ? `collection/loan/${prefix}/collection-sheet`
    : `collection/loan/${prefix}/collection-sheet/${category_id}`

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
                  name: t(`menu.label.${isRegular ? 'regular' : 'pending'}_collection`),
                  icon: isRegular ? <BusinessOpportunity size={16} /> : <CheckPatch size={16} />,
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
        <LoanCollectionReport
          data={regularCollections}
          loading={isLoading}
          hasCategoryId={!isEmpty(category_id)}
        />
      </section>
    </>
  )
}
