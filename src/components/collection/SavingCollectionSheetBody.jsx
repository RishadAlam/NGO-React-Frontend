import { useTranslation } from 'react-i18next'
import SavingCollectionSheetRow from './SavingCollectionSheetRow'

export default function SavingCollectionSheetBody({
  center,
  columnList,
  mutate,
  approvedList,
  setApprovedList,
  isRegular = true
}) {
  const { t } = useTranslation()

  return (
    <tbody>
      {center.saving_account.length > 0 ? (
        center.saving_account.map((account, acc_key) =>
          account?.saving_collection.length > 0 ? (
            account?.saving_collection.map((collection, collection_key) => (
              <SavingCollectionSheetRow
                key={collection_key}
                columnList={columnList}
                index={acc_key}
                collectionIndex={collection_key}
                account={account}
                collection={collection}
                mutate={mutate}
                approvedList={approvedList}
                setApprovedList={setApprovedList}
                isRegular={isRegular}
              />
            ))
          ) : (
            <SavingCollectionSheetRow
              key={acc_key}
              columnList={columnList}
              index={acc_key}
              account={account}
              mutate={mutate}
              approvedList={approvedList}
              setApprovedList={setApprovedList}
              isRegular={isRegular}
            />
          )
        )
      ) : (
        <tr>
          <td colSpan={12} className="text-center">
            {t('common.No_Records_Found')}
          </td>
        </tr>
      )}
    </tbody>
  )
}
