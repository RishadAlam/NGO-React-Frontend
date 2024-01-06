import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import Folder from '../../icons/Folder'
import '../../pages/staffs/staffs.scss'
import {
  CategoryCollectionLoanReportTableColumns,
  FieldCollectionLoanReportTableColumns
} from '../../resources/staticData/tableColumns'
import ReactTableSkeleton from '../loaders/skeleton/ReactTableSkeleton'
import ActionBtnGroup from '../utilities/ActionBtnGroup'
import ReactTable from '../utilities/tables/ReactTable'

export default function LoanCollectionReport({ data = [], loading, hasCategoryId = false }) {
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const navigate = useNavigate()

  const actionBtnGroup = (id) => (
    <ActionBtnGroup>
      <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
        <IconButton className="text-warning" onClick={() => navigate(`${id}`)}>
          {<Folder size={20} />}
        </IconButton>
      </Tooltip>
    </ActionBtnGroup>
  )

  const columns = useMemo(
    () =>
      !hasCategoryId
        ? CategoryCollectionLoanReportTableColumns(t, windowWidth, actionBtnGroup)
        : FieldCollectionLoanReportTableColumns(t, windowWidth, actionBtnGroup),
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
          />
        )}
      </div>
    </>
  )
}
