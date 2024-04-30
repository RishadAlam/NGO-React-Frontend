import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { checkPermissions } from '../../helper/checkPermission'
import { isEmpty } from '../../helper/isEmpty'
import Edit from '../../icons/Edit'
import Folder from '../../icons/Folder'
import dateFormat from '../../libs/dateFormat'
import tsNumbers from '../../libs/tsNumbers'
import Badge from '../utilities/Badge'
import Button from '../utilities/Button'
import CRDButtonGrp from './CRDButtonGrp'
import NomsDetails from './NomiesDetails'

export default function LoanAccountDetails({ data = {}, mutate }) {
  const { t } = useTranslation()
  const { permissions: authPermissions } = useAuthDataValue()

  let statusName = ''
  let statusClass = ''
  let isEditable = false

  if (data?.deleted_at) {
    statusName = t('common.closed')
    statusClass = 'bg-secondary'
  } else {
    statusName = Number(data?.is_approved)
      ? data?.status
        ? t('common.running')
        : t('common.hold')
      : t('common.pending')
    statusClass = Number(data?.is_approved)
      ? data?.status
        ? 'bg-success'
        : 'bg-warning'
      : 'bg-danger'
    isEditable = Number(data?.is_approved) && Number(data?.status) ? true : false
  }

  return (
    <div>
      <div className="p-2 pt-0 border-bottom">
        <h5 className="fw-medium">
          <b>
            {data.category.is_default
              ? t(`category.default.${data.category.name}`)
              : data.category.name}
          </b>
        </h5>
      </div>
      <div className="py-4 border-bottom">
        <div className="px-2">
          <div className="row">
            <div className="col-md-4">
              <p className="truncate mb-3">
                {t('common.status')}:
                <span className="float-end fw-medium">
                  {<Badge name={statusName} className={statusClass} />}
                </span>
              </p>
              {Number(data?.is_approved) > 0 && (
                <p className="truncate mb-3">
                  {t('common.account')}:
                  <Link to={`/loan-account/${data?.id}`}>
                    <span className="float-end fw-medium text-primary">{<Folder size={30} />}</span>
                  </Link>
                </p>
              )}
              <p className="truncate mb-3">
                {t('common.installment')}:
                <span className="float-end fw-medium">
                  {tsNumbers(data?.total_rec_installment || 0)}
                </span>
              </p>
              <p className="truncate mb-3">
                {t('common.balance')}:
                <span className="float-end fw-medium">{tsNumbers(`$${data?.balance || 0}/-`)}</span>
              </p>
              <p className="truncate mb-3">
                {t('common.total_loan_rec')}:
                <span className="float-end fw-medium">
                  {tsNumbers(`$${data?.total_loan_rec || 0}/-`)}
                </span>
              </p>
              <p className="truncate mb-3">
                {t('common.total_interest_rec')}:
                <span className="float-end fw-medium">
                  {tsNumbers(`$${data?.total_interest_rec || 0}/-`)}
                </span>
              </p>
              <p className="truncate mb-3">
                {t('common.creator')}:
                <span className="float-end fw-medium">{data?.author?.name}</span>
              </p>
              {!isEmpty(data?.approver?.name) && (
                <p className="truncate mb-3">
                  {t('common.approver')}:
                  <span className="float-end fw-medium">{data?.approver?.name}</span>
                </p>
              )}
              <p className="truncate mb-3">
                {t('common.created_at')}:
                <span className="float-end fw-medium">
                  {data?.created_at &&
                    tsNumbers(dateFormat(data?.created_at, 'dd/MM/yyyy hh:mm a'))}
                </span>
              </p>
              {!isEmpty(data?.approved_at) && (
                <p className="truncate mb-3">
                  {t('common.approved_at')}:
                  <span className="float-end fw-medium">
                    {data?.approved_at &&
                      tsNumbers(dateFormat(data?.approved_at, 'dd/MM/yyyy hh:mm a'))}
                  </span>
                </p>
              )}
              {!isEmpty(data?.deleted_at) && (
                <p className="truncate mb-3">
                  {t('common.deleted')}:
                  <span className="float-end fw-medium">
                    {data?.deleted_at &&
                      tsNumbers(dateFormat(data?.deleted_at, 'dd/MM/yyyy hh:mm a'))}
                  </span>
                </p>
              )}
            </div>
            <div className="col-md-4 middle-column">
              <p className="truncate mb-3">
                {t('common.start_date')}:
                <span className="float-end fw-medium">
                  {data?.start_date && tsNumbers(dateFormat(data?.start_date, 'dd/MM/yyyy'))}
                </span>
              </p>
              <p className="truncate mb-3">
                {t('common.duration_date')}:
                <span className="float-end fw-medium">
                  {data?.duration_date && tsNumbers(dateFormat(data?.duration_date, 'dd/MM/yyyy'))}
                </span>
              </p>
              <p className="truncate mb-3">
                {t('common.loan_given')}:
                <span className="float-end fw-medium">
                  {tsNumbers(`$${data?.loan_given || 0}/-`)}
                </span>
              </p>
              <p className="truncate mb-3">
                {t('common.total_installment')}:
                <span className="float-end fw-medium">
                  {tsNumbers(data?.payable_installment || 0)}
                </span>
              </p>
              <p className="truncate mb-3">
                {t('common.deposit')}:
                <span className="float-end fw-medium">
                  {tsNumbers(`$${data?.payable_deposit || 0}/-`)}
                </span>
              </p>
              <p className="truncate mb-3">
                {t('common.interest')}:
                <span className="float-end fw-medium">
                  {tsNumbers(`${data?.payable_interest || 0}%`)}
                </span>
              </p>
              <p className="truncate mb-3">
                {t('common.total_payable_interest')}:
                <span className="float-end fw-medium">
                  {tsNumbers(`$${data?.total_payable_interest || 0}/-`)}
                </span>
              </p>
              <p className="truncate mb-3">
                {t('common.total_payable_loan_with_interest')}:
                <span className="float-end fw-medium">
                  {tsNumbers(`$${data?.total_payable_loan_with_interest || 0}/-`)}
                </span>
              </p>
            </div>
            <div className="col-md-4">
              <p className="truncate mb-3">
                {t('common.loan_installment')}:
                <span className="float-end fw-medium">
                  {tsNumbers(`$${data?.loan_installment || 0}/-`)}
                </span>
              </p>
              <p className="truncate mb-3">
                {t('common.interest_installment')}:
                <span className="float-end fw-medium">
                  {tsNumbers(`$${data?.interest_installment || 0}/-`)}
                </span>
              </p>
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
      {data.guarantors.length > 0 && (
        <div className="py-4 pb-0 border-bottom">
          {data.guarantors.map((nomsData, index) => (
            <NomsDetails key={index} data={nomsData} index={index} status="loan" />
          ))}
        </div>
      )}
      {isEditable && (
        <div className="pt-3">
          <div className="px-2">
            <div className="row">
              <div className="col-md-12">
                <Button
                  type="submit"
                  name={`${
                    data.category.is_default
                      ? t(`category.default.${data.category.name}`)
                      : data.category.name
                  } ${t('common.loan_account')} ${t('common.edit')}`}
                  className={'btn-warning text-black py-2 px-3 form-control'}
                  loading={false}
                  endIcon={<Edit size={20} />}
                  disabled={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {isEditable &&
        checkPermissions(
          [
            'client_loan_account_update',
            'client_loan_account_delete',
            'client_loan_account_category_update'
          ],
          authPermissions
        ) &&
        isEmpty(data.deleted_at) && (
          <CRDButtonGrp module="loan_account" data={data} mutate={mutate} />
        )}
    </div>
  )
}
