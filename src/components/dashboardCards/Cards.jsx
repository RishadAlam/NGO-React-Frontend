import { Link } from 'react-router-dom'
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts'
import './cards.scss'

export default function Cards({ cardIcon, cardName, amount, compAmount, color, t }) {
  const chartData = [
    { name: 'Sun', users: 400 },
    { name: 'Mon', users: 600 },
    { name: 'Tue', users: 500 },
    { name: 'Wed', users: 700 },
    { name: 'Thu', users: 400 },
    { name: 'Fri', users: 500 },
    { name: 'Sat', users: 450 }
  ]

  return (
    <div className="cardBox">
      <div className="boxInfo">
        <div className="title">
          {cardIcon}
          <span>{cardName}</span>
        </div>
        <h1>৳ {amount}</h1>
        <Link to="/">{t('dashboard.cards.View_all')}</Link>
      </div>
      <div className="cardInfo">
        <div className="chart">
          <ResponsiveContainer width="99%" height="100%">
            <LineChart data={chartData}>
              <Tooltip
                contentStyle={{ background: 'transparent', border: 'none' }}
                labelStyle={{ display: 'none' }}
                position={{ x: 10, y: 70 }}
              />
              <Line type="monotone" dataKey="users" stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="texts">
          <span className="percentage" style={{ color: compAmount < 0 ? 'tomato' : 'limegreen' }}>
            {compAmount}%
          </span>
          <span className="duration">{t('dashboard.cards.this_month')}</span>
        </div>
      </div>
    </div>
  )
}