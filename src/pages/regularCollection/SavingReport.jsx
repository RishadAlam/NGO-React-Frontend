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
        <SavingCollectionReport
          data={report}
          loading={isLoading}
          hasCategoryId={!isEmpty(category_id)}
        />
      </section>
    </>
  )
}

export const dynamicBreadcrumb = (category_name, category_id, t, isRegular) => {
  var breadCrumbs = [
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
    }
  ]

  if (isEmpty(category_id)) {
    breadCrumbs.push({
      name: t('common.category'),
      icon: <Chrome size={16} />,
      active: true
    })
  }
  if (!isEmpty(category_name)) {
    breadCrumbs.push({
      name: category_name,
      icon: <Chrome size={16} />,
      active: true
    })
  }

  if (!isEmpty(category_id)) {
    breadCrumbs.push({
      name: t('common.field'),
      icon: <Globe size={16} />,
      active: true
    })
  }

  return breadCrumbs
}
