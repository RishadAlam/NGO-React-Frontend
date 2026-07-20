import { useTranslation } from 'react-i18next'
import tsNumbers from '../../libs/tsNumbers'

export default function CollectionSheetCenterHeader({ center, accountKey, collectionKey }) {
  const { t } = useTranslation()
  const accounts = center?.[accountKey] || []
  const totalMembers = accounts.length
  const collectedMembers = accounts.filter(
    (account) => (account?.[collectionKey] || []).length > 0
  ).length
  const progress = totalMembers ? Math.round((collectedMembers / totalMembers) * 100) : 0

  return (
    <>
      <h2 className="heading collection-sheet-center-title collection-sheet-center-title--desktop">
        {center?.name}
      </h2>
      <header className="collection-sheet-mobile-center-header">
        <div className="collection-sheet-mobile-center-header__copy">
          <h2>{center?.name}</h2>
          <span>
            {tsNumbers(collectedMembers)}/{tsNumbers(totalMembers)} {t('common.members_collected')}
          </span>
        </div>
        <strong>{tsNumbers(`${progress}%`)}</strong>
        <div
          className="collection-sheet-mobile-center-header__progress"
          role="progressbar"
          aria-label={t('common.collection_progress')}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </header>
    </>
  )
}
