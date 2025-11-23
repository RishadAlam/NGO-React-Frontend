import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import { defaultNameCheck } from '../../helper/defaultNameCheck'
import useFetch from '../../hooks/useFetch'
import decodeHTMLs from '../../libs/decodeHTMLs'
import getCurrentMonth from '../../libs/getCurrentMonth'
import tsNumbers from '../../libs/tsNumbers'
import { transactionStatementsTableColumn } from '../../resources/staticData/tableColumns'
import ReactTableSkeleton from '../loaders/skeleton/ReactTableSkeleton'
import Badge from '../utilities/Badge'
import DateRangePickerInputField from '../utilities/DateRangePickerInputField'
import ReactTable from '../utilities/tables/ReactTable'

export default function ListOfTransactions({ accountType }) {
  const { id } = useParams()
  const [dateRange, setDateRange] = useState(getCurrentMonth())
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const {
    data: { data } = [],
    mutate,
    isLoading
  } = useFetch({
    action: `transactions/approved-transactions/${id}/${accountType}`,
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

  const account = (row) => {
    if (row?.original?.tx_acc_id === id) {
      return prepareAccount(row?.original?.rx_account, t)
    } else {
      return prepareAccount(row?.original?.tx_account, t)
    }
  }

  const columns = useMemo(
    () =>
      transactionStatementsTableColumn(t, windowWidth, account, decodeHTMLs, setTransactionTypes),
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

const prepareAccount = (account, t) => `
        ${account?.client_registration?.name || ''} 
        (${tsNumbers(account?.client_registration?.acc_no || 0)})
        (${defaultNameCheck(t, account?.category?.is_default, 'category.default.', account?.category?.name)})
        `
