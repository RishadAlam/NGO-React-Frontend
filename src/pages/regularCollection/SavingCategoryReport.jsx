import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import SavingCategoryCollection from '../../components/collection/SavingCategoryCollection'
import useFetch from '../../hooks/useFetch'
import BusinessOpportunity from '../../icons/BusinessOpportunity'
import Home from '../../icons/Home'
import SaveEnergy from '../../icons/SaveEnergy'

export default function SavingCategoryReport() {
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const { t } = useTranslation()

  const { data: { data: regularCollections = [] } = [], isLoading } = useFetch({
    action: 'collection/saving/regular/collection-sheet'
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
                }
              ]}
            />
          </div>
        </div>
        <div className="staff-table">
          <SavingCategoryCollection data={regularCollections} loading={false} />
        </div>
      </section>
    </>
  )
}
