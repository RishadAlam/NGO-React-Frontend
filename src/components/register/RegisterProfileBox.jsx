import { useTranslation } from 'react-i18next'
import tsNumbers from '../../libs/tsNumbers'

export default function RegisterProfileBox({ image_uri, name, acc_no }) {
  const { t } = useTranslation()

  return (
    <div className="d-flex h-100 w-100 align-items-center justify-content-center">
      <div className="image-preview border shadow rounded-4 p-2">
        <div className="img" style={{ width: '180px', height: '180px' }}>
          <img
            className="rounded-2"
            alt="image"
            src={image_uri}
            style={{ width: 'inherit', height: 'inherit', objectFit: 'cover' }}
            loading="lazy"
          />
        </div>
      </div>
      <div className="ms-3">
        <div className="truncate text-wrap fw-medium ln-hight">
          <b>{name}</b>
        </div>
        <div className="truncate text-wrap fw-medium ln-hight">
          <b>{t('common.acc_no')}:</b> {tsNumbers(acc_no)}
        </div>
      </div>
    </div>
  )
}
