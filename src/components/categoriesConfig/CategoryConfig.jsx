import { create } from 'mutative'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import useFetch from '../../hooks/useFetch'
import Save from '../../icons/Save'
import Button from '../utilities/Button'
import CategoryConfigRow from './CategoryConfigRow'

function CategoryConfig({
  allConfigurations,
  setAllConfigurations,
  error,
  setError,
  update,
  loading
}) {
  const { t } = useTranslation()
  const { data: { data: accounts = [] } = [] } = useFetch({ action: 'accounts/active' })

  const SAVING = t('common.saving')
  const LOAN = t('common.loan')
  const LOAN_SAVING = t('common.loan_saving')
  const ACCOUNT = t('common.account')
  const MIN = t('common.min')
  const MAX = t('common.max')
  const COMMON_REGISTRATION = t('common.registration')
  const COMMON_CLOSING = t('common.closing')

  const setChange = (val, name, index) => {
    setAllConfigurations((prevConfig) =>
      create(prevConfig, (draftConfig) => {
        if (
          name === 's_reg_fee_acc_id' ||
          name === 's_col_fee_acc_id' ||
          name === 'l_reg_fee_acc_id' ||
          name === 'l_col_fee_acc_id' ||
          name === 's_with_fee_acc_id' ||
          name === 'ls_with_fee_acc_id'
        ) {
          const tmpAcc = `${name.slice(0, name.indexOf('acc_id'))}account`
          draftConfig[index][tmpAcc] = val
          draftConfig[index][name] = val?.id || 0
          return
        }

        if ((val !== '' && Number(val) === 0) || val === false || val.length > 8) {
          val = 0
        }

        draftConfig[index][name] = val
      })
    )

    setError((prevErr) =>
      create(prevErr, (draftErr) => {
        if (val === '') {
          draftErr[name] = true
        } else {
          delete draftErr[name]
        }
      })
    )
  }

  const setDynamicProperty = (el) => {
    if (el) {
      el.style.setProperty('border-color', '#8884d8', 'important')
    }
  }

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
                  ref={setDynamicProperty}>
                  {t('categories_config.account_reg_closing_fees')}
                </th>
                <th
                  colSpan="2"
                  className="text-center border-start border-bottom-0"
                  ref={setDynamicProperty}>
                  {t('categories_config.withdrawal_fees')}
                </th>
                <th
                  colSpan="4"
                  className="text-center border-start border-bottom-0"
                  ref={setDynamicProperty}>
                  {t('categories_config.limitations_of_withdrawals')}
                </th>
                <th
                  colSpan="2"
                  className="text-center border-start border-bottom-0"
                  ref={setDynamicProperty}>
                  {`${t('categories_config.period_of_account_checking')} (${t('common.day')})`}
                </th>
                <th
                  colSpan="2"
                  className="text-center border-start border-bottom-0"
                  ref={setDynamicProperty}>
                  {t('categories_config.disable_unchecked_accounts')}
                </th>
                <th
                  colSpan="2"
                  className="text-center border-start border-bottom-0"
                  ref={setDynamicProperty}>
                  {`${t('categories_config.period_of_inactive_account_disable')} (${t(
                    'common.day'
                  )})`}
                </th>
              </tr>
              <tr>
                <th>#</th>
                <th>{t('staff_permissions.group_name.category')}</th>
                <th>{`${SAVING} ${COMMON_REGISTRATION}`}</th>
                <th>{`${SAVING} ${COMMON_CLOSING}`}</th>
                <th>{`${LOAN} ${COMMON_REGISTRATION}`}</th>
                <th>{`${LOAN} ${COMMON_CLOSING}`}</th>
                <th>{SAVING}</th>
                <th>{LOAN_SAVING}</th>
                <th>{`${MIN} ${SAVING}`}</th>
                <th>{`${MAX} ${SAVING}`}</th>
                <th>{`${MIN} ${LOAN_SAVING}`}</th>
                <th>{`${MAX} ${LOAN_SAVING}`}</th>
                <th>{`${SAVING} ${ACCOUNT}`}</th>
                <th>{`${LOAN} ${ACCOUNT}`}</th>
                <th>{`${SAVING} ${ACCOUNT}`}</th>
                <th>{`${LOAN} ${ACCOUNT}`}</th>
                <th>{`${SAVING} ${ACCOUNT}`}</th>
                <th>{`${LOAN} ${ACCOUNT}`}</th>
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

export default memo(CategoryConfig)
