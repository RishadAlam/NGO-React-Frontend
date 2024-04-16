import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useAppSettingsValue } from '../../atoms/appSettingsAtoms'
import CardSection from '../../components/dashboardCards/CardSection'
import PieChartBox from '../../components/pieChartBox/PieChartBox'
import TopCollectors from '../../components/topCollectors/TopCollectors'
import WithdrawalLists from '../../components/withdrawalLists/WithdrawalLists'
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
              <PieChartBox
                chartName={t('dashboard.Savings_Collection_by_Sources')}
                endpoint="collection/saving/current-day-collection-sources"
              />
            </div>
            <div className="box mb-3 shadow pie-analytics">
              <PieChartBox
                chartName={t('dashboard.Loans_Collection_by_Sources')}
                endpoint="collection/loan/current-day-collection-sources"
              />
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
              <WithdrawalLists
                title={t('dashboard.Recent_Saving_Withdrawals')}
                endpoint="collection/saving/current-day-withdrawal"
              />
            </div>
            <div className="box withdrawal-list mb-3 d-lg-block d-none">
              <WithdrawalLists
                title={t('dashboard.Recent_Loan_Withdrawals')}
                endpoint="collection/loan/current-day-withdrawal"
              />
            </div>
          </div>
          <div className="col-md-6 d-lg-none d-block">
            <div className="box mb-3 shadow pie-analytics">
              <PieChartBox
                chartName={t('dashboard.Savings_Collection_by_Sources')}
                endpoint="collection/saving/current-day-collection-sources"
              />
            </div>
          </div>
          <div className="col-md-6 d-lg-none d-block">
            <div className="box mb-3 shadow pie-analytics">
              <PieChartBox
                chartName={t('dashboard.Loans_Collection_by_Sources')}
                endpoint="collection/loan/current-day-collection-sources"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
