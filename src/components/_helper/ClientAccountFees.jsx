import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import useFetch from '../../hooks/useFetch'
import decodeHTMLs from '../../libs/decodeHTMLs'
import getCurrentMonth from '../../libs/getCurrentMonth'
import { ClientAccFeesStatementsTableColumn } from '../../resources/staticData/tableColumns'
import ReactTableSkeleton from '../loaders/skeleton/ReactTableSkeleton'
import DateRangePickerInputField from '../utilities/DateRangePickerInputField'
import ReactTable from '../utilities/tables/ReactTable'

export default function ClientAccountFees({ accountType }) {
  const { id } = useParams()
  const [dateRange, setDateRange] = useState(getCurrentMonth())
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const {
    data: { data } = [],
    mutate,
    isLoading
  } = useFetch({
    action: `client/fees/${accountType}`,
    queryParams: { [`${accountType}_account_id`]: id, date_range: JSON.stringify(dateRange) }
  })

  const columns = useMemo(
    () => ClientAccFeesStatementsTableColumn(t, windowWidth, decodeHTMLs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth]
  )

  const setDateRangeField = (dateRanges) => {
    if (dateRanges !== null) {
      setDateRange([new Date(dateRanges[0]), new Date(dateRanges[1])])
      mutate()
    }
  }

  return (
    <>
      <div className="text-end my-3">
        <DateRangePickerInputField defaultValue={dateRange} setChange={setDateRangeField} />
      </div>
      <div className="staff-table">
        {isLoading && !data ? (
          <ReactTableSkeleton />
        ) : (
          <ReactTable
            title={`${t('common.fee_collections')} ${t('common.list')}`}
            columns={columns}
            data={data}
          />
        )}
      </div>
    </>
  )
}
