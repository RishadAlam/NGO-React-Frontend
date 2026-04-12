import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import '../../pages/staffs/staffs.scss'
import {
  CategoryCollectionLoanReportTableColumns,
  FieldCollectionLoanReportTableColumns
} from '../../resources/staticData/tableColumns'
import ReactTableSkeleton from '../loaders/skeleton/ReactTableSkeleton'
import ReactTable from '../utilities/tables/ReactTable'

export default function LoanCollectionReport({ data = [], loading, hasCategoryId = false }) {
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const columns = useMemo(
    () =>
      !hasCategoryId
        ? CategoryCollectionLoanReportTableColumns(t, windowWidth)
        : FieldCollectionLoanReportTableColumns(t, windowWidth),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, hasCategoryId, windowWidth, loading]
  )

  return (
    <>
      <div className="staff-table">
        {loading ? (
          <ReactTableSkeleton />
        ) : (
          <ReactTable
            title={
              t(`common.${!hasCategoryId ? 'category' : 'field'}`) +
              ' ' +
              t('menu.collection.Loan_Collection')
            }
            columns={columns}
            data={data}
            footer={true}
            rowLinkPath="."
            rowLinkPrefix="id"
          />
        )}
      </div>
    </>
  )
}
