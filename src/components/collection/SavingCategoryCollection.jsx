import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import ReactTable from '../../components/utilities/tables/ReactTable'
import Folder from '../../icons/Folder'
import { CategoryCollectionReportTableColumns } from '../../resources/staticData/tableColumns'
// import '../staffs/staffs.scss'

export default function SavingCategoryCollection({ data = [], loading }) {
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
    () => CategoryCollectionReportTableColumns(t, windowWidth, actionBtnGroup),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth, loading]
  )

  return (
    <>
      <div className="staff-table">
        {loading && !data ? (
          <ReactTableSkeleton />
        ) : (
          <ReactTable title={t('center.Center_List')} columns={columns} data={data} footer={true} />
        )}
      </div>
    </>
  )
}
