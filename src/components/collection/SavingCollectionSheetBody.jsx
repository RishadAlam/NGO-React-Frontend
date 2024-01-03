import { useTranslation } from 'react-i18next'
import SavingCollectionSheetRow from './SavingCollectionSheetRow'

export default function SavingCollectionSheetBody({ center, columnList }) {
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
                account={account}
                collection={collection}
              />
            ))
          ) : (
            <SavingCollectionSheetRow
              key={acc_key}
              columnList={columnList}
              index={acc_key}
              account={account}
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
