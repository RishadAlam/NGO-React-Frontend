import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import Search from '../../icons/Search'
import tsNumbers from '../../libs/tsNumbers'
import { ALL_COLLECTION_SHEET_CENTERS } from './collectionSheetFilter'

function CollectionSheetFilters({
  searchQuery = '',
  setSearchQuery = () => {},
  centerOptions = [],
  selectedCenter = ALL_COLLECTION_SHEET_CENTERS,
  onCenterChange = () => {}
}) {
  const { t } = useTranslation()

  return (
    <div className="collection-sheet-filters">
      <label className="collection-sheet-search">
        <span className="collection-sheet-filter-label visually-hidden">{t('common.search')}</span>
        <Search size={18} />
        <input
          type="search"
          value={searchQuery ? tsNumbers(searchQuery) : ''}
          aria-label={t('common.search')}
          placeholder={t('common.collection_sheet_search_placeholder')}
          onChange={(event) => setSearchQuery(tsNumbers(event.target.value, true))}
        />
      </label>

      <label className="collection-sheet-center-filter">
        <span className="collection-sheet-filter-label">{t('common.center')}</span>
        <select
          value={selectedCenter}
          aria-label={t('common.center')}
          onChange={(event) => onCenterChange(event.target.value)}>
          <option value={ALL_COLLECTION_SHEET_CENTERS}>{t('common.all_centers')}</option>
          {centerOptions.map((center) => (
            <option key={center.value} value={center.value}>
              {center.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

export default memo(CollectionSheetFilters)
