import { useTranslation } from 'react-i18next'
import Cards from '../../components/dashboardCards/Cards'
import PieChartBox from '../../components/pieChartBox/PieChartBox'
import TopCollectors from '../../components/topCollectors/TopCollectors'
import './dashboard.scss'

export default function Dashboard() {
  const { t } = useTranslation()
  return (
    <>
      <div className="dashboard">
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
      </div>
    </>
  )
}
