import { Tooltip as MaterialTooltip, Zoom } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import ChevronDown from '../../icons/ChevronDown'
import ChevronUp from '../../icons/ChevronUp'
import dateFormat from '../../libs/dateFormat'
import tsNumbers from '../../libs/tsNumbers'
import CardSkeleton from '../loaders/skeleton/CardSkeleton'
import './cards.scss'

export default function Cards({ cardIcon, cardName, color, itemData, isLoading, viewAllPath = '/' }) {
  const { t } = useTranslation()
  const { current_amount = 0, last_amount = 0, data = [], cmp_amount = 0 } = itemData
  const isPositive = cmp_amount >= 0

  return (
    <>
      {isLoading ? (
        <CardSkeleton />
      ) : (
        <div className="cardBox">
          <div className="cardBox__header">
            <div className="cardBox__icon-title">
              <span className="iconWrap">{cardIcon}</span>
              <span className="titleText">{cardName}</span>
            </div>
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
              <span className={`trendBadge ${isPositive ? 'trendBadge--up' : 'trendBadge--down'}`}>
                {isPositive ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                {tsNumbers(Math.abs(cmp_amount || 0))}%
              </span>
            </MaterialTooltip>
          </div>

          <div className="cardBox__amount">
            <span className="currency">৳</span>
            <span className="amount">{tsNumbers(current_amount)}</span>
          </div>

          <div className="cardBox__chart">
            <ResponsiveContainer width="99%" height={100}>
              <LineChart data={data}>
                <XAxis dataKey="date" hide={true} />
                <Tooltip
                  contentStyle={{ background: 'transparent', border: 'none' }}
                  labelStyle={{ display: 'none' }}
                  position={{ x: 10, y: 10 }}
                  content={<CustomTooltip />}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="cardBox__footer">
            <span className="period">{t('dashboard.cards.this_month')}</span>
            <Link className="viewAll" to={viewAllPath}>
              {t('dashboard.cards.View_all')} →
            </Link>
          </div>
        </div>
      )}
    </>
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
