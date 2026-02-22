import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import LoanCollectionSheetRow from './LoanCollectionSheetRow'
import useVirtualRows from './useVirtualRows'

export default function LoanCollectionSheetBody({
  center,
  columnList,
  mutate,
  approvedList,
  setApprovedList,
  isRegular = true
}) {
  const { t } = useTranslation()
  const flatRows = useMemo(
    () =>
      (center?.loan_account || []).flatMap((account, accIndex) => {
        const loanCollections = account?.loan_collection || []
        if (!loanCollections.length) {
          return [{ key: `${account?.id || accIndex}-empty`, account, index: accIndex }]
        }
        return loanCollections.map((collection, collectionIndex) => ({
          key: `${account?.id || accIndex}-${collection?.id || collectionIndex}`,
          account,
          index: accIndex,
          collection,
          collectionIndex
        }))
      }),
    [center?.loan_account]
  )
  const { bodyRef, isVirtualized, visibleRows, topPadding, bottomPadding } = useVirtualRows(
    flatRows,
    { enabled: flatRows.length > 40, rowHeight: 64, overscan: 8 }
  )

  return (
    <tbody ref={bodyRef}>
      {flatRows.length > 0 ? (
        <>
          {isVirtualized && topPadding > 0 && (
            <tr aria-hidden="true" className="collection-sheet-spacer-row">
              <td
                colSpan={99}
                className="collection-sheet-spacer-cell"
                style={{ height: topPadding }}
              />
            </tr>
          )}
          {visibleRows.map((row) => (
            <LoanCollectionSheetRow
              key={row.key}
              columnList={columnList}
              index={row.index}
              collectionIndex={row.collectionIndex}
              account={row.account}
              collection={row.collection}
              mutate={mutate}
              approvedList={approvedList}
              setApprovedList={setApprovedList}
              isRegular={isRegular}
            />
          ))}
          {isVirtualized && bottomPadding > 0 && (
            <tr aria-hidden="true" className="collection-sheet-spacer-row">
              <td
                colSpan={99}
                className="collection-sheet-spacer-cell"
                style={{ height: bottomPadding }}
              />
            </tr>
          )}
        </>
      ) : (
        <tr className="collection-sheet-empty-row">
          <td colSpan={15} className="text-center collection-sheet-empty-cell">
            {t('common.No_Records_Found')}
          </td>
        </tr>
      )}
    </tbody>
  )
}
