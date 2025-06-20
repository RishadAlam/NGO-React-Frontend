import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { create } from 'mutative'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import ActionHistoryModal from '../../components/_helper/actionHistory/ActionHistoryModal'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import DateRangePickerInputField from '../../components/utilities/DateRangePickerInputField'
import ReactTable from '../../components/utilities/tables/ReactTable'
import { checkPermissions } from '../../helper/checkPermission'
import { collectionDelete } from '../../helper/collectionActions'
import useFetch from '../../hooks/useFetch'
import Edit from '../../icons/Edit'
import Eye from '../../icons/Eye'
import Trash from '../../icons/Trash'
import decodeHTMLs from '../../libs/decodeHTMLs'
import getCurrentMonth from '../../libs/getCurrentMonth'
import { SavingCollectionsStatementsTableColumn } from '../../resources/staticData/tableColumns'
import SavingCollectionModal from '../collection/SavingCollectionModal'
import ActionBtnGroup from '../utilities/ActionBtnGroup'

export default function SavingCollections() {
  const { id } = useParams()
  const [dateRange, setDateRange] = useState(getCurrentMonth())
  const [isActionHistoryModalOpen, setIsActionHistoryModalOpen] = useState(false)
  const [actionHistory, setActionHistory] = useState([])
  const [loading, setLoading] = useLoadingState({})
  const [openCollectionModal, setOpenCollectionModal] = useState(false)
  const [collectionData, setCollectionData] = useState({
    newCollection: true,
    collection_id: '',
    saving_account_id: '',
    field_id: '',
    center_id: '',
    category_id: '',
    client_registration_id: '',
    account_id: 1,
    acc_no: '',
    name: '',
    payable_deposit: '',
    installment: 1,
    deposit: '',
    description: ''
  })

  const { t } = useTranslation()
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const windowWidth = useWindowInnerWidthValue()
  const {
    data: { data: collections } = [],
    mutate,
    isLoading
  } = useFetch({
    action: 'collection/saving',
    queryParams: { saving_account_id: id, date_range: JSON.stringify(dateRange) }
  })

  const actionBtnGroup = (id, collection) => (
    <ActionBtnGroup>
      {authPermissions.includes('client_saving_account_collection_action_history') && (
        <Tooltip
          TransitionComponent={Zoom}
          title={t('common.action_history.action_history')}
          arrow
          followCursor>
          <IconButton
            className="text-primary"
            onClick={() => {
              setActionHistory(collection?.saving_collection_action_history || [])
              setIsActionHistoryModalOpen(true)
            }}>
            {<Eye size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('client_saving_account_collection_update') && (
        <Tooltip TransitionComponent={Zoom} title={t('common.edit')} arrow followCursor>
          <IconButton className="text-warning" onClick={() => collectionEdit(collection)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {authPermissions.includes('client_saving_account_collection_permanently_delete') && (
        <Tooltip
          TransitionComponent={Zoom}
          title={t('common.delete')}
          arrow
          followCursor
          disabled={loading?.collectionDelete || false}>
          <IconButton
            className="text-danger"
            onClick={() =>
              collectionDelete('saving', id, t, accessToken, mutate, loading, setLoading)
            }>
            {<Trash size={20} />}
          </IconButton>
        </Tooltip>
      )}
    </ActionBtnGroup>
  )

  const columns = useMemo(
    () =>
      SavingCollectionsStatementsTableColumn(
        t,
        windowWidth,
        decodeHTMLs,
        actionBtnGroup,
        !checkPermissions(
          [
            'client_saving_account_collection_action_history',
            'client_saving_account_collection_update',
            'client_saving_account_collection_permanently_delete'
          ],
          authPermissions
        )
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth]
  )

  const setDateRangeField = (dateRanges) => {
    if (dateRanges !== null) {
      setDateRange([new Date(dateRanges[0]), new Date(dateRanges[1])])
      mutate()
    }
  }

  const collectionEdit = (collection) => {
    setCollectionData((prevData) =>
      create(prevData, (draftData) => {
        draftData.newCollection = false
        draftData.saving_account_id = collection.id
        draftData.field_id = collection.field_id
        draftData.center_id = collection.center_id
        draftData.category_id = collection.category_id
        draftData.client_registration_id = collection.client_registration_id
        draftData.acc_no = collection.acc_no
        draftData.name = collection.client_registration.name
        draftData.deposit = collection.deposit
        draftData.payable_deposit = collection.saving_account.payable_deposit
        draftData.collection_id = collection.id
        draftData.account_id = collection.account_id
        draftData.installment = collection.installment
        draftData.description = collection.description
      })
    )
    setOpenCollectionModal(true)
  }

  return (
    <>
      {isActionHistoryModalOpen && (
        <ActionHistoryModal
          open={isActionHistoryModalOpen}
          setOpen={setIsActionHistoryModalOpen}
          actionHistory={actionHistory}
        />
      )}
      {openCollectionModal && (
        <SavingCollectionModal
          open={openCollectionModal}
          setOpen={setOpenCollectionModal}
          collectionData={collectionData}
          mutate={mutate}
          isRegular={false}
        />
      )}
      <div className="text-end my-3">
        <DateRangePickerInputField defaultValue={dateRange} setChange={setDateRangeField} />
      </div>
      <div className="staff-table">
        {isLoading && !collections ? (
          <ReactTableSkeleton />
        ) : (
          <ReactTable
            title={`${t('menu.label.regular_collection')} ${t('common.list')}`}
            columns={columns}
            data={collections}
          />
        )}
      </div>
    </>
  )
}
