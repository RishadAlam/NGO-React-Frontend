import { useTranslation } from 'react-i18next'
import LoanCollectionSheetRow from './LoanCollectionSheetRow'

export default function LoanCollectionSheetBody({
  center,
  columnList,
  mutate,
  approvedList,
  setApprovedList
}) {
  const { t } = useTranslation()

  return (
    <tbody>
      {center.loan_account.length > 0 ? (
        center.loan_account.map((account, acc_key) =>
          account?.loan_collection.length > 0 ? (
            account?.loan_collection.map((collection, collection_key) => (
              <LoanCollectionSheetRow
                key={collection_key}
                columnList={columnList}
                index={acc_key}
                collectionIndex={collection_key}
                account={account}
                collection={collection}
                mutate={mutate}
                approvedList={approvedList}
                setApprovedList={setApprovedList}
              />
            ))
          ) : (
            <LoanCollectionSheetRow
              key={acc_key}
              columnList={columnList}
              index={acc_key}
              account={account}
              mutate={mutate}
              approvedList={approvedList}
              setApprovedList={setApprovedList}
            />
          )
        )
      ) : (
        <tr>
          <td colSpan={9} className="text-center">
            {t('common.No_Records_Found')}
          </td>
        </tr>
      )}
    </tbody>
  )
}
