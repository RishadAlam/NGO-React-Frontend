import { useTranslation } from 'react-i18next'
import LoanCollectionLists from '../../components/loanCollectionLists/LoanCollectionLists'
import LoanWithdrawalLists from '../../components/loanWithdrawalLists/LoanWithdrawalLists'
import SavingCollectionLists from '../../components/savingCollectionLists/SavingCollectionLists'
import SavingWithdrawalLists from '../../components/savingWithdrawalLists/SavingWithdrawalLists'
import LoanGiven from '../../icons/LoanGiven'
import LoanIcon from '../../icons/LoanIcon'
import LoanRecovered from '../../icons/LoanRecovered'
import MyLoan from '../../icons/MyLoan'
import PersonalLoan from '../../icons/PersonalLoan'
import SavingIcon from '../../icons/SavingIcon'
import Cards from './Cards'

export default function CardSection() {
  const { t } = useTranslation()

  return (
    <div className="row mb-3">
      <div className="col-md-6 pe-md-1">
        <div className="box mb-2 shadow box-card">
          <Cards
            cardIcon={<LoanGiven size={32} color={'#8884d8'} />}
            cardName={t('dashboard.cards.Loan_Given')}
            color={'#8884d8'}
            endpoint={'client/registration/loan/current-month-summary'}
          />
        </div>
      </div>
      <div className="col-md-6 ps-md-1">
        <div className="box mb-2 shadow box-card">
          <Cards
            cardIcon={<LoanRecovered size={32} color={'#8884d8'} />}
            cardName={t('dashboard.cards.Loan_Recovered')}
            color={'skyblue'}
            endpoint={'collection/loan/current-month-collection-summary'}
          />
        </div>
      </div>
      <div className="col-md-6 pe-md-1">
        <div className="box mb-2 shadow box-card">
          <Cards
            cardIcon={<MyLoan size={32} color={'#8884d8'} />}
            cardName={t('dashboard.cards.Loan_Saving_Collections')}
            color={'teal'}
            endpoint={'collection/loan/current-month-loan-saving-collection-summary'}
          />
        </div>
      </div>
      <div className="col-md-6 ps-md-1">
        <div className="box mb-2 shadow box-card">
          <Cards
            cardIcon={<SavingIcon size={36} color={'#8884d8'} />}
            cardName={t('dashboard.cards.Saving_Collections')}
            color={'gold'}
            endpoint={'collection/saving/current-month-collection-summary'}
          />
        </div>
      </div>
      <div className="col-md-6 pe-md-1">
        <div className="box mb-2 shadow box-card">
          <Cards
            cardIcon={<PersonalLoan size={32} color={'#8884d8'} />}
            cardName={t('dashboard.cards.Monthly_Loan_Collections')}
            color={'violet'}
            endpoint={'collection/loan/current-month-monthly_loan-collection-summary'}
          />
        </div>
      </div>
      <div className="col-md-6 ps-md-1">
        <div className="box mb-2 shadow box-card">
          <Cards
            cardIcon={<LoanIcon size={32} color={'#8884d8'} />}
            cardName={t('dashboard.cards.DPS_Collections')}
            color={'cornflowerblue'}
            endpoint={'collection/saving/current-month-dps-collection-summary'}
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
  )
}
