import { useTranslation } from 'react-i18next'
import Cards from '../../components/dashboardCards/Cards'
import LoanCollectionLists from '../../components/loanCollectionLists/LoanCollectionLists'
import LoanWithdrawalLists from '../../components/loanWithdrawalLists/LoanWithdrawalLists'
import PieChartBox from '../../components/pieChartBox/PieChartBox'
import SavingCollectionLists from '../../components/savingCollectionLists/SavingCollectionLists'
import SavingWithdrawalLists from '../../components/savingWithdrawalLists/SavingWithdrawalLists'
import TopCollectors from '../../components/topCollectors/TopCollectors'
import LoanGiven from '../../icons/LoanGiven'
import LoanIcon from '../../icons/LoanIcon'
import LoanRecovered from '../../icons/LoanRecovered'
import MyLoan from '../../icons/MyLoan'
import PersonalLoan from '../../icons/PersonalLoan'
import SavingIcon from '../../icons/SavingIcon'
import './dashboard.scss'

export default function Dashboard() {
  const { t } = useTranslation()
  return (
    <>
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
                    cardIcon={<LoanGiven size={32} color={'#8884d8'} />}
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
                    cardIcon={<LoanRecovered size={32} color={'#8884d8'} />}
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
                    cardIcon={<MyLoan size={32} color={'#8884d8'} />}
                    cardName={t('dashboard.cards.Loan_Saving_Collections')}
                    amount={'2323123'}
                    compAmount={-6}
                    color={'teal'}
                    t={t}
                  />
                </div>
              </div>
              <div className="col-md-6 ps-md-1">
                <div className="box mb-2 shadow box-card">
                  <Cards
                    cardIcon={<SavingIcon size={36} color={'#8884d8'} />}
                    cardName={t('dashboard.cards.Saving_Collections')}
                    amount={'233422'}
                    compAmount={2}
                    color={'gold'}
                    t={t}
                  />
                </div>
              </div>
              <div className="col-md-6 pe-md-1">
                <div className="box mb-2 shadow box-card">
                  <Cards
                    cardIcon={<PersonalLoan size={32} color={'#8884d8'} />}
                    cardName={t('dashboard.cards.Monthly_Loan_Collections')}
                    amount={'2323123'}
                    compAmount={-6}
                    color={'violet'}
                    t={t}
                  />
                </div>
              </div>
              <div className="col-md-6 ps-md-1">
                <div className="box mb-2 shadow box-card">
                  <Cards
                    cardIcon={<LoanIcon size={32} color={'#8884d8'} />}
                    cardName={t('dashboard.cards.DPS_Collections')}
                    amount={'233422'}
                    compAmount={2}
                    color={'cornflowerblue'}
                    t={t}
                  />
                </div>
              </div>
              <div className="col-md-6 mt-2 pe-md-1 d-lg-none d-block">
                <div className="box withdrawal-list">
                  <SavingWithdrawalLists />
                </div>
              </div>
              <div className="col-md-6 mt-2 ps-md-1 d-lg-none d-block">
                <div className="box withdrawal-list">
                  <LoanWithdrawalLists />
                </div>
              </div>
              <div className="col-md-12 mt-2">
                <div className="box collection-list">
                  <SavingCollectionLists />
                </div>
              </div>
              <div className="col-md-12 mt-3">
                <div className="box collection-list">
                  <LoanCollectionLists />
                </div>
              </div>
            </div>
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
