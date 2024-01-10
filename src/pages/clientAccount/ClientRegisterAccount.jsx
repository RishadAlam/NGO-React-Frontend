import { useTranslation } from 'react-i18next'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import Register from '../../components/register/Register'
import SavingAccount from '../../components/savingAccount/SavingAccount'
import Dollar from '../../icons/Dollar'
import Home from '../../icons/Home'
import User from '../../icons/User'

export default function ClientRegisterAccount({ module = 'register' }) {
  const { t } = useTranslation()

  return (
    <section className="client-account">
      <div className="row align-items-center my-3">
        <div className="col-sm-12">
          <Breadcrumb
            breadcrumbs={[
              { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
              {
                name: t(
                  `common.${
                    module === 'register'
                      ? 'client_register'
                      : module === 'saving'
                      ? 'saving_account'
                      : 'loan_account'
                  }`
                ),
                icon: module === 'register' ? <User size={16} /> : <Dollar size={16} />,
                active: true
              }
            ]}
          />
        </div>
      </div>
      {module === 'register' ? (
        <Register />
      ) : module === 'saving' ? (
        <SavingAccount />
      ) : (
        'loan_account'
      )}
    </section>
  )
}
