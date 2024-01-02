import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import Folder from '../../icons/Folder'
import '../../pages/staffs/staffs.scss'
import {
  CategoryCollectionReportTableColumns,
  FieldCollectionReportTableColumns
} from '../../resources/staticData/tableColumns'
import ReactTableSkeleton from '../loaders/skeleton/ReactTableSkeleton'
import ActionBtnGroup from '../utilities/ActionBtnGroup'
import ReactTable from '../utilities/tables/ReactTable'

export default function SavingCollectionReport({ data = [], loading, step = 1 }) {
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
      step === 1
        ? CategoryCollectionReportTableColumns(t, windowWidth, actionBtnGroup)
        : FieldCollectionReportTableColumns(t, windowWidth, actionBtnGroup),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, step, windowWidth, loading]
  )

  return (
    <>
      <div className="staff-table">
        {loading ? (
          <ReactTableSkeleton />
        ) : (
          <ReactTable
            title={
              (step === 1 ? t('common.category') : t('common.field')) +
              ' ' +
              t('menu.collection.Saving_Collection')
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
