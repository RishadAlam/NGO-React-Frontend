import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import SavingCollectionSheet from '../../components/collection/SavingCollectionSheet'
import { isEmpty } from '../../helper/isEmpty'
import useFetch from '../../hooks/useFetch'
import BusinessOpportunity from '../../icons/BusinessOpportunity'
import Chrome from '../../icons/Chrome'
import Globe from '../../icons/Globe'
import Home from '../../icons/Home'
import SaveEnergy from '../../icons/SaveEnergy'

export default function SavingReportSheet() {
  const { category_id, field_id } = useParams()
  const { t } = useTranslation()

  const { data: { data: regularCollections = [] } = [], isLoading } = useFetch({
    action: `collection/saving/regular/collection-sheet/${category_id}/${field_id}`
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
                  name: t('menu.collection.Saving_Collection'),
                  icon: <SaveEnergy size={16} />,
                  active: true
                },
                {
                  name: t('common.category'),
                  icon: <Chrome size={16} />,
                  active: true
                },
                {
                  name: t('common.field'),
                  icon: <Globe size={16} />,
                  active: true
                }
              ]}
            />
          </div>
        </div>
        <SavingCollectionSheet
          data={regularCollections}
          loading={isLoading}
          step={isEmpty(category_id) ? 1 : 2}
        />
      </section>
    </>
  )
}
