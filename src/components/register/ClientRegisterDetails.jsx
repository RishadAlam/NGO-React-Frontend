import { useTranslation } from 'react-i18next'
import dateFormat from '../../libs/dateFormat'
import tsNumbers from '../../libs/tsNumbers'
import SignaturePlaceholder from '../../resources/img/SignaturePlaceholder.png'
import Address from './Address'
import CRDButtonGrp from './CRDButtonGrp'
import RegisterBox from './RegisterBox'

export default function ClientRegisterDetails({ data = {}, mutate }) {
  const { t } = useTranslation()

  return (
    <RegisterBox className="rounded-top-2 shadow rounded-4">
      <div>
        <div className="p-2 pt-0 border-bottom">
          <h5 className="fw-medium">
            <b>{`${data?.name || ''} ${t('common.register_account')}`}</b>
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
                  {t('common.religion')}:
                  <span className="float-end fw-medium">{data?.religion}</span>
                </p>
                <p className="truncate mb-3">
                  {t('common.occupation')}:
                  <span className="float-end fw-medium">{data?.occupation}</span>
                </p>
              </div>
              <div className="col-md-4">
                <p className="truncate mb-3">
                  {t('common.annual_income')}:
                  <span className="float-end fw-medium">
                    {data?.annual_income && tsNumbers(data?.annual_income)}
                  </span>
                </p>
                <p className="truncate mb-3">
                  {t('common.bank_acc_no')}:
                  <span className="float-end fw-medium">
                    {data?.bank_acc_no && tsNumbers(data?.bank_acc_no)}
                  </span>
                </p>
                <p className="truncate mb-3">
                  {t('common.bank_check_no')}:
                  <span className="float-end fw-medium">
                    {data?.bank_check_no && tsNumbers(data?.bank_check_no)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="py-4 border-bottom">
          <div className="px-2">
            <div className="row">
              <div className="col-md-4">
                <h5 className="pb-3 fw-medium">
                  <b>{t('common.present_address')}</b>
                </h5>
                <Address address={data?.present_address} />
              </div>
              <div className="col-md-4 middle-column">
                <h5 className="pb-3 fw-medium">
                  <b>{t('common.permanent_address')}</b>
                </h5>
                <Address address={data?.permanent_address} />
              </div>
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
        <CRDButtonGrp data={data} mutate={mutate} />
      </div>
    </RegisterBox>
  )
}
