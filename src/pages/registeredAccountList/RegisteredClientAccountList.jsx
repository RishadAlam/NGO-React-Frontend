import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import Avatar from '../../components/utilities/Avatar'
import ReactTable from '../../components/utilities/tables/ReactTable'
import useFetch from '../../hooks/useFetch'
import CheckPatch from '../../icons/CheckPatch'
import Home from '../../icons/Home'
import UserPlus from '../../icons/UserPlus'
import { RegisteredClientTableColumns } from '../../resources/staticData/tableColumns'

export default function RegisteredClientAccountList() {
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const { data: { data: clientProfiles } = [], isLoading } = useFetch({
    action: 'client/registration',
    queryParams: { latest: true }
  })

  const columns = useMemo(
    () => RegisteredClientTableColumns(t, windowWidth, avatar),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth]
  )

  return (
    <>
      <section className="staff">
        <div className="row align-items-center my-3">
          <div className="col-sm-6">
            <Breadcrumb
              breadcrumbs={[
                { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
                {
                  name: t('menu.label.registered_account_list'),
                  icon: <CheckPatch size={16} />,
                  active: false
                },
                {
                  name: `${t('menu.registration.Client_Registration')} ${t('common.list')}`,
                  icon: <UserPlus size={16} />,
                  active: true
                }
              ]}
            />
          </div>
        </div>
        <div className="staff-table">
          {isLoading && !clientProfiles ? (
            <ReactTableSkeleton />
          ) : (
            <ReactTable
              title={`${t('menu.registration.Client_Registration')} ${t('common.list')}`}
              columns={columns}
              data={clientProfiles}
              rowLinkPath="/client-register"
              rowLinkPrefix="id"
            />
          )}
        </div>
      </section>
    </>
  )
}

const avatar = (name, img) => <Avatar name={name} img={img} />
