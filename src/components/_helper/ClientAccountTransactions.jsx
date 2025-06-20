import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import Badge from '../../components/utilities/Badge'
import useFetch from '../../hooks/useFetch'
import decodeHTMLs from '../../libs/decodeHTMLs'
import getCurrentMonth from '../../libs/getCurrentMonth'
import { ClientAccTransactionStatementsTableColumn } from '../../resources/staticData/tableColumns'
import ReactTableSkeleton from '../loaders/skeleton/ReactTableSkeleton'
import DateRangePickerInputField from '../utilities/DateRangePickerInputField'
import ReactTable from '../utilities/tables/ReactTable'

export default function ClientAccountTransactions({ accountType }) {
  const { id } = useParams()
  const [dateRange, setDateRange] = useState(getCurrentMonth())
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const {
    data: { data } = [],
    mutate,
    isLoading
  } = useFetch({
    action: `transactions/${accountType}/${id}`,
    queryParams: { date_range: JSON.stringify(dateRange) }
  })

  const setTransactionTypes = (value) => {
    let className = 'bg-success'

    if (value === 'checked') {
      className = 'bg-primary'
    } else if (value === 'debit') {
      className = 'bg-danger'
    }

    return <Badge name={t(`common.${value}`)} className={className} />
  }

  const columns = useMemo(
    () =>
      ClientAccTransactionStatementsTableColumn(t, windowWidth, decodeHTMLs, setTransactionTypes),
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
            title={t('account_transaction.Transaction_List')}
            columns={columns}
            data={data}
          />
        )}
      </div>
    </>
  )
}
