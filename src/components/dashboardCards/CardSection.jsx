import { useTranslation } from 'react-i18next'
import LoanCollectionLists from '../../components/loanCollectionLists/LoanCollectionLists'
import SavingCollectionLists from '../../components/savingCollectionLists/SavingCollectionLists'
import LoanGiven from '../../icons/LoanGiven'
import LoanIcon from '../../icons/LoanIcon'
import LoanRecovered from '../../icons/LoanRecovered'
import MyLoan from '../../icons/MyLoan'
import PersonalLoan from '../../icons/PersonalLoan'
import SavingIcon from '../../icons/SavingIcon'
import WithdrawalLists from '../withdrawalLists/WithdrawalLists'
import Cards from './Cards'

export default function CardSection({
  loan_distributions = {},
  loan_collections_summery = {},
  loan_saving_collections = {},
  monthly_loan_collections = {},
  loan_collections = [],
  saving_collections_summery = {},
  dps_collections = {},
  saving_collections = [],
  saving_withdrawal = [],
  loan_saving_withdrawal = [],
  isLoading = false
}) {
  const { t } = useTranslation()

  return (
    <div className="row mb-3">
      <div className="col-md-6 pe-md-1">
        <div className="box mb-2 shadow box-card">
          <Cards
            cardIcon={<LoanGiven size={32} color={'var(--accent-color)'} />}
            cardName={t('dashboard.cards.Loan_Given')}
            color={'var(--accent-color)'}
            itemData={loan_distributions}
            isLoading={isLoading}
          />
        </div>
      </div>
      <div className="col-md-6 ps-md-1">
        <div className="box mb-2 shadow box-card">
          <Cards
            cardIcon={<LoanRecovered size={32} color={'var(--accent-color)'} />}
            cardName={t('dashboard.cards.Loan_Recovered')}
            color={'var(--primary-color)'}
            itemData={loan_collections_summery}
            isLoading={isLoading}
          />
        </div>
      </div>
      <div className="col-md-6 pe-md-1">
        <div className="box mb-2 shadow box-card">
          <Cards
            cardIcon={<MyLoan size={32} color={'var(--accent-color)'} />}
            cardName={t('dashboard.cards.Loan_Saving_Collections')}
            color={'var(--accent-color)'}
            itemData={loan_saving_collections}
            isLoading={isLoading}
          />
        </div>
      </div>
      <div className="col-md-6 ps-md-1">
        <div className="box mb-2 shadow box-card">
          <Cards
            cardIcon={<SavingIcon size={36} color={'var(--accent-color)'} />}
            cardName={t('dashboard.cards.Saving_Collections')}
            color={'var(--primary-color)'}
            itemData={saving_collections_summery}
            isLoading={isLoading}
          />
        </div>
      </div>
      <div className="col-md-6 pe-md-1">
        <div className="box mb-2 shadow box-card">
          <Cards
            cardIcon={<PersonalLoan size={32} color={'var(--accent-color)'} />}
            cardName={t('dashboard.cards.Monthly_Loan_Collections')}
            color={'var(--accent-color)'}
            itemData={monthly_loan_collections}
            isLoading={isLoading}
          />
        </div>
      </div>
      <div className="col-md-6 ps-md-1">
        <div className="box mb-2 shadow box-card">
          <Cards
            cardIcon={<LoanIcon size={32} color={'var(--accent-color)'} />}
            cardName={t('dashboard.cards.DPS_Collections')}
            color={'var(--primary-color)'}
            itemData={dps_collections}
            isLoading={isLoading}
          />
        </div>
      </div>
      <div className="col-md-6 mt-2 pe-md-1 d-lg-none d-block">
        <div className="box withdrawal-list">
          <WithdrawalLists
            title={t('dashboard.Recent_Saving_Withdrawals')}
            withdrawal={saving_withdrawal}
            isLoading={isLoading}
          />
        </div>
      </div>
      <div className="col-md-6 mt-2 ps-md-1 d-lg-none d-block">
        <div className="box withdrawal-list">
          <WithdrawalLists
            title={t('dashboard.Recent_Loan_Withdrawals')}
            withdrawal={loan_saving_withdrawal}
            isLoading={isLoading}
          />
        </div>
      </div>
      <div className="col-md-12 mt-2">
        <div className="box collection-list">
          <SavingCollectionLists collections={saving_collections} isLoading={isLoading} />
        </div>
      </div>
      <div className="col-md-12 mt-3">
        <div className="box collection-list">
          <LoanCollectionLists collections={loan_collections} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
