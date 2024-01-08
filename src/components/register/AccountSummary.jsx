import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CheckCircle from '../../icons/CheckCircle'
import Chrome from '../../icons/Chrome'
import Dollar from '../../icons/Dollar'
import Edit from '../../icons/Edit'
import Globe from '../../icons/Globe'
import Pen from '../../icons/Pen'
import Phone from '../../icons/Phone'
import User from '../../icons/User'
import dateFormat from '../../libs/dateFormat'
import tsNumbers from '../../libs/tsNumbers'
import CountedAccount from './CountedAccount'
import DetailsSummary from './DetailsSummary'
import RegisterProfileBox from './RegisterProfileBox'

export default function AccountSummary({ data }) {
  const { t } = useTranslation()
  const [detailsSummary, setDetailsSummary] = useState([])

  useEffect(() => {
    setDetailsSummary([
      { key: 'field', value: data?.field?.name, icon: <Globe size={18} /> },
      { key: 'center', value: data?.center?.name, icon: <Chrome size={18} /> },
      { key: 'creator', value: data?.author?.name, icon: <User size={18} /> },
      {
        key: 'registration',
        value: data?.created_at && tsNumbers(dateFormat(data?.created_at, 'dd/MM/yyyy hh:mm a')),
        icon: <Pen size={18} />
      },
      { key: 'approver', value: data?.approver?.name, icon: <CheckCircle size={18} /> },
      {
        key: 'nid',
        value: data?.nid && tsNumbers(data?.nid),
        icon: <Edit size={18} />
      },
      {
        key: 'primary_phone',
        value: data?.primary_phone && tsNumbers(data?.primary_phone),
        icon: <Phone size={18} />
      },
      { key: 'share', value: `৳${tsNumbers(data?.share || 0)}/-`, icon: <Dollar size={18} /> }
    ])
  }, [data, t])

  return (
    <div className="row pb-3 mt-2">
      <div className="col-md-4 d-flex">
        <RegisterProfileBox image_uri={data?.image_uri} name={data?.name} acc_no={data?.acc_no} />
      </div>
      <div className="col-md-4">
        <DetailsSummary data={detailsSummary} />
      </div>
      <div className="col-md-4 d-flex">
        <CountedAccount />
      </div>
    </div>
  )
}
