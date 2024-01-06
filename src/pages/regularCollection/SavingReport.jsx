import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import SavingCollectionReport from '../../components/collection/SavingCollectionReport'
import { isEmpty } from '../../helper/isEmpty'
import useFetch from '../../hooks/useFetch'
import BusinessOpportunity from '../../icons/BusinessOpportunity'
import CheckPatch from '../../icons/CheckPatch'
import Chrome from '../../icons/Chrome'
import Globe from '../../icons/Globe'
import Home from '../../icons/Home'
import SaveEnergy from '../../icons/SaveEnergy'

export default function SavingReport({ isRegular = true }) {
  const { category_id } = useParams()
  const { t } = useTranslation()
  const prefix = isRegular ? 'regular' : 'pending'
  const endpoint = isEmpty(category_id)
    ? `collection/saving/${prefix}/collection-sheet`
    : `collection/saving/${prefix}/collection-sheet/${category_id}`

  const { data: { data: collections = [] } = [], isLoading } = useFetch({
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
                  name: t('menu.collection.Saving_Collection'),
                  icon: <SaveEnergy size={16} />,
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
        <SavingCollectionReport
          data={collections}
          loading={isLoading}
          hasCategoryId={!isEmpty(category_id)}
        />
      </section>
    </>
  )
}
