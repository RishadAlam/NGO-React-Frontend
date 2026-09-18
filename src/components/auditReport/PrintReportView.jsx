import { useTranslation } from 'react-i18next'
import tsNumbers from '../../libs/tsNumbers'
import ClientList from './ClientList'
import DepositExpenditure from './DepositExpenditure'
import NetProfit from './NetProfit'
import './PrintReportView.scss'
import ProfitLoss from './ProfitLoss'
import ReportLayout from './ReportLayout'
import SurplusValue from './SurplusValue'

export default function PrintReportView({ data, innerRef }) {
  const { t } = useTranslation()
  const {
    financial_year,
    deposit_expenditure,
    net_profit,
    profit_loss,
    surplus_value,
    client_list
  } = data

  const depositMeta = [...deposit_expenditure.deposit_meta, ...profit_loss.incomes]
  const expenditureMeta = [...deposit_expenditure.expenditure_meta, ...profit_loss.expenses]

  return (
    <section className="print-report ps-5 pe-5 bg-white text-dark" ref={innerRef}>
      <ReportLayout
        desc={t('localization.domain.receipts_payments_year', { year: tsNumbers(financial_year) })}>
        <DepositExpenditure
          depositMeta={depositMeta}
          expenditureMeta={expenditureMeta}
          deposit_expenditure={deposit_expenditure}
        />
      </ReportLayout>
      <ReportLayout
        title={t('localization.domain.profit_loss')}
        desc={t('localization.domain.year_ended_june', { year: tsNumbers(financial_year) })}>
        <ProfitLoss
          expenses={profit_loss.expenses}
          incomes={profit_loss.incomes}
          profit_loss={profit_loss}
        />
      </ReportLayout>
      {profit_loss.total_expenses.net_profits > 0 && (
        <ReportLayout
          title={t('localization.domain.profit_loss')}
          desc={t('localization.domain.year_ended_june', { year: tsNumbers(financial_year) })}>
          <NetProfit
            expense_meta={net_profit.expense_meta}
            income_meta={net_profit.income_meta}
            net_profit={net_profit}
          />
        </ReportLayout>
      )}
      <ReportLayout
        title={t('localization.domain.balance_sheet')}
        desc={t('localization.domain.as_of_june', {
          year: tsNumbers(financial_year.split('-')[1])
        })}>
        <SurplusValue
          capital_meta={surplus_value.capital_meta}
          resource_meta={surplus_value.resource_meta}
          surplus_value={surplus_value}
          net_profit={profit_loss.total_expenses.net_profits}
          net_loss={profit_loss.total_incomes.net_loss}
        />
      </ReportLayout>
      <ReportLayout
        desc={t('localization.domain.member_balances', {
          date: tsNumbers(`30/06/${financial_year.split('-')[1]}`)
        })}>
        <ClientList
          client_list={client_list.client_list}
          total_shares={client_list.total_shares}
          total_savings={client_list.total_savings}
          total_loan_remaining={client_list.total_loan_remaining}
        />
      </ReportLayout>
    </section>
  )
}
