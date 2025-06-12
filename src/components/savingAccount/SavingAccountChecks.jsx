import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import useFetch from '../../hooks/useFetch'
import decodeHTMLs from '../../libs/decodeHTMLs'
import getCurrentMonth from '../../libs/getCurrentMonth'
import { SavingAccChecksStatementsTableColumn } from '../../resources/staticData/tableColumns'
import ReactTableSkeleton from '../loaders/skeleton/ReactTableSkeleton'
import DateRangePickerInputField from '../utilities/DateRangePickerInputField'
import ReactTable from '../utilities/tables/ReactTable'

export default function SavingAccountChecks() {
  const { id } = useParams()
  const [dateRange, setDateRange] = useState(getCurrentMonth())
  const { t } = useTranslation()
  const { permissions: authPermissions } = useAuthDataValue()
  const windowWidth = useWindowInnerWidthValue()
  const { data: { data: collection } = [], isLoading } = useFetch({
    action: 'saving/check',
    queryParams: { saving_account_id: id }
  })

  const columns = useMemo(
    () => SavingAccChecksStatementsTableColumn(t, windowWidth, decodeHTMLs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth]
  )

  const setDateRangeField = (dateRanges) => {
    if (dateRanges !== null) {
      setDateRange([new Date(dateRanges[0]), new Date(dateRanges[1])])
      // mutate()
    }
  }

  return (
    <>
      <div className="text-end my-3">
        <DateRangePickerInputField defaultValue={dateRange} setChange={setDateRangeField} />
      </div>
      <div className="staff-table">
        {isLoading && !collection ? (
          <ReactTableSkeleton />
        ) : (
          <ReactTable
            title={`${t('common.account_check')} ${t('common.list')}`}
            columns={columns}
            data={collection}
          />
        )}
      </div>
    </>
  )
}
