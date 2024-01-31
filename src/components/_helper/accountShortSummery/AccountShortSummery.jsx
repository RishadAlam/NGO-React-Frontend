import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import useFetch from '../../../hooks/useFetch'
import dateFormat from '../../../libs/dateFormat'
import tsNumbers from '../../../libs/tsNumbers'
import RegisterBox from '../../register/RegisterBox'
import './style.scss'

export default function AccountShortSummery({ prefix }) {
  const { id } = useParams()
  const { t } = useTranslation()
  const { data: { data = [] } = [], isLoading } = useFetch({
    action: `client/registration/${prefix}/short-summery/${id}`
  })

  return (
    <div className="stm-summery text-center my-3">
      <div className="row w-100 mx-auto">
        {Object.keys(data).map((item, key) => (
          <div className="col-sm-4 col-xxl-3 my-2 px-2" key={key}>
            <RegisterBox className="cursor-pointer zoom-in rounded shadow rounded-2">
              <p className="ln-hight">{setItem(data[item], item)}</p>
              <b className="ln-hight">{t(`common.${item}`)}</b>
            </RegisterBox>
          </div>
        ))}
      </div>
    </div>
  )
}

const setItem = (value, name) => {
  if (name === 'last_check' || name === 'next_check') {
    return value ? tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a')) : '---'
  } else if (name === 'installment') {
    return value ? tsNumbers(value) : '---'
  } else {
    return value ? tsNumbers(`৳${value}/-`) : '---'
  }
}
