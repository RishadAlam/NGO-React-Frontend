import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { defaultNameCheck } from '../../helper/defaultNameCheck'
import CheckCircle from '../../icons/CheckCircle'
import CheckPatch from '../../icons/CheckPatch'
import Chrome from '../../icons/Chrome'
import Command from '../../icons/Command'
import Globe from '../../icons/Globe'
import List from '../../icons/List'
import Pen from '../../icons/Pen'
import Phone from '../../icons/Phone'
import User from '../../icons/User'
import dateFormat from '../../libs/dateFormat'
import tsNumbers from '../../libs/tsNumbers'
import DetailsSummary from '../register/DetailsSummary'
import RegisterProfileBox from '../register/RegisterProfileBox'

export default function AccountSummary({ data }) {
  const { t } = useTranslation()
  const [detailsSummary, setDetailsSummary] = useState([])
  const [status, setStatus] = useState()
  const [classNames, setClassNames] = useState()

  useEffect(() => {
    if (data?.deleted_at) {
      setStatus(t('common.closed'))
      setClassNames('bg-secondary')
    } else {
      setStatus(
        data?.is_approved
          ? data?.status
            ? t('common.running')
            : t('common.hold')
          : t('common.pending')
      )

      setClassNames(data?.is_approved ? (data?.status ? 'bg-success' : 'bg-warning') : 'bg-danger')
    }
    setDetailsSummary([
      [
        { key: 'field', value: data?.field?.name, icon: <Globe size={18} /> },
        { key: 'center', value: data?.center?.name, icon: <Chrome size={18} /> },
        {
          key: 'category',
          value: defaultNameCheck(
            t,
            data?.category?.is_default,
            'category.default.',
            data?.category?.name
          ),
          icon: <Command size={18} />
        },
        { key: 'creator', value: data?.author?.name, icon: <User size={18} /> },
        {
          key: 'registration',
          value: data?.created_at && tsNumbers(dateFormat(data?.created_at, 'dd/MM/yyyy hh:mm a')),
          icon: <Pen size={18} />
        },
        { key: 'approver', value: data?.approver?.name, icon: <CheckCircle size={18} /> },
        {
          key: 'approved_at',
          value:
            data?.approved_at && tsNumbers(dateFormat(data?.approved_at, 'dd/MM/yyyy hh:mm a')),
          icon: <CheckPatch size={18} />
        },
        {
          key: 'primary_phone',
          value:
            data?.client_registration?.primary_phone &&
            tsNumbers(data?.client_registration?.primary_phone),
          icon: <Phone size={18} />
        }
      ],
      [
        {
          key: 'start_date',
          value: data?.start_date && tsNumbers(dateFormat(data?.start_date, 'dd/MM/yyyy')),
          icon: <List size={18} />
        },
        {
          key: 'duration_date',
          value: data?.duration_date && tsNumbers(dateFormat(data?.duration_date, 'dd/MM/yyyy')),
          icon: <List size={18} />
        },
        {
          key: 'total_installment',
          value: tsNumbers(data?.payable_installment || 0),
          icon: <List size={18} />
        },
        {
          key: 'deposit',
          value: tsNumbers(`$${data?.payable_deposit || 0}/-`),
          icon: <List size={18} />
        },
        {
          key: 'interest',
          value: tsNumbers(`${data?.payable_interest || 0}%`),
          icon: <List size={18} />
        },
        {
          key: 'total_deposit_without_interest',
          value: tsNumbers(`$${data?.total_deposit_without_interest || 0}/-`),
          icon: <List size={18} />
        },
        {
          key: 'total_deposit_with_interest',
          value: tsNumbers(`$${data?.total_deposit_with_interest || 0}/-`),
          icon: <List size={18} />
        }
      ]
    ])
  }, [data, t])

  return (
    <div className="row pb-3 mt-2">
      <div className="col-md-4 d-flex">
        <RegisterProfileBox
          image_uri={data?.client_registration?.image_uri}
          name={data?.client_registration?.name}
          acc_no={data?.acc_no}
          status={status}
          classNames={classNames}
        />
      </div>
      <div className="col-md-4 pe-0">
        <DetailsSummary data={detailsSummary[0]} isMiddle={true} />
      </div>
      <div className="col-md-4 px-0">
        <DetailsSummary data={detailsSummary[1]} />
      </div>
    </div>
  )
}
