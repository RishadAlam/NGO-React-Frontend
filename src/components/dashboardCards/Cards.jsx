import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import useFetch from '../../hooks/useFetch'
import dateFormat from '../../libs/dateFormat'
import tsNumbers from '../../libs/tsNumbers'
import './cards.scss'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <p className="label">{`${tsNumbers(dateFormat(label, 'dd/MM/yyyy'))} : ৳${tsNumbers(payload[0].value)}`}</p>
    )
  }

  return null
}

export default function Cards({ cardIcon, cardName, color }) {
  const { t } = useTranslation()

  const { data: { data: { amount = 0, data = 0, cmp_amount = 0 } = {} } = [] } = useFetch({
    action: 'client/registration/loan/current-month-summary'
  })

  return (
    <div className="cardBox">
      <div className="boxInfo">
        <div className="title">
          {cardIcon}
          <span>{cardName}</span>
        </div>
        <h1>৳ {tsNumbers(amount)}</h1>
        <Link to="/">{t('dashboard.cards.View_all')}</Link>
      </div>
      <div className="cardInfo">
        <div className="chart">
          <ResponsiveContainer width="99%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" hide={true} />
              <Tooltip
                contentStyle={{ background: 'transparent', border: 'none' }}
                labelStyle={{ display: 'none' }}
                position={{ x: 10, y: 70 }}
                content={<CustomTooltip />}
              />
              <Line type="monotone" dataKey="amount" stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="texts">
          <span className="percentage" style={{ color: cmp_amount < 0 ? 'tomato' : 'limegreen' }}>
            {tsNumbers(Math.abs(cmp_amount) || 0)}%
          </span>
          <span className="duration">{t('dashboard.cards.this_month')}</span>
        </div>
      </div>
    </div>
  )
}
