import tsNumbers from '../../../libs/tsNumbers'
import { useTranslation } from 'react-i18next'

export default function PageOption({ pageIndex, page, gotoPage }) {
  const { t } = useTranslation()
  return (
    <>
      <button
        aria-label={t('localization.shared.page_number', { number: tsNumbers(page + 1) })}
        className={`table-btn ${pageIndex === page ? 'active' : ''}`}
        onClick={() => gotoPage(page)}>
        {tsNumbers(page + 1)}
      </button>
    </>
  )
}
