import { useTranslation } from 'react-i18next'
import ChevronDown from '../../icons/ChevronDown'
import tsNumbers from '../../libs/tsNumbers'

const hasValue = (value) => value !== undefined && value !== null && value !== '' && value !== false

export default function CollectionSheetMobileDetails({ fields = [] }) {
  const { t } = useTranslation()
  const visibleFields = fields.filter(({ value, visible = true }) => visible && hasValue(value))

  if (!visibleFields.length) return null

  return (
    <details className="collection-sheet-mobile-details">
      <summary>
        <span className="collection-sheet-mobile-details__more">{t('mobile.see_more')}</span>
        <span className="collection-sheet-mobile-details__less">{t('mobile.see_less')}</span>
        <span className="collection-sheet-mobile-details__count">
          {tsNumbers(visibleFields.length)}
        </span>
        <ChevronDown size={16} />
      </summary>
      <dl className="collection-sheet-mobile-details__grid">
        {visibleFields.map(({ key, label, value }) => (
          <div className="collection-sheet-mobile-details__field" key={key}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </details>
  )
}
