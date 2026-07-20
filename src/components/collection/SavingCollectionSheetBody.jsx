import { useMemo } from 'react'
import { useMediaQuery } from '@mui/material'
import { useTranslation } from 'react-i18next'
import SavingCollectionSheetRow from './SavingCollectionSheetRow'
import useVirtualRows from './useVirtualRows'

export default function SavingCollectionSheetBody({
  center,
  columnList,
  mutate,
  approvedList,
  setApprovedList,
  isRegular = true
}) {
  const { t } = useTranslation()
  const isMobileSheet = useMediaQuery('(max-width:767.98px)', { noSsr: true })
  const flatRows = useMemo(
    () =>
      (center?.saving_account || []).flatMap((account, accIndex) => {
        const savingCollections = account?.saving_collection || []
        if (!savingCollections.length) {
          return [{ key: `${account?.id || accIndex}-empty`, account, index: accIndex }]
        }
        return savingCollections.map((collection, collectionIndex) => ({
          key: `${account?.id || accIndex}-${collection?.id || collectionIndex}`,
          account,
          index: accIndex,
          collection,
          collectionIndex
        }))
      }),
    [center?.saving_account]
  )
  const displayRows = useMemo(
    () =>
      isMobileSheet
        ? [...flatRows].sort(
            (firstRow, secondRow) =>
              Number(Object.keys(firstRow.collection || {}).length > 0) -
              Number(Object.keys(secondRow.collection || {}).length > 0)
          )
        : flatRows,
    [flatRows, isMobileSheet]
  )
  const { bodyRef, isVirtualized, visibleRows, topPadding, bottomPadding } = useVirtualRows(
    displayRows,
    { enabled: flatRows.length > 40 && !isMobileSheet, rowHeight: 64, overscan: 8 }
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
            <SavingCollectionSheetRow
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
              isMobileSheet={isMobileSheet}
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
          <td colSpan={99} className="text-center collection-sheet-empty-cell">
            {t('common.No_Records_Found')}
          </td>
        </tr>
      )}
    </tbody>
  )
}
