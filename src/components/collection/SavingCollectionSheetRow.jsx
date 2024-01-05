import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { create } from 'mutative'
import { memo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import { checkPermission, checkPermissions } from '../../helper/checkPermission'
import { defaultNameCheck } from '../../helper/defaultNameCheck'
import { permanentDeleteAlert } from '../../helper/deleteAlert'
import { isEmptyObject } from '../../helper/isEmptyObject'
import Edit from '../../icons/Edit'
import Trash from '../../icons/Trash'
import dateFormat from '../../libs/dateFormat'
import decodeHTMLs from '../../libs/decodeHTMLs'
import tsNumbers from '../../libs/tsNumbers'
import xFetch from '../../utilities/xFetch'
import ActionBtnGroup from '../utilities/ActionBtnGroup'
import Avatar from '../utilities/Avatar'
import SavingCollectionModal from './SavingCollectionModal'

function SavingCollectionSheetRow({
  columnList,
  index,
  collectionIndex,
  account,
  mutate,
  collection = {}
}) {
  const { t } = useTranslation()
  const isSingleCollection =
    (account?.saving_collection?.length > 1 && !collectionIndex) ||
    account?.saving_collection?.length === 1 ||
    !account?.saving_collection?.length
      ? true
      : false
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
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

  const actionBtnGroup = (collection, account) => (
    <ActionBtnGroup>
      {((!isEmptyObject(collection) &&
        checkPermission('permission_to_do_saving_collection', authPermissions)) ||
        (isEmptyObject(collection) &&
          checkPermission('regular_saving_collection_update', authPermissions))) && (
        <Tooltip TransitionComponent={Zoom} title={t('common.edit')} arrow followCursor>
          <IconButton className="text-warning" onClick={() => collectionEdit(collection, account)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {!isEmptyObject(collection) &&
        checkPermission('regular_saving_collection_permanently_delete', authPermissions) && (
          <Tooltip
            TransitionComponent={Zoom}
            title={t('common.delete')}
            arrow
            followCursor
            disabled={loading?.collectionDelete || false}>
            <IconButton
              className="text-danger"
              onClick={() => collection?.id && collectionDelete(collection?.id)}>
              {<Trash size={20} />}
            </IconButton>
          </Tooltip>
        )}
    </ActionBtnGroup>
  )

  const collectionEdit = (collection, account) => {
    setCollectionData((prevData) =>
      create(prevData, (draftData) => {
        draftData.saving_account_id = account.id
        draftData.field_id = account.field_id
        draftData.center_id = account.center_id
        draftData.category_id = account.category_id
        draftData.client_registration_id = account.client_registration_id
        draftData.acc_no = account.acc_no
        draftData.name = account.client_registration.name
        draftData.deposit = account.payable_deposit
        draftData.payable_deposit = account.payable_deposit

        if (!isEmptyObject(collection)) {
          draftData.newCollection = false
          draftData.collection_id = collection.id
          draftData.account_id = collection.account_id
          draftData.installment = collection.installment
          draftData.deposit = collection.deposit
          draftData.description = collection.description
        }
      })
    )
    setOpenCollectionModal(true)
  }

  const collectionDelete = (id) => {
    permanentDeleteAlert(t).then((result) => {
      if (result.isConfirmed) {
        const toasterLoading = toast.loading(`${t('common.delete')}...`)
        setLoading({ ...loading, collectionDelete: true })
        xFetch(`collection/saving/force-delete/${id}`, null, null, accessToken, null, 'DELETE')
          .then((response) => {
            toast.dismiss(toasterLoading)
            setLoading({ ...loading, collectionDelete: false })
            if (response?.success) {
              toast.success(response?.message)
              mutate()
              return
            }
            toast.error(response?.message)
          })
          .catch((errResponse) => {
            toast.error(errResponse?.message)
            setLoading({ ...loading, collectionDelete: false })
          })
      }
    })
  }

  const collectionModal = () => (
    <SavingCollectionModal
      open={openCollectionModal}
      setOpen={setOpenCollectionModal}
      collectionData={collectionData}
      mutate={mutate}
    />
  )

  return (
    <tr>
      <td className={`${!columnList['#'] ? 'd-none' : ''}`}>
        {isSingleCollection && tsNumbers((index + 1).toString().padStart(2, '0'))}
      </td>
      <td className={`${!columnList.image ? 'd-none' : ''}`}>
        {isSingleCollection && (
          <Avatar
            name={account?.client_registration?.name}
            img={account?.client_registration?.image_uri}
          />
        )}
      </td>
      <td className={`${!columnList.name ? 'd-none' : ''}`}>
        {isSingleCollection && account?.client_registration?.name}
      </td>
      <td className={`${!columnList.acc_no ? 'd-none' : ''}`}>
        {isSingleCollection && tsNumbers(account?.acc_no)}
      </td>
      <td className={`${!columnList.account ? 'd-none' : ''}`}>
        {defaultNameCheck(
          t,
          collection?.account?.is_default,
          'account.default.',
          collection?.account?.name
        )}
      </td>
      <td className={`${!columnList.installment ? 'd-none' : ''}`}>
        {collection?.installment && tsNumbers(collection?.installment)}
      </td>
      <td className={`${!columnList.description ? 'd-none' : ''}`}>
        <span>{decodeHTMLs(collection?.description)}</span>
      </td>
      <td className={`${!columnList.deposit ? 'd-none' : ''}`}>
        {collection?.deposit && tsNumbers(`$${collection?.deposit}/-`)}
      </td>
      <td className={`${!columnList.creator ? 'd-none' : ''}`}>{collection?.author?.name}</td>
      <td className={`${!columnList.time ? 'd-none' : ''}`}>
        {collection?.created_at &&
          tsNumbers(dateFormat(collection?.created_at, 'dd/MM/yyyy hh:mm a'))}
      </td>
      <td className={`${!columnList.action ? 'd-none' : ''}`}>
        {actionBtnGroup(collection, account)}
        {checkPermissions(
          ['permission_to_do_saving_collection', 'regular_saving_collection_update'],
          authPermissions
        ) && collectionModal()}
      </td>
    </tr>
  )
}

export default memo(SavingCollectionSheetRow)
