import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

export default function DetailsSummary({ data = [], isMiddle = false }) {
  const { t } = useTranslation()

  return (
    <div className={`px-3 ${isMiddle && 'middle-column'}`}>
      <div className="truncate fw-medium">
        <b>{t('common.details_summary')}</b>
      </div>
      <div className="d-flex flex-column justify-content-center mt-3">
        {data.map((row, index) => (
          <Fragment key={index}>
            <div className="truncate text-wrap my-1 d-flex align-items-center">
              <span className="me-2">{row.icon}</span>
              <b className="me-2 ln-hight">{t(`common.${row?.key}`)}:</b>
              {row?.value}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
