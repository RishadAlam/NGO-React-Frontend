import { useTranslation } from 'react-i18next'
import LoanCollectionLists from '../../components/loanCollectionLists/LoanCollectionLists'
import LoanWithdrawalLists from '../../components/loanWithdrawalLists/LoanWithdrawalLists'
import SavingCollectionLists from '../../components/savingCollectionLists/SavingCollectionLists'
import SavingWithdrawalLists from '../../components/savingWithdrawalLists/SavingWithdrawalLists'
import useFetch from '../../hooks/useFetch'
import LoanGiven from '../../icons/LoanGiven'
import LoanIcon from '../../icons/LoanIcon'
import LoanRecovered from '../../icons/LoanRecovered'
import MyLoan from '../../icons/MyLoan'
import PersonalLoan from '../../icons/PersonalLoan'
import SavingIcon from '../../icons/SavingIcon'
import Cards from './Cards'

export default function CardSection() {
  const { t } = useTranslation()

  const {
    data: { data: fields } = [],
    mutate,
    isLoading,
    isError
  } = useFetch({ action: 'client/registration/loan/current-month-summary' })
  console.log(fields)

  return (
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
  )
}
