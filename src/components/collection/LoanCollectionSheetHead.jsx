import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingValue } from '../../atoms/loaderAtoms'
import { checkPermission } from '../../helper/checkPermission'
import AndroidSwitch from '../utilities/AndroidSwitch'

export default function LoanCollectionSheetHead({
  columnList,
  setApprovedList,
  accounts,
  totalCollection,
  approvedList,
  isRegular = true
}) {
  const loading = useLoadingValue()
  const { permissions: authPermissions } = useAuthDataValue()
  const { t } = useTranslation()

  return (
    <thead className="collection-sheet-thead">
      <tr>
        <th className={`${!columnList['#'] ? 'd-none' : ''}`}>#</th>
        <th className={`${!columnList.image ? 'd-none' : ''}`}>{t('common.image')}</th>
        <th className={`${!columnList.name ? 'd-none' : ''}`}>{t('common.name')}</th>
        <th className={`${!columnList.acc_no ? 'd-none' : ''}`}>{t('common.acc_no')}</th>
        <th className={`${!columnList.account ? 'd-none' : ''}`}>{t('common.account')}</th>
        <th className={`${!columnList.installment ? 'd-none' : ''}`}>{t('common.installment')}</th>
        <th className={`${!columnList.description ? 'd-none' : ''}`}>{t('common.description')}</th>
        <th className={`${!columnList.deposit ? 'd-none' : ''}`}>{t('common.deposit')}</th>
        <th className={`${!columnList.loan ? 'd-none' : ''}`}>{t('common.loan')}</th>
        <th className={`${!columnList.interest ? 'd-none' : ''}`}>{t('common.interest')}</th>
        <th className={`${!columnList.total ? 'd-none' : ''}`}>{t('common.total')}</th>
        <th className={`${!columnList.creator ? 'd-none' : ''}`}>{t('common.creator')}</th>
        <th className={`${!columnList.time ? 'd-none' : ''}`}>{t('common.time')}</th>
        {checkPermission(
          `${isRegular ? 'regular' : 'pending'}_loan_collection_approval`,
          authPermissions
        ) && (
          <th className={`${!columnList.approval ? 'd-none' : ''}`}>
            {t('common.approval')}
            &nbsp;&nbsp;
            {totalCollection > 0 && (
              <AndroidSwitch
                value={totalCollection === approvedList.length}
                toggleStatus={(e) =>
                  setApprovedList(e.target.checked ? getLoanCollectionIds(accounts) : [])
                }
                disabled={loading?.collectionForm}
              />
            )}
          </th>
        )}
        <th className={`${!columnList.action ? 'd-none' : ''}`}>{t('common.action')}</th>
      </tr>
    </thead>
  )
}

function getLoanCollectionIds(data) {
  const loanCollectionIds = []

  data.forEach((account) => {
    account.loan_collection.forEach((collection) => {
      loanCollectionIds.push(collection.id)
    })
  })

  return loanCollectionIds
}
