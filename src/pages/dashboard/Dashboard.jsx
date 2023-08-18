import { useTranslation } from 'react-i18next'
import Cards from '../../components/dashboardCards/Cards'
import PieChartBox from '../../components/pieChartBox/PieChartBox'
import TopCollectors from '../../components/topCollectors/TopCollectors'
import './dashboard.scss'

export default function Dashboard() {
  const { t } = useTranslation()
  return (
    <>
      {/* <div className="dashboard">
        <div className="box shadow pie-analytics">
          <PieChartBox chartName={t('dashboard.Savings_Collection_by_Sources')} />
        </div>
        <div className="box shadow box-card">
          <Cards
            cardName={t('dashboard.cards.Loan_Given')}
            amount={'72137'}
            compAmount={-5}
            color={'#8884d8'}
            t={t}
          />
        </div>
        <div className="box shadow box-card">
          <Cards
            cardName={t('dashboard.cards.Loan_Recovered')}
            amount={'3453'}
            compAmount={3}
            color={'skyblue'}
            t={t}
          />
        </div>
        <div className="box shadow top-collectors">
          <TopCollectors heading={t('dashboard.Todays_Top_Money_Collectors')} />
        </div>
        <div className="box shadow box-card">
          <Cards
            cardName={t('dashboard.cards.Loan_Saving_Collections')}
            amount={'2323123'}
            compAmount={-6}
            color={'teal'}
            t={t}
          />
        </div>
        <div className="box shadow box-card">
          <Cards
            cardName={t('dashboard.cards.Saving_Collections')}
            amount={'233422'}
            compAmount={2}
            color={'gold'}
            t={t}
          />
        </div>
        <div className="box shadow collection-list">analytics1</div>
        <div className="box shadow pie-analytics">
          <PieChartBox chartName={t('dashboard.Loans_Collection_by_Sources')} />
        </div>
        <div className="box shadow collection-list">analytics2</div>
        <div className="box shadow withdrawal-list">bar1</div>
        <div className="box shadow withdrawal-list">bar2</div>
      </div> */}

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
            <div className="row mb-3">
              <div className="col-md-6 pe-md-1">
                <div className="box mb-2 shadow box-card">
                  <Cards
                    cardName={t('dashboard.cards.Loan_Given')}
                    amount={'72137'}
                    compAmount={-5}
                    color={'#8884d8'}
                    t={t}
                  />
                </div>
              </div>
              <div className="col-md-6 ps-md-1">
                <div className="box mb-2 shadow box-card">
                  <Cards
                    cardName={t('dashboard.cards.Loan_Recovered')}
                    amount={'3453'}
                    compAmount={3}
                    color={'skyblue'}
                    t={t}
                  />
                </div>
              </div>
              <div className="col-md-6 pe-md-1">
                <div className="box mb-2 shadow box-card">
                  <Cards
                    cardName={t('dashboard.cards.Loan_Given')}
                    amount={'72137'}
                    compAmount={-5}
                    color={'#8884d8'}
                    t={t}
                  />
                </div>
              </div>
              <div className="col-md-6 ps-md-1">
                <div className="box mb-2 shadow box-card">
                  <Cards
                    cardName={t('dashboard.cards.Loan_Recovered')}
                    amount={'3453'}
                    compAmount={3}
                    color={'skyblue'}
                    t={t}
                  />
                </div>
              </div>
              <div className="col-md-6 mt-2 pe-md-1">
                <div className="box shadow withdrawal-list">bar1</div>
              </div>
              <div className="col-md-6 mt-2 ps-md-1">
                <div className="box shadow withdrawal-list">bar2</div>
              </div>
            </div>
            <div className="box mb-3 shadow collection-list">analytics</div>
            <div className="box mb-3 shadow collection-list">analytics2</div>
          </div>
          <div className="col-xl-3 col-lg-4 collectors">
            <div className="box mb-3 shadow top-collectors">
              <TopCollectors heading={t('dashboard.Todays_Top_Money_Collectors')} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
