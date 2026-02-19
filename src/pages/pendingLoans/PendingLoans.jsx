import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import LoaderSm from '../../components/loaders/LoaderSm'
import PendingLoanApprovedModal from '../../components/pendingLoans/PendingLoanApprovedModal'
import EventCalender from '../../components/utilities/EventCalender'
import useFetch from '../../hooks/useFetch'
import BankTransferOut from '../../icons/BankTransferOut'
import CheckPatch from '../../icons/CheckPatch'
import Home from '../../icons/Home'
import tsNumbers from '../../libs/tsNumbers'

export default function PendingLoans() {
  const { t } = useTranslation()
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false)
  const [loanData, setLoanData] = useState()
  const [dateRange, setDateRange] = useState()

  const {
    data: { data: loanAccounts = [] } = [],
    mutate,
    isLoading,
    isError
  } = useFetch({
    action: 'client/registration/loan/pending-loans',
    queryParams: {
      date_range: dateRange ? dateRange : ''
    }
  })

  const events = useMemo(
    () => loanAccounts.map((loan) => eventsMap(loan, t)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loanAccounts]
  )

  const viewLoan = (event) => {
    setLoanData(event)
    setIsApprovalModalOpen(true)
  }

  return (
    <>
      <section className="staff">
        <div className="row align-items-center my-3">
          <div className="col-sm-6">
            <Breadcrumb
              breadcrumbs={[
                { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
                {
                  name: t('menu.categories.Pending_Approval'),
                  icon: <CheckPatch size={16} />,
                  active: false
                },
                {
                  name: t('menu.label.pending_loans'),
                  icon: <BankTransferOut size={16} />,
                  active: true
                }
              ]}
            />
          </div>
        </div>
        <div>
          <div className="card my-3 mx-auto">
            <div className="card-header d-flex align-items-center">
              <b className="text-uppercase">{t('menu.label.pending_loans')}</b>{' '}
              {isLoading && <LoaderSm size={20} clr="var(--primary-color)" className="ms-2" />}
            </div>
            {isApprovalModalOpen && loanData && (
              <PendingLoanApprovedModal
                open={isApprovalModalOpen}
                setOpen={setIsApprovalModalOpen}
                data={loanData}
                mutate={mutate}
              />
            )}
            <div className="card-body">
              <EventCalender
                events={events}
                onClick={viewLoan}
                tooltipAccessor={(event) => `${event.name}  (${tsNumbers(event.acc_no)})`}
                mutate={mutate}
                setDateRange={setDateRange}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

const eventsMap = (loan, t) => ({
  id: loan.id,
  start: new Date(loan.start_date),
  end: new Date(loan.start_date),
  allDay: true,
  title: Number(loan.category.is_default)
    ? t(`category.default.${loan.category.name}`) +
      ` (${tsNumbers(`৳${loan.loan_given}/-`)}) (${tsNumbers(loan?.acc_no)})`
    : loan.category.name + ` (${tsNumbers(`৳${loan.loan_given}/-`)}) (${tsNumbers(loan?.acc_no)})`,
  acc_no: loan.acc_no,
  name: loan.client_registration.name,
  image_uri: loan.client_registration.image_uri,
  field: loan.field.name,
  center: loan.center.name,
  category: loan.category.name,
  category_is_default: loan.category.is_default,
  creator: loan.author.name,
  start_date: loan.start_date,
  duration_date: loan.duration_date,
  loan_given: loan.loan_given,
  total_installment: loan.payable_installment,
  payable_deposit: loan.payable_deposit,
  payable_installment: loan.payable_installment,
  payable_interest: loan.payable_interest,
  total_payable_interest: loan.total_payable_interest,
  total_payable_loan_with_interest: loan.total_payable_loan_with_interest,
  loan_installment: loan.loan_installment,
  interest_installment: loan.interest_installment,
  is_loan_approved: loan.is_loan_approved,
  created_at: loan.created_at
})
