import { Tooltip as MaterialTooltip, Zoom } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import useFetch from '../../hooks/useFetch'
import dateFormat from '../../libs/dateFormat'
import tsNumbers from '../../libs/tsNumbers'
import './cards.scss'

export default function Cards({ cardIcon, cardName, color, endpoint }) {
  const { t } = useTranslation()

  const {
    data: { data: { current_amount = 0, last_amount = 0, data = [], cmp_amount = 0 } = {} } = []
  } = useFetch({
    action: endpoint
  })

  return (
    <div className="cardBox">
      <div className="boxInfo">
        <div className="title">
          {cardIcon}
          <span>{cardName}</span>
        </div>
        <h1>৳ {tsNumbers(current_amount)}</h1>
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
          <MaterialTooltip
            TransitionComponent={Zoom}
            title={
              <>
                <p>{`${t('common.last_month')} : ৳${tsNumbers(last_amount || 0)}`}</p>
                <p>{`${t('common.this_month')} : ৳${tsNumbers(current_amount || 0)}`}</p>
              </>
            }
            arrow
            followCursor>
            <span className="percentage" style={{ color: cmp_amount < 0 ? 'tomato' : 'limegreen' }}>
              {tsNumbers(cmp_amount || 0)}%
            </span>
            <br />
            <span className="duration">{t('dashboard.cards.this_month')}</span>
          </MaterialTooltip>
        </div>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <p className="label">{`${tsNumbers(dateFormat(label, 'dd/MM/yyyy'))} : ৳${tsNumbers(payload[0].value)}`}</p>
    )
  }

  return null
}
