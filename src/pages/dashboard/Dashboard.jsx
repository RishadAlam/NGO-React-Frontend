import { useTranslation } from 'react-i18next'
import Cards from '../../components/dashboardCards/Cards'
import './dashboard.scss'

export default function Dashboard() {
  const { t } = useTranslation()
  return (
    <>
      <div className="dashboard">
        <div className="box shadow pie-analytics">Pie Box</div>
        <div className="box shadow box-card">
          <Cards
            cardName={t('dashboard.cards.Loan_Given')}
            amount={'72137'}
            compAmount={-5}
            t={t}
          />
        </div>
        <div className="box shadow box-card">
          <Cards
            cardName={t('dashboard.cards.Loan_Recovered')}
            amount={'3453'}
            compAmount={3}
            t={t}
          />
        </div>
        <div className="box shadow top-collectionist">top</div>
        <div className="box shadow box-card">
          <Cards
            cardName={t('dashboard.cards.Loan_Saving_Collections')}
            amount={'2323123'}
            compAmount={-6}
            t={t}
          />
        </div>
        <div className="box shadow box-card">
          <Cards
            cardName={t('dashboard.cards.Saving_Collections')}
            amount={'233422'}
            compAmount={2}
            t={t}
          />
        </div>
        <div className="box shadow collection-list">analytics1</div>
        <div className="box shadow pie-analytics">Pie Box2</div>
        <div className="box shadow collection-list">analytics2</div>
        <div className="box shadow withdrawal-list">bar1</div>
        <div className="box shadow withdrawal-list">bar2</div>
      </div>
    </>
  )
}
