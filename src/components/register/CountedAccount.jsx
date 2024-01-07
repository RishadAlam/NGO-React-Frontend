import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
import CheckPatch from '../../icons/CheckPatch'
import Clock from '../../icons/Clock'
import Dollar from '../../icons/Dollar'
import Trash from '../../icons/Trash'
import tsNumbers from '../../libs/tsNumbers'

export default function CountedAccount() {
  const { id } = useParams()
  const { t } = useTranslation()

  const {
    data: {
      data: {
        activeSavings,
        pendingSavings,
        holdSavings,
        closedSavings,
        activeLoans,
        pendingLoans,
        holdLoans,
        closedLoans
      } = []
    } = [],
    isLoading
  } = useFetch({
    action: `client/registration/count-accounts/${id}`
  })
  return (
    <div className="row w-100 h-100 align-items-center justify-content-center px-3">
      <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
        <div className="blue-magenta">
          {' '}
          <h5 style={{ fontSize: '24px' }}>{tsNumbers(activeSavings || 0)}</h5>{' '}
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <small>
            <Dollar size={16} /> {`${t('common.running')} ${t('common.saving_account')}`}
          </small>
        </div>
      </div>
      <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
        <div className="blue-magenta">
          {' '}
          <h5 style={{ fontSize: '24px' }}>{tsNumbers(pendingSavings || 0)}</h5>{' '}
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <small>
            <CheckPatch size={16} /> {`${t('common.pending')} ${t('common.saving_account')}`}
          </small>
        </div>
      </div>
      <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
        <div className="blue-magenta">
          {' '}
          <h5 style={{ fontSize: '24px' }}>{tsNumbers(holdSavings || 0)}</h5>{' '}
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <small>
            <Clock size={16} /> {`${t('common.hold')} ${t('common.saving_account')}`}
          </small>
        </div>
      </div>
      <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
        <div className="blue-magenta">
          {' '}
          <h5 style={{ fontSize: '24px' }}>{tsNumbers(closedSavings || 0)}</h5>{' '}
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <small>
            <Trash size={16} /> {`${t('common.closed')} ${t('common.saving_account')}`}
          </small>
        </div>
      </div>
      <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
        <div className="blue-magenta">
          {' '}
          <h5 style={{ fontSize: '24px' }}>{tsNumbers(activeLoans || 0)}</h5>{' '}
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <small>
            <Dollar size={16} /> {`${t('common.running')} ${t('common.loan_account')}`}
          </small>
        </div>
      </div>
      <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
        <div className="blue-magenta">
          {' '}
          <h5 style={{ fontSize: '24px' }}>{tsNumbers(pendingLoans || 0)}</h5>{' '}
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <small>
            <CheckPatch size={16} /> {`${t('common.pending')} ${t('common.loan_account')}`}
          </small>
        </div>
      </div>
      <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
        <div className="blue-magenta">
          {' '}
          <h5 style={{ fontSize: '24px' }}>{tsNumbers(holdLoans || 0)}</h5>{' '}
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <small>
            <Clock size={16} /> {`${t('common.hold')} ${t('common.loan_account')}`}
          </small>
        </div>
      </div>
      <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
        <div className="blue-magenta">
          {' '}
          <h5 style={{ fontSize: '24px' }}>{tsNumbers(closedLoans || 0)}</h5>{' '}
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <small>
            <Trash size={16} /> {`${t('common.closed')} ${t('common.loan_account')}`}
          </small>
        </div>
      </div>
    </div>
  )
}
