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
import { isEmpty } from '../../helper/isEmpty'
import { isEmptyObject } from '../../helper/isEmptyObject'
import Edit from '../../icons/Edit'
import Trash from '../../icons/Trash'
import dateFormat from '../../libs/dateFormat'
import decodeHTMLs from '../../libs/decodeHTMLs'
import tsNumbers from '../../libs/tsNumbers'
import xFetch from '../../utilities/xFetch'
import ActionBtnGroup from '../utilities/ActionBtnGroup'
import AndroidSwitch from '../utilities/AndroidSwitch'
import Avatar from '../utilities/Avatar'
import LoanCollectionModal from './LoanCollectionModal'

function LoanCollectionSheetRow({
  columnList,
  index,
  collectionIndex,
  account,
  mutate,
  collection = {},
  approvedList,
  setApprovedList
}) {
  const { t } = useTranslation()
  const isSingleCollection =
    (account?.loan_collection?.length > 1 && !collectionIndex) ||
    account?.loan_collection?.length === 1 ||
    !account?.loan_collection?.length
      ? true
      : false
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const [loading, setLoading] = useLoadingState({})
  const [openCollectionModal, setOpenCollectionModal] = useState(false)
  const [collectionData, setCollectionData] = useState({
    newCollection: true,
    collection_id: '',
    loan_account_id: '',
    field_id: '',
    center_id: '',
    category_id: '',
    client_registration_id: '',
    account_id: 1,
    acc_no: '',
    name: '',
    payable_deposit: '',
    loan_installment: '',
    interest_installment: '',
    installment: 1,
    deposit: '',
    loan: '',
    interest: '',
    total: '',
    description: ''
  })

  const actionBtnGroup = (collection, account) => (
    <ActionBtnGroup>
      {((!isEmptyObject(collection) &&
        checkPermission('permission_to_do_loan_collection', authPermissions)) ||
        (isEmptyObject(collection) &&
          checkPermission('regular_loan_collection_update', authPermissions))) && (
        <Tooltip TransitionComponent={Zoom} title={t('common.edit')} arrow followCursor>
          <IconButton className="text-warning" onClick={() => collectionEdit(collection, account)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {!isEmptyObject(collection) &&
        checkPermission('regular_loan_collection_permanently_delete', authPermissions) && (
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
        draftData.loan_account_id = account.id
        draftData.field_id = account.field_id
        draftData.center_id = account.center_id
        draftData.category_id = account.category_id
        draftData.client_registration_id = account.client_registration_id
        draftData.acc_no = account.acc_no
        draftData.name = account.client_registration.name
        draftData.deposit = account.payable_deposit
        draftData.loan = account.loan_installment
        draftData.interest = account.interest_installment
        draftData.total =
          account.payable_deposit + account.loan_installment + account.interest_installment
        draftData.payable_deposit = account.payable_deposit
        draftData.loan_installment = account.loan_installment
        draftData.interest_installment = account.interest_installment
        draftData.total_installment = draftData.total

        if (!isEmptyObject(collection)) {
          draftData.newCollection = false
          draftData.collection_id = collection.id
          draftData.account_id = collection.account_id
          draftData.installment = collection.installment
          draftData.deposit = collection.deposit
          draftData.loan = collection.loan
          draftData.interest = collection.interest
          draftData.total = collection.total
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
        xFetch(`collection/loan/force-delete/${id}`, null, null, accessToken, null, 'DELETE')
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

  const setApproved = (id, val) => {
    setApprovedList((prevList) =>
      create(prevList, (draftList) => {
        val ? draftList.push(id) : draftList.splice(draftList.indexOf(id), 1)
      })
    )
  }

  const collectionModal = () => (
    <LoanCollectionModal
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
      <td className={`${!columnList.loan ? 'd-none' : ''}`}>
        {collection?.loan && tsNumbers(`$${collection?.loan}/-`)}
      </td>
      <td className={`${!columnList.interest ? 'd-none' : ''}`}>
        {collection?.interest && tsNumbers(`$${collection?.interest}/-`)}
      </td>
      <td className={`${!columnList.total ? 'd-none' : ''}`}>
        {collection?.total && tsNumbers(`$${collection?.total}/-`)}
      </td>
      <td className={`${!columnList.creator ? 'd-none' : ''}`}>{collection?.author?.name}</td>
      <td className={`${!columnList.time ? 'd-none' : ''}`}>
        {collection?.created_at &&
          tsNumbers(dateFormat(collection?.created_at, 'dd/MM/yyyy hh:mm a'))}
      </td>
      {checkPermission('regular_loan_collection_approval', authPermissions) && (
        <td className={`${!columnList.approval ? 'd-none' : ''}`}>
          {!isEmpty(collection?.is_approved) && (
            <AndroidSwitch
              value={approvedList.includes(collection?.id)}
              toggleStatus={(e) => setApproved(collection.id, e.target.checked)}
              disabled={loading?.collectionForm}
            />
          )}
        </td>
      )}
      <td className={`${!columnList.action ? 'd-none' : ''}`}>
        {actionBtnGroup(collection, account)}
        {checkPermissions(
          ['permission_to_do_loan_collection', 'regular_loan_collection_update'],
          authPermissions
        ) && collectionModal()}
      </td>
    </tr>
  )
}

export default memo(LoanCollectionSheetRow)
