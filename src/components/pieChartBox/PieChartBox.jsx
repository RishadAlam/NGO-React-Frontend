import { useTranslation } from 'react-i18next'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { defaultNameCheck } from '../../helper/defaultNameCheck'
import tsNumbers from '../../libs/tsNumbers'
import { colors } from '../../resources/staticData/colors'
import PieChartSkeleton from '../loaders/skeleton/PieChartSkeleton'
import './pieChartBox.scss'

export default function PieChartBox({ chartName, sources = [], isLoading }) {
  const { t } = useTranslation()
  const processedData = sources.map((item) => ({
    ...item,
    amount: parseFloat(item.amount)
  }))

  return (
    <>
      {isLoading ? (
        <PieChartSkeleton />
      ) : (
        <div className="pieChartBox">
          <div className="card">
            <div className="card-header">
              <h1>{chartName}</h1>
            </div>
            <div className="card-body">
              {!processedData.length && (
                <div className="d-flex align-items-center justify-content-center">
                  <p>{t('common.No_Records_Found')}</p>
                </div>
              )}
              <div className="chart">
                <ResponsiveContainer width="99%" height={300}>
                  <PieChart>
                    <Tooltip
                      contentStyle={{ background: 'white', borderRadius: '5px' }}
                      content={<CustomTooltip t={t} />}
                    />
                    <Pie
                      data={processedData}
                      innerRadius={'70%'}
                      outerRadius={'90%'}
                      paddingAngle={5}
                      dataKey="amount">
                      {processedData.map((item, index) => (
                        <Cell key={item.name} fill={colors[index].hex} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="options d-flex flex-wrap">
                {processedData.map((item, index) => (
                  <div className="option" key={index}>
                    <div className="title">
                      <div className="dot" style={{ backgroundColor: colors[index].hex }} />
                      <span>
                        {defaultNameCheck(t, item.is_default, 'category.default.', item.name)}
                      </span>
                    </div>
                    <span>৳ {tsNumbers(item.amount || 0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const CustomTooltip = ({ active, payload, t }) => {
  if (active && payload && payload.length) {
    return (
      <p className="label">{`${defaultNameCheck(t, payload[0].payload.is_default, 'category.default.', payload[0].payload.name)} : ৳${tsNumbers(payload[0].value)}`}</p>
    )
  }

  return null
}
