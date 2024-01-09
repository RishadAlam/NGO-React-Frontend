import { useTranslation } from 'react-i18next'
import dateFormat from '../../libs/dateFormat'
import tsNumbers from '../../libs/tsNumbers'
import SignaturePlaceholder from '../../resources/img/SignaturePlaceholder.png'
import UserPlaceholder from '../../resources/img/UserPlaceholder.jpg'
import Address from './Address'

export default function NomsDetails({ data = [], index = 0 }) {
  const { t } = useTranslation()

  return (
    <div>
      <div className="p-2 pt-0 border-bottom">
        <h5 className="fw-medium">
          <b>{`${t('common.nominee')} - ${tsNumbers((index + 1).toString().padStart(2, '0'))}`}</b>
        </h5>
      </div>
      <div className="py-4 border-bottom">
        <div className="px-2">
          <div className="row">
            <div className="col-md-4">
              <p className="truncate mb-3">
                {t('common.name')}:<span className="float-end fw-medium">{data?.name}</span>
              </p>
              <p className="truncate mb-3">
                {t('common.father_name')}:
                <span className="float-end fw-medium">{data?.father_name}</span>
              </p>
              <p className="truncate mb-3">
                {t('common.husband_name')}:
                <span className="float-end fw-medium">{data?.husband_name}</span>
              </p>
              <p className="truncate mb-3">
                {t('common.mother_name')}:
                <span className="float-end fw-medium">{data?.mother_name}</span>
              </p>
              <p className="truncate mb-3">
                {t('common.primary_phone')}:
                <span className="float-end fw-medium">
                  {data?.primary_phone && tsNumbers(data?.primary_phone)}
                </span>
              </p>
              <p className="truncate mb-3">
                {t('common.secondary_phone')}:
                <span className="float-end fw-medium">
                  {data?.secondary_phone && tsNumbers(data?.secondary_phone)}
                </span>
              </p>
            </div>
            <div className="col-md-4 middle-column">
              <p className="truncate mb-3">
                {t('common.nid')}:
                <span className="float-end fw-medium">{data?.nid && tsNumbers(data?.nid)}</span>
              </p>
              <p className="truncate mb-3">
                {t('common.dob')}:
                <span className="float-end fw-medium">
                  {data?.dob && tsNumbers(dateFormat(data?.dob, 'dd/MM/yyyy'))}
                </span>
              </p>
              <p className="truncate mb-3">
                {t('common.gender')}:<span className="float-end fw-medium">{data?.gender}</span>
              </p>
              <p className="truncate mb-3">
                {t('common.occupation')}:
                <span className="float-end fw-medium">{data?.occupation}</span>
              </p>
              <p className="truncate mb-3">
                {t('common.relation')}:<span className="float-end fw-medium">{data?.relation}</span>
              </p>
            </div>
            <div className="col-md-4">
              <div className="d-flex h-100 w-100 align-items-center justify-content-center">
                <div className="image-preview border shadow rounded-4 p-2">
                  <div className="img" style={{ width: '180px', height: '180px' }}>
                    <img
                      className="rounded-2"
                      alt="image"
                      src={data?.image_uri || UserPlaceholder}
                      style={{ width: 'inherit', height: 'inherit', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-4">
        <div className="px-2">
          <div className="row">
            <div className="col-md-4">
              <h5 className="pb-3 fw-medium">
                <b>{t('common.address')}</b>
              </h5>
              <Address address={data?.address} />
            </div>
            <div className="col-md-4 middle-column"></div>
            <div className="col-md-4">
              <h5 className="fw-medium">
                <b>{t('common.signature')}</b>
              </h5>
              <div className="d-flex h-100 w-100 align-items-center justify-content-center">
                <div className="image-preview border shadow rounded-4 p-2">
                  <div
                    className="img"
                    style={{ width: '250px', height: '180px', objectFit: 'cover' }}>
                    <img
                      className="rounded-2"
                      alt="image"
                      src={data?.signature_uri || SignaturePlaceholder}
                      style={{ width: 'inherit', height: 'inherit', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
