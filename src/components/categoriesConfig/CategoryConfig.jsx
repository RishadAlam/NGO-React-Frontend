import { useTranslation } from 'react-i18next'
import useFetch from '../../hooks/useFetch'
import Save from '../../icons/Save'
import Button from '../utilities/Button'
import CategoryConfigRow from './CategoryConfigRow'

export default function CategoryConfig({ allConfigurations, error, setChange, update, loading }) {
  const { t } = useTranslation()
  const { data: { data: accounts = [] } = [] } = useFetch({ action: 'accounts/active' })

  return (
    <div className="card my-3 mx-auto">
      <div className="card-header">
        <b className="text-uppercase">{t('menu.settings_and_privacy.categories_config')}</b>
      </div>
      <div className="card-body py-0 px-2">
        {error?.message && error?.message !== '' && (
          <div className="alert alert-danger" role="alert">
            <strong>{error?.message}</strong>
          </div>
        )}
        <div className="table-responsive">
          <table className="table table-hover table-report mb-0 config-table">
            <thead>
              <tr>
                <th colSpan="2" className="text-center border-bottom-0"></th>
                <th
                  colSpan="4"
                  className="text-center border-start border-bottom-0"
                  ref={(el) => {
                    if (el) {
                      el.style.setProperty('border-color', '#8884d8', 'important')
                    }
                  }}>
                  {t('categories_config.account_reg_closing_fees')}
                </th>
                <th
                  colSpan="2"
                  className="text-center border-start border-bottom-0"
                  ref={(el) => {
                    if (el) {
                      el.style.setProperty('border-color', '#8884d8', 'important')
                    }
                  }}>
                  {t('categories_config.withdrawal_fees')}
                </th>
                <th
                  colSpan="4"
                  className="text-center border-start border-bottom-0"
                  ref={(el) => {
                    if (el) {
                      el.style.setProperty('border-color', '#8884d8', 'important')
                    }
                  }}>
                  {t('categories_config.limitations_of_withdrawals')}
                </th>
                <th
                  colSpan="2"
                  className="text-center border-start border-bottom-0"
                  ref={(el) => {
                    if (el) {
                      el.style.setProperty('border-color', '#8884d8', 'important')
                    }
                  }}>
                  {`${t('categories_config.period_of_account_checking')} (${t('common.day')})`}
                </th>
                <th
                  colSpan="2"
                  className="text-center border-start border-bottom-0"
                  ref={(el) => {
                    if (el) {
                      el.style.setProperty('border-color', '#8884d8', 'important')
                    }
                  }}>
                  {t('categories_config.disable_unchecked_accounts')}
                </th>
                <th
                  colSpan="2"
                  className="text-center border-start border-bottom-0"
                  ref={(el) => {
                    if (el) {
                      el.style.setProperty('border-color', '#8884d8', 'important')
                    }
                  }}>
                  {`${t('categories_config.period_of_inactive_account_disable')} (${t(
                    'common.day'
                  )})`}
                </th>
              </tr>
              <tr>
                <th>#</th>
                <th>{t('staff_permissions.group_name.category')}</th>
                <th>{`${t('common.saving')} ${t('common.registration')}`}</th>
                <th>{`${t('common.saving')} ${t('common.closing')}`}</th>
                <th>{`${t('common.loan')} ${t('common.registration')}`}</th>
                <th>{`${t('common.loan')} ${t('common.closing')}`}</th>
                <th>{t('common.saving')}</th>
                <th>{t('common.loan_saving')}</th>
                <th>{`${t('common.min')} ${t('common.saving')}`}</th>
                <th>{`${t('common.max')} ${t('common.saving')}`}</th>
                <th>{`${t('common.min')} ${t('common.loan_saving')}`}</th>
                <th>{`${t('common.max')} ${t('common.loan_saving')}`}</th>
                <th>{`${t('common.saving')} ${t('common.account')}`}</th>
                <th>{`${t('common.loan')} ${t('common.account')}`}</th>
                <th>{`${t('common.saving')} ${t('common.account')}`}</th>
                <th>{`${t('common.loan')} ${t('common.account')}`}</th>
                <th>{`${t('common.saving')} ${t('common.account')}`}</th>
                <th>{`${t('common.loan')} ${t('common.account')}`}</th>
              </tr>
            </thead>
            <tbody>
              {allConfigurations.length > 0 ? (
                allConfigurations.map((config, index) => (
                  <CategoryConfigRow
                    key={config.id}
                    config={config}
                    index={index}
                    accounts={accounts}
                    setChange={setChange}
                    loading={loading}
                    error={error}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="18" className="text-center">
                    No records Found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card-footer text-center">
        <Button
          type="button"
          name={t('common.update')}
          className={'btn-primary py-2 px-3'}
          loading={loading || false}
          endIcon={<Save size={20} />}
          onclick={(e) => update(e)}
          disabled={Object.keys(error).length || loading}
        />
      </div>
    </div>
  )
}
