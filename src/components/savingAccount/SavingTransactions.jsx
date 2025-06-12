import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import useFetch from '../../hooks/useFetch'
import Edit from '../../icons/Edit'
import Eye from '../../icons/Eye'
import Trash from '../../icons/Trash'
import decodeHTMLs from '../../libs/decodeHTMLs'
import getCurrentMonth from '../../libs/getCurrentMonth'
import { SavingCollectionsStatementsTableColumn } from '../../resources/staticData/tableColumns'
import ReactTableSkeleton from '../loaders/skeleton/ReactTableSkeleton'
import ActionBtnGroup from '../utilities/ActionBtnGroup'
import DateRangePickerInputField from '../utilities/DateRangePickerInputField'
import ReactTable from '../utilities/tables/ReactTable'

export default function SavingTransactions() {
  const { id } = useParams()
  const [dateRange, setDateRange] = useState(getCurrentMonth())
  const { t } = useTranslation()
  const { permissions: authPermissions } = useAuthDataValue()
  const windowWidth = useWindowInnerWidthValue()
  const { data: { data: collection } = [], isLoading } = useFetch({
    action: 'collection/saving',
    queryParams: { saving_account_id: id }
  })

  const actionBtnGroup = (id, profile) => (
    <ActionBtnGroup>
      {authPermissions.includes('pending_client_registration_list_view') && (
        <Tooltip TransitionComponent={Zoom} title="View" arrow followCursor>
          <IconButton className="text-primary" onClick={() => console.log(profile)}>
            {<Eye size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('pending_client_registration_update') && (
        <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
          <IconButton className="text-warning" onClick={() => console.log(profile)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('pending_client_registration_permanently_delete') && (
        <Tooltip TransitionComponent={Zoom} title="Delete" arrow followCursor>
          <IconButton className="text-danger" onClick={() => console.log(id)}>
            {<Trash size={20} />}
          </IconButton>
        </Tooltip>
      )}
    </ActionBtnGroup>
  )

  const columns = useMemo(
    () => SavingCollectionsStatementsTableColumn(t, windowWidth, decodeHTMLs, actionBtnGroup),
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
            title={t('account_transaction.Transaction_List')}
            columns={columns}
            data={collection}
          />
        )}
      </div>
    </>
  )
}
