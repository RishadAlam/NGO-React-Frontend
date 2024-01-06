import { useTranslation } from 'react-i18next'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import Register from '../../components/register/Register'
import Home from '../../icons/Home'
import User from '../../icons/User'

export default function ClientRegisterAccount() {
  const { t } = useTranslation()

  return (
    <section className="client-register">
      <div className="row align-items-center my-3">
        <div className="col-sm-12">
          <Breadcrumb
            breadcrumbs={[
              { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
              { name: t('common.client_register'), icon: <User size={16} />, active: true }
            ]}
          />
        </div>
      </div>
      <Register />
    </section>
  )
}
