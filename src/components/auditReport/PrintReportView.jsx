import tsNumbers from '../../libs/tsNumbers'
import DepositExpenditure from './DepositExpenditure'
import NetProfit from './NetProfit'
import './PrintReportView.scss'
import ProfitLoss from './ProfitLoss'
import ReportLayout from './ReportLayout'
import SurplusValue from './SurplusValue'

export default function PrintReportView({ data, innerRef }) {
  const { financial_year, deposit_expenditure, net_profit, profit_loss, surplus_value } = data

  const depositMeta = [...deposit_expenditure.deposit_meta, ...profit_loss.incomes]
  const expenditureMeta = [...deposit_expenditure.expenditure_meta, ...profit_loss.expenses]

  return (
    <section className="print-report p-5 pt-0 bg-white text-dark" ref={innerRef}>
      <ReportLayout desc={`${tsNumbers(financial_year)} ইং সনের জমা খরচের হিসাব`}>
        <DepositExpenditure
          depositMeta={depositMeta}
          expenditureMeta={expenditureMeta}
          deposit_expenditure={deposit_expenditure}
        />
      </ReportLayout>
      <ReportLayout
        title="লাভ-ক্ষতি হিসাব"
        desc={`${tsNumbers(financial_year)} ইং সনের ৩০ জুন সমাপ্ত বছরের জন্য`}>
        <ProfitLoss
          expenses={profit_loss.expenses}
          incomes={profit_loss.incomes}
          profit_loss={profit_loss}
        />
      </ReportLayout>
      {profit_loss.total_expenses.net_profits > 0 && (
        <ReportLayout
          title="লাভ-ক্ষতি হিসাব"
          desc={`${tsNumbers(financial_year)} ইং সনের ৩০ জুন সমাপ্ত বছরের জন্য`}>
          <NetProfit
            expense_meta={net_profit.expense_meta}
            income_meta={net_profit.income_meta}
            net_profit={net_profit}
          />
        </ReportLayout>
      )}
      <ReportLayout
        title="উদ্বৃত্তপত্র"
        desc={`${tsNumbers(financial_year)} ইং সনের ৩০ জুন সমাপ্ত বছরের জন্য`}>
        <SurplusValue
          capital_meta={surplus_value.capital_meta}
          resource_meta={surplus_value.resource_meta}
          surplus_value={surplus_value}
          net_profit={profit_loss.total_expenses.net_profits}
          net_loss={profit_loss.total_incomes.net_loss}
        />
      </ReportLayout>
    </section>
  )
}
