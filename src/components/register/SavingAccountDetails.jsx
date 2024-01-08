import { useTranslation } from 'react-i18next'
import dateFormat from '../../libs/dateFormat'
import tsNumbers from '../../libs/tsNumbers'
import NomsDetails from './NomiesDetails'

export default function SavingAccountDetails({ data }) {
  const { t } = useTranslation()

  return (
    <div>
      <div className="p-2 pt-0 border-bottom">
        <h5 className="fw-medium">
          <b>
            {data.category.is_default
              ? t(`common.category.${data.category.name}`)
              : data.category.name}
          </b>
        </h5>
      </div>
      <div className="py-4 border-bottom">
        <div className="px-2">
          <div className="row">
            <div className="col-md-4">
              <p className="truncate mb-3">
                {t('common.status')}:<span className="float-end fw-medium">{data?.status}</span>
              </p>
              <p className="truncate mb-3">
                {t('common.account')}:<span className="float-end fw-medium">{data?.acc_no}</span>
              </p>
              <p className="truncate mb-3">
                {t('common.balance')}:
                <span className="float-end fw-medium">{tsNumbers(`$${data?.balance || 0}/-`)}</span>
              </p>
              <p className="truncate mb-3">
                {t('common.creator')}:
                <span className="float-end fw-medium">{data?.author?.name}</span>
              </p>
              <p className="truncate mb-3">
                {t('common.approver')}:
                <span className="float-end fw-medium">{data?.approver?.name}</span>
              </p>
              <p className="truncate mb-3">
                {t('common.created_at')}:
                <span className="float-end fw-medium">
                  {data?.created_at &&
                    tsNumbers(dateFormat(data?.created_at, 'dd/MM/yyyy hh:mm a'))}
                </span>
              </p>
              <p className="truncate mb-3">
                {t('common.approved_at')}:
                <span className="float-end fw-medium">
                  {data?.approved_at &&
                    tsNumbers(dateFormat(data?.approved_at, 'dd/MM/yyyy hh:mm a'))}
                </span>
              </p>
            </div>
            <div className="col-md-4 middle-column">
              <p className="truncate mb-3">
                {t('common.start_date')}:
                <span className="float-end fw-medium">
                  {data?.start_date &&
                    tsNumbers(dateFormat(data?.start_date, 'dd/MM/yyyy hh:mm a'))}
                </span>
              </p>
              <p className="truncate mb-3">
                {t('common.duration_date')}:
                <span className="float-end fw-medium">
                  {data?.duration_date &&
                    tsNumbers(dateFormat(data?.duration_date, 'dd/MM/yyyy hh:mm a'))}
                </span>
              </p>
              <p className="truncate mb-3">
                {t('common.installment')}:
                <span className="float-end fw-medium">
                  {tsNumbers(data?.payable_installment || 0)}
                </span>
              </p>
              <p className="truncate mb-3">
                {t('common.payable_deposit')}:
                <span className="float-end fw-medium">
                  {tsNumbers(`$${data?.payable_deposit || 0}/-`)}
                </span>
              </p>
              <p className="truncate mb-3">
                {t('common.payable_interest')}:
                <span className="float-end fw-medium">
                  {tsNumbers(`${data?.payable_interest || 0}%`)}
                </span>
              </p>
              <p className="truncate mb-3">
                {t('common.total_deposit_without_interest')}:
                <span className="float-end fw-medium">
                  {tsNumbers(`$${data?.total_deposit_without_interest || 0}/-`)}
                </span>
              </p>
              <p className="truncate mb-3">
                {t('common.total_deposit_with_interest')}:
                <span className="float-end fw-medium">
                  {tsNumbers(`$${data?.total_deposit_with_interest || 0}/-`)}
                </span>
              </p>
            </div>
            <div className="col-md-4">
              {data?.closing_balance && (
                <p className="truncate mb-3">
                  {t('common.closing_balance')}:
                  <span className="float-end fw-medium">
                    {data?.closing_balance && tsNumbers(data?.closing_balance)}
                  </span>
                </p>
              )}
              {data?.closing_interest && (
                <p className="truncate mb-3">
                  {t('common.closing_interest')}:
                  <span className="float-end fw-medium">
                    {data?.closing_interest && tsNumbers(data?.closing_interest)}
                  </span>
                </p>
              )}
              {data?.closing_balance_with_interest && (
                <p className="truncate mb-3">
                  {t('common.closing_balance_with_interest')}:
                  <span className="float-end fw-medium">
                    {data?.closing_balance_with_interest &&
                      tsNumbers(data?.closing_balance_with_interest)}
                  </span>
                </p>
              )}
              {data?.description && (
                <p className="truncate mb-3">
                  {t('common.description')}:
                  <span className="float-end fw-medium">
                    {data?.description && data?.description}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="py-4 border-bottom">
        {data.nominees.map((nominee, index) => (
          <NomsDetails key={index} data={nominee} index={index} />
        ))}
      </div>
    </div>
  )
}
