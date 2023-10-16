import { create, rawReturn } from 'mutative'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import Button from '../../components/utilities/Button'
import useFetch from '../../hooks/useFetch'
import Home from '../../icons/Home'
import Save from '../../icons/Save'
import Settings from '../../icons/Settings'
import Tool from '../../icons/Tool'
import xFetch from '../../utilities/xFetch'

export default function CategoriesConfig() {
  const { t } = useTranslation()
  const [loading, setLoading] = useLoadingState({})
  const [allConfigurations, setAllConfigurations] = useState([])
  const [error, setError] = useState({})
  const { accessToken } = useAuthDataValue()
  const {
    data: categories = [],
    mutate,
    isLoading,
    isError
  } = useFetch({ action: 'categories-config' })

  useEffect(() => {
    categories.length && setAllConfigurations(categories)
  }, [categories])

  const setChange = (id, isChecked) => {
    setAllConfigurations((prevApprovals) =>
      create(prevApprovals, (draftApprovals) => {
        draftApprovals.find((approval) => {
          if (approval.id === id) {
            approval.meta_value = isChecked
          }
        })
      })
    )
    setError({})
  }

  const updatePermissions = (event) => {
    event.preventDefault()

    setLoading({ ...loading, CategoriesConfig: true })
    xFetch(
      'categories-config-update',
      { categories: allConfigurations },
      null,
      accessToken,
      null,
      'PUT'
    )
      .then((response) => {
        setLoading({ ...loading, CategoriesConfig: false })
        if (response?.success) {
          toast.success(response.message)
          mutate()
          return
        }
        setError((prevErr) =>
          create(prevErr, (draftErr) => {
            if (!response?.errors) {
              draftErr.message = response?.message
              return
            }
            return rawReturn(response?.errors || response)
          })
        )
      })
      .catch((errorResponse) => {
        setLoading({ ...loading, CategoriesConfig: false })
        setError((prevErr) =>
          create(prevErr, (draftErr) => {
            if (!errorResponse?.errors) {
              draftErr.message = errorResponse?.message
              return
            }
            return rawReturn(errorResponse?.errors || errorResponse)
          })
        )
      })
  }

  return (
    <>
      <section className="staff-permissions">
        <Breadcrumb
          breadcrumbs={[
            { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
            {
              name: t('menu.label.settings_and_privacy'),
              icon: <Settings size={16} />,
              active: false
            },
            {
              name: t('menu.settings_and_privacy.categories_config'),
              icon: <Tool size={16} />,
              active: true
            }
          ]}
        />

        {isLoading ? (
          <ReactTableSkeleton />
        ) : (
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
                <table className="table table-hover table-report mb-0">
                  <thead>
                    <tr>
                      <th colSpan="2" className="text-center border-bottom-0"></th>
                      <th colSpan="4" className="text-center border-start border-bottom-0">
                        {t('categories_config.account_reg_closing_fees')}
                      </th>
                      <th colSpan="2" className="text-center border-start border-bottom-0">
                        {t('categories_config.withdrawal_fees')}
                      </th>
                      <th colSpan="4" className="text-center border-start border-bottom-0">
                        {t('categories_config.limitations_of_withdrawals')}
                      </th>
                      <th colSpan="2" className="text-center border-start border-bottom-0">
                        {t('categories_config.period_of_account_checking')}
                      </th>
                      <th colSpan="2" className="text-center border-start border-bottom-0">
                        {t('categories_config.disable_unchecked_accounts')}
                      </th>
                      <th colSpan="2" className="text-center border-start border-bottom-0">
                        {t('categories_config.period_of_inactive_account_disable')}
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
                        <tr key={config.id}>
                          <td>{++index}</td>
                          <td>{config?.category?.name}</td>
                          <td>{config?.saving_acc_reg_fee}</td>
                          <td>{config?.saving_acc_closing_fee}</td>
                          <td>{config?.loan_acc_reg_fee}</td>
                          <td>{config?.loan_acc_closing_fee}</td>
                          <td>{config?.saving_withdrawal_fee}</td>
                          <td>{config?.loan_saving_withdrawal_fee}</td>
                          <td>{config?.min_saving_withdrawal}</td>
                          <td>{config?.max_saving_withdrawal}</td>
                          <td>{config?.min_loan_saving_withdrawal}</td>
                          <td>{config?.max_loan_saving_withdrawal}</td>
                          <td>{config?.saving_acc_check_time_period}</td>
                          <td>{config?.loan_acc_check_time_period}</td>
                          <td>{config?.disable_unchecked_saving_acc}</td>
                          <td>{config?.disable_unchecked_loan_acc}</td>
                          <td>{config?.inactive_saving_acc_disable_time_period}</td>
                          <td>{config?.inactive_loan_acc_disable_time_period}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>No records Found!</td>
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
                loading={loading?.CategoriesConfig || false}
                endIcon={<Save size={20} />}
                onclick={(e) => updatePermissions(e)}
                disabled={Object.keys(error).length || loading?.CategoriesConfig}
              />
            </div>
          </div>
        )}
      </section>
    </>
  )
}
