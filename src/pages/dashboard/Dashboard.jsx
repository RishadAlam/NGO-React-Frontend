import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useAppSettingsValue } from '../../atoms/appSettingsAtoms'
import CardSection from '../../components/dashboardCards/CardSection'
import PieChartBox from '../../components/pieChartBox/PieChartBox'
import TopCollectors from '../../components/topCollectors/TopCollectors'
import WithdrawalLists from '../../components/withdrawalLists/WithdrawalLists'
import { isEmpty } from '../../helper/isEmpty'
import useFetch from '../../hooks/useFetch'
import './dashboard.scss'

export default function Dashboard({ pageTitle }) {
  const { t } = useTranslation()
  const { company_name = '' } = useAppSettingsValue()
  const separator = !isEmpty(pageTitle) && !isEmpty(company_name) ? ' | ' : ''

  const {
    data: {
      data: {
        loan_distributions = {},
        loan_collections_summery = {},
        loan_saving_collections = {},
        monthly_loan_collections = {},
        loan_collections_sources = [],
        loan_collections = [],
        loan_saving_withdrawal = [],
        saving_collections_summery = {},
        dps_collections = {},
        saving_collections_sources = [],
        saving_collections = [],
        saving_withdrawal = [],
        top_collectionist = []
      } = {}
    } = [],
    isLoading
  } = useFetch({
    action: 'dashboard'
  })

  return (
    <>
      <Helmet>
        <title>{`${t(pageTitle) + separator + company_name}`}</title>
      </Helmet>

      <div className="dashboard">
        <div className="row g-3 dashboard-grid">
          <div className="col-xl-3 d-xl-block d-none dashboard-column dashboard-column--analytics">
            <div className="dashboard-stack">
              <div className="box dashboard-panel pie-analytics">
                <PieChartBox
                  chartName={t('dashboard.Savings_Collection_by_Sources')}
                  sources={saving_collections_sources}
                  isLoading={isLoading}
                />
              </div>
              <div className="box dashboard-panel pie-analytics">
                <PieChartBox
                  chartName={t('dashboard.Loans_Collection_by_Sources')}
                  sources={loan_collections_sources}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-8 dashboard-column dashboard-column--metrics">
            <CardSection
              loan_distributions={loan_distributions}
              loan_collections_summery={loan_collections_summery}
              loan_saving_collections={loan_saving_collections}
              monthly_loan_collections={monthly_loan_collections}
              loan_collections={loan_collections}
              saving_collections_summery={saving_collections_summery}
              dps_collections={dps_collections}
              saving_collections={saving_collections}
              saving_withdrawal={saving_withdrawal}
              loan_saving_withdrawal={loan_saving_withdrawal}
              isLoading={isLoading}
            />
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 dashboard-column collectors">
            <div className="dashboard-stack">
              <div className="box dashboard-panel top-collectors">
                <TopCollectors
                  heading={t('dashboard.Todays_Top_Money_Collectors')}
                  collectors={top_collectionist}
                  isLoading={isLoading}
                />
              </div>
              <div className="box dashboard-panel withdrawal-list d-lg-block d-none">
                <WithdrawalLists
                  title={t('dashboard.Recent_Saving_Withdrawals')}
                  withdrawal={saving_withdrawal}
                  isLoading={isLoading}
                />
              </div>
              <div className="box dashboard-panel withdrawal-list d-lg-block d-none">
                <WithdrawalLists
                  title={t('dashboard.Recent_Loan_Withdrawals')}
                  withdrawal={loan_saving_withdrawal}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
          <div className="col-md-6 d-lg-none d-block dashboard-column">
            <div className="box dashboard-panel pie-analytics">
              <PieChartBox
                chartName={t('dashboard.Savings_Collection_by_Sources')}
                sources={saving_collections_sources}
                isLoading={isLoading}
              />
            </div>
          </div>
          <div className="col-md-6 d-lg-none d-block dashboard-column">
            <div className="box dashboard-panel pie-analytics">
              <PieChartBox
                chartName={t('dashboard.Loans_Collection_by_Sources')}
                sources={loan_collections_sources}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
