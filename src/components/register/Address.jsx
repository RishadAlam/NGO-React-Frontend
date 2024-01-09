import { useTranslation } from 'react-i18next'
import tsNumbers from '../../libs/tsNumbers'

export default function Address({ address = {} }) {
  const { t } = useTranslation()

  return (
    <>
      <p className="truncate mb-3">
        {t('common.street_address')}:
        <span className="float-end fw-medium">{address?.street_address}</span>
      </p>
      <p className="truncate mb-3">
        {t('common.city')}:<span className="float-end fw-medium">{address?.city}</span>
      </p>
      <p className="truncate mb-3">
        {t('common.word_no')}:
        <span className="float-end fw-medium">
          {address?.word_no && tsNumbers(address?.word_no)}
        </span>
      </p>
      <p className="truncate mb-3">
        {t('common.post_office')}:
        <span className="float-end fw-medium">{address?.post_office}</span>
      </p>
      <p className="truncate mb-3">
        {t('common.police_station')}:
        <span className="float-end fw-medium">{address?.police_station}</span>
      </p>
      <p className="truncate mb-3">
        {t('common.district')}:<span className="float-end fw-medium">{address?.district}</span>
      </p>
      <p className="truncate mb-3">
        {t('common.division')}:<span className="float-end fw-medium">{address?.division}</span>
      </p>
    </>
  )
}
