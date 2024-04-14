import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useAppSettingsValue } from '../../atoms/appSettingsAtoms'
import CardSection from '../../components/dashboardCards/CardSection'
import LoanWithdrawalLists from '../../components/loanWithdrawalLists/LoanWithdrawalLists'
import PieChartBox from '../../components/pieChartBox/PieChartBox'
import SavingWithdrawalLists from '../../components/savingWithdrawalLists/SavingWithdrawalLists'
import TopCollectors from '../../components/topCollectors/TopCollectors'
import { isEmpty } from '../../helper/isEmpty'
import './dashboard.scss'

export default function Dashboard({ pageTitle }) {
  const { t } = useTranslation()
  const { company_name = '' } = useAppSettingsValue()
  const separator = !isEmpty(pageTitle) && !isEmpty(company_name) ? ' | ' : ''

  return (
    <>
      <Helmet>
        <title>{`${t(pageTitle) + separator + company_name}`}</title>
      </Helmet>

      <div className="dashboard">
        <div className="row">
          <div className="col-xl-3 d-xl-block d-none">
            <div className="box mb-3 shadow pie-analytics">
              <PieChartBox chartName={t('dashboard.Savings_Collection_by_Sources')} />
            </div>
            <div className="box mb-3 shadow pie-analytics">
              <PieChartBox chartName={t('dashboard.Loans_Collection_by_Sources')} />
            </div>
          </div>
          <div className="col-xl-6 col-lg-8 px-xl-0">
            <CardSection />
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 collectors">
            <div className="box mb-3 top-collectors">
              <TopCollectors heading={t('dashboard.Todays_Top_Money_Collectors')} />
            </div>
            <div className="box withdrawal-list mb-3 d-lg-block d-none">
              <SavingWithdrawalLists />
            </div>
            <div className="box withdrawal-list mb-3 d-lg-block d-none">
              <LoanWithdrawalLists />
            </div>
          </div>
          <div className="col-md-6 d-lg-none d-block">
            <div className="box mb-3 shadow pie-analytics">
              <PieChartBox chartName={t('dashboard.Savings_Collection_by_Sources')} />
            </div>
          </div>
          <div className="col-md-6 d-lg-none d-block">
            <div className="box mb-3 shadow pie-analytics">
              <PieChartBox chartName={t('dashboard.Loans_Collection_by_Sources')} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
