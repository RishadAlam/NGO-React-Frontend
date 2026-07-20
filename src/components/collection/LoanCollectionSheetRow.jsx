import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { create } from 'mutative'
import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import { checkPermission, checkPermissions } from '../../helper/checkPermission'
import { collectionDelete } from '../../helper/collectionActions'
import { getLoanEstimateBreakdown } from '../../helper/collectionEstimate'
import { defaultNameCheck } from '../../helper/defaultNameCheck'
import { isEmpty } from '../../helper/isEmpty'
import { isEmptyObject } from '../../helper/isEmptyObject'
import { setCollectionBG } from '../../helper/setCollectionBG'
import CheckCircle from '../../icons/CheckCircle'
import Edit from '../../icons/Edit'
import MoneyCollect from '../../icons/MoneyCollect'
import Trash from '../../icons/Trash'
import dateFormat from '../../libs/dateFormat'
import decodeHTMLs from '../../libs/decodeHTMLs'
import tsNumbers from '../../libs/tsNumbers'
import ActionBtnGroup, { MobileTableActionContext } from '../utilities/ActionBtnGroup'
import AndroidSwitch from '../utilities/AndroidSwitch'
import Avatar from '../utilities/Avatar'
import CollectionSheetMobileDetails from './CollectionSheetMobileDetails'
import LoanCollectionModal from './LoanCollectionModal'

