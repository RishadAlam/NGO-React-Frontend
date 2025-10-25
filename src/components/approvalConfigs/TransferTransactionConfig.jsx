import { create, rawReturn } from 'mutative'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import useFetch from '../../hooks/useFetch'
import Save from '../../icons/Save'
import xFetch from '../../utilities/xFetch'
import ReactTableSkeleton from '../loaders/skeleton/ReactTableSkeleton'
import Button from '../utilities/Button'
import TransactionConfigRow from './TransactionConfigRow'

export default function TransferTransactionConfig({
  accTransferConfigs,
  setAccTransferConfigs,
  mutate,
  isLoading
}) {
  const { t } = useTranslation()
  const [loading, setLoading] = useLoadingState({})
  const [error, setError] = useState({})
  const { accessToken } = useAuthDataValue()
  const { data: { data: accounts = [] } = [] } = useFetch({ action: 'accounts/active' })

  const setChange = (val, name, index) => {
    setAccTransferConfigs((prevConfig) =>
      create(prevConfig, (draftConfig) => {
        if (name === 'fee_store_acc_id') {
          draftConfig[index].account = val
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

  const update = (event) => {
    event.preventDefault()

    setLoading({ ...loading, transferTransaction: true })
    xFetch(
      'transfer-transaction-config-update',
      { transferConfigs: accTransferConfigs },
      null,
      accessToken,
      null,
      'PUT'
    )
      .then((response) => {
        setLoading({ ...loading, transferTransaction: false })
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
        setLoading({ ...loading, transferTransaction: false })
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
      {isLoading || !Object.keys(accTransferConfigs)?.length ? (
        <ReactTableSkeleton />
      ) : (
        <div className="card my-3 mx-auto">
          <div className="card-header">
            <b className="text-uppercase">{`${t('common.transaction')} ${t(
              'common.configuration'
            )}`}</b>
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
                    <th>#</th>
                    <th>{t('common.transaction')}</th>
                    <th>{`${t('common.approval_required')}`}</th>
                    <th>{`${t('common.transaction')} ${t('common.fee')}`}</th>
                    <th>{`${t('common.account')}`}</th>
                    <th>{`${t('common.min')} ${t('common.transaction')}`}</th>
                    <th>{`${t('common.max')} ${t('common.transaction')}`}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(accTransferConfigs)?.length > 0 &&
                    Object.keys(accTransferConfigs).map((data_key, index) => (
                      <TransactionConfigRow
                        key={index}
                        config={accTransferConfigs}
                        data_key={data_key}
                        index={index}
                        accounts={accounts}
                        setChange={setChange}
                        loading={loading?.transferTransaction}
                        error={error}
                      />
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer text-center">
            <Button
              type="button"
              name={t('common.update')}
              className={'btn-primary py-2 px-3'}
              loading={loading?.transferTransaction || false}
              endIcon={<Save size={20} />}
              onclick={(e) => update(e)}
              disabled={Object.keys(error).length || loading?.transferTransaction}
            />
          </div>
        </div>
      )}
    </>
  )
}