function LoanCollectionSheetRow({
  columnList,
  index,
  collectionIndex,
  account,
  mutate,
  collection = {},
  approvedList,
  setApprovedList,
  isRegular = true,
  isMobileSheet = false
}) {
  const { t } = useTranslation()
  const estimate = getLoanEstimateBreakdown(account, collection)
  const isSingleCollection =
    (account?.loan_collection?.length > 1 && !collectionIndex) ||
    account?.loan_collection?.length === 1 ||
    !account?.loan_collection?.length
      ? true
      : false

  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const [loading, setLoading] = useLoadingState({})
  const hasCollection = !isEmptyObject(collection)
  const canCreateCollection =
    isRegular &&
    !hasCollection &&
    checkPermission('permission_to_do_loan_collection', authPermissions)
  const canUpdateCollection =
    hasCollection &&
    checkPermission(`${isRegular ? 'regular' : 'pending'}_loan_collection_update`, authPermissions)
  const canDeleteCollection =
    hasCollection &&
    checkPermission(
      `${isRegular ? 'regular' : 'pending'}_loan_collection_permanently_delete`,
      authPermissions
    )
  const canEditCollection = canCreateCollection || canUpdateCollection
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

  const actionBtnGroup = (collection, account, includeEdit = true) => (
    <ActionBtnGroup>
      {includeEdit && canEditCollection && (
        <Tooltip TransitionComponent={Zoom} title={t('common.edit')} arrow followCursor>
          <IconButton className="text-warning" onClick={() => collectionEdit(collection, account)}>
            {<Edit size={20} />}
          </IconButton>
        </Tooltip>
      )}
      {canDeleteCollection && (
        <Tooltip
          TransitionComponent={Zoom}
          title={t('common.delete')}
          arrow
          followCursor
          disabled={loading?.collectionDelete || false}>
          <IconButton
            className="text-danger"
            onClick={() =>
              collection?.id &&
              collectionDelete('loan', collection?.id, t, accessToken, mutate, loading, setLoading)
            }>
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
        draftData.is_loan_approved = account.is_loan_approved
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
          Number(account.payable_deposit || 0) +
          Number(account.loan_installment || 0) +
          Number(account.interest_installment || 0)
        draftData.payable_deposit = account.payable_deposit
        draftData.loan_installment = account.loan_installment
        draftData.interest_installment = account.interest_installment
        draftData.total_installment = draftData.total

        if (Number(account.is_loan_approved === 0)) {
          draftData.installment = 0
          draftData.loan = 0
          draftData.interest = 0
          draftData.total = Number(account.payable_deposit || 0)
          draftData.payable_deposit = account.payable_deposit
          draftData.loan_installment = 0
          draftData.interest_installment = 0
          draftData.total_installment = draftData.total
        }

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
      isRegular={isRegular}
    />
  )

  const memberName = account?.client_registration?.name || tsNumbers(account?.acc_no)
  const accountNumber = tsNumbers(account?.acc_no)
  const collectionAccountName = defaultNameCheck(
    t,
    collection?.account?.is_default,
    'account.default.',
    collection?.account?.name
  )
  const collectionTime = collection?.created_at
    ? tsNumbers(dateFormat(collection.created_at, 'dd/MM/yyyy hh:mm a'))
    : ''
  const mobileAmount = hasCollection ? (collection?.total ?? 0) : estimate.total
  const mobileBreakdown = hasCollection
    ? {
        deposit: Number(collection?.deposit || 0),
        loan: Number(collection?.loan || 0),
        interest: Number(collection?.interest || 0)
      }
    : estimate
  const canApprove = checkPermission(
    `${isRegular ? 'regular' : 'pending'}_loan_collection_approval`,
    authPermissions
  )
  const mobileDetailFields = [
    {
      key: 'account',
      label: t('common.account'),
      value: collectionAccountName,
      visible: columnList.account
    },
    {
      key: 'installment',
      label: t('common.installment'),
      value: collection?.installment !== undefined ? tsNumbers(collection.installment) : '',
      visible: columnList.installment
    },
    {
      key: 'description',
      label: t('common.description'),
      value: decodeHTMLs(collection?.description),
      visible: columnList.description
    },
    {
      key: 'estimate',
      label: t('common.estimate_collection'),
      value: tsNumbers(`$${estimate.total}/-`),
      visible:
        hasCollection &&
        columnList.estimate_collection !== undefined &&
        columnList.estimate_collection
    },
    {
      key: 'creator',
      label: t('common.creator'),
      value: collection?.author?.name,
      visible: columnList.creator
    },
    {
      key: 'time',
      label: t('common.time'),
      value: collectionTime,
      visible: columnList.time
    }
  ]

  return (
    <>
      {!isMobileSheet && (
        <tr className="collection-sheet-desktop-row">
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
          <td className={`${!columnList.account ? 'd-none' : ''}`}>{collectionAccountName}</td>
          <td className={`${!columnList.installment ? 'd-none' : ''}`}>
            {collection?.installment && tsNumbers(collection?.installment)}
          </td>
          <td className={`${!columnList.description ? 'd-none' : ''}`}>
            <span>{decodeHTMLs(collection?.description)}</span>
          </td>
          <td
            className={`${!columnList.deposit ? 'd-none' : ''}`}
            ref={(e) => setCollectionBG(e, estimate.deposit, collection?.deposit)}>
            {collection?.deposit && tsNumbers(`$${collection?.deposit}/-`)}
          </td>
          <td
            className={`${!columnList.loan ? 'd-none' : ''}`}
            ref={(e) => setCollectionBG(e, estimate.loan, collection?.loan)}>
            {collection?.loan && tsNumbers(`$${collection?.loan}/-`)}
          </td>
          <td
            className={`${!columnList.interest ? 'd-none' : ''}`}
            ref={(e) => setCollectionBG(e, estimate.interest, collection?.interest)}>
            {collection?.interest && tsNumbers(`$${collection?.interest}/-`)}
          </td>
          <td
            className={`${!columnList.total ? 'd-none' : ''}`}
            ref={(e) => setCollectionBG(e, estimate.total, collection?.total)}>
            {collection?.total && tsNumbers(`$${collection?.total}/-`)}
          </td>
          {columnList.estimate_collection !== undefined && (
            <td className={`${!columnList.estimate_collection ? 'd-none' : ''}`}>
              {tsNumbers(`$${estimate.total}/-`)}
            </td>
          )}
          <td className={`${!columnList.creator ? 'd-none' : ''}`}>{collection?.author?.name}</td>
          <td className={`${!columnList.time ? 'd-none' : ''}`}>{collectionTime}</td>
          {canApprove && (
            <td className={`${!columnList.approval ? 'd-none' : ''}`}>
              {!isEmpty(collection?.is_approved) && (
                <AndroidSwitch
                  value={approvedList.includes(collection?.id)}
                  toggleStatus={(e) => setApproved(collection.id, e.target.checked)}
                  disabled={loading?.collectionForm}
                  ariaLabel={t('common.approval')}
                />
              )}
            </td>
          )}
          <td className={`${!columnList.action ? 'd-none' : ''}`}>
            {actionBtnGroup(collection, account)}
            {checkPermissions(
              [
                isRegular && 'permission_to_do_loan_collection',
                `${isRegular ? 'regular' : 'pending'}_loan_collection_update`
              ],
              authPermissions
            ) && collectionModal()}
          </td>
        </tr>
      )}
      {isMobileSheet && (
        <tr className="collection-sheet-mobile-row">
          <td colSpan={99}>
            <article
              className={`collection-sheet-mobile-card ${
                hasCollection ? 'is-collected' : 'is-due'
              }`}>
              <div className="collection-sheet-mobile-card__topline">
                <div className="collection-sheet-mobile-card__member">
                  <Avatar
                    name={account?.client_registration?.name}
                    img={account?.client_registration?.image_uri}
                  />
                  <div>
                    <strong>{memberName}</strong>
                    <span>
                      {t('common.acc_no')}: {accountNumber}
                    </span>
                  </div>
                </div>
                <div className="collection-sheet-mobile-card__status">
                  {hasCollection ? <CheckCircle size={14} /> : <MoneyCollect size={14} />}
                  <span>{t(hasCollection ? 'common.collected' : 'common.due_today')}</span>
                </div>
              </div>
              <div className="collection-sheet-mobile-card__payment">
                <span>{t(hasCollection ? 'common.collected_amount' : 'common.due_today')}</span>
                <strong>{tsNumbers(`$${mobileAmount ?? 0}/-`)}</strong>
              </div>
              <dl
                className="collection-sheet-mobile-card__breakdown"
                aria-label={t('common.payment_breakdown')}>
                <div>
                  <dt>{t('common.deposit')}</dt>
                  <dd>{tsNumbers(`$${mobileBreakdown.deposit}/-`)}</dd>
                </div>
                <div>
                  <dt>{t('common.loan')}</dt>
                  <dd>{tsNumbers(`$${mobileBreakdown.loan}/-`)}</dd>
                </div>
                <div>
                  <dt>{t('common.interest')}</dt>
                  <dd>{tsNumbers(`$${mobileBreakdown.interest}/-`)}</dd>
                </div>
              </dl>
              {(canEditCollection || canDeleteCollection) && (
                <div className="collection-sheet-mobile-card__primary-actions">
                  {canEditCollection && (
                    <button
                      type="button"
                      className="collection-sheet-mobile-card__collect-button"
                      onClick={() => collectionEdit(collection, account)}>
                      {hasCollection ? <Edit size={18} /> : <MoneyCollect size={19} />}
                      <span>
                        {t(hasCollection ? 'common.edit_collection' : 'common.collect_money')}
                      </span>
                    </button>
                  )}
                  {canDeleteCollection && (
                    <div className="collection-sheet-mobile-card__actions">
                      <MobileTableActionContext.Provider value>
                        {actionBtnGroup(collection, account, false)}
                      </MobileTableActionContext.Provider>
                    </div>
                  )}
                </div>
              )}
              <div className="collection-sheet-mobile-card__controls">
                {canApprove && !isEmpty(collection?.is_approved) && (
                  <div className="collection-sheet-mobile-card__approval">
                    <span>{t('common.approval')}</span>
                    <AndroidSwitch
                      value={approvedList.includes(collection?.id)}
                      toggleStatus={(e) => setApproved(collection.id, e.target.checked)}
                      disabled={loading?.collectionForm}
                      ariaLabel={t('common.approval')}
                    />
                  </div>
                )}
              </div>
              <CollectionSheetMobileDetails fields={mobileDetailFields} />
            </article>
            {checkPermissions(
              [
                isRegular && 'permission_to_do_loan_collection',
                `${isRegular ? 'regular' : 'pending'}_loan_collection_update`
              ],
              authPermissions
            ) && collectionModal()}
          </td>
        </tr>
      )}
    </>
  )
}

export default memo(LoanCollectionSheetRow)
