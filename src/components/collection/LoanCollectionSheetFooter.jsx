import { useMediaQuery } from '@mui/material'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import { checkPermission } from '../../helper/checkPermission'
import { getLoanEstimateBreakdown } from '../../helper/collectionEstimate'
import Save from '../../icons/Save'
import tsNumbers from '../../libs/tsNumbers'
import xFetch from '../../utilities/xFetch'
import Button from '../utilities/Button'

export default function LoanCollectionSheetFooter({
  columnList,
  center,
  approvedList,
  setApprovedList,
  mutate,
  isRegular = true
}) {
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const [loading, setLoading] = useLoadingState({})
  const isMobileSheet = useMediaQuery('(max-width:767.98px)', { noSsr: true })
  const { t } = useTranslation()
  const { depositSum, loanSum, interestSum, totalSum, estimateSum } = useMemo(
    () => calculateDepositSum(center?.loan_account),
    [center]
  )
  const canApprove = checkPermission(
    `${isRegular ? 'regular' : 'pending'}_loan_collection_approval`,
    authPermissions
  )
  const remainingSum = Math.max(Number(estimateSum || 0) - Number(totalSum || 0), 0)

  const approved = (event) => {
    event.preventDefault()
    if (approvedList.length === 0) return

    const toasterLoading = toast.loading(`${t('common.approval')}...`)
    setLoading({ ...loading, collectionForm: true })
    xFetch(`collection/loan/approved`, { approvedList }, null, accessToken, null, 'POST')
      .then((response) => {
        toast.dismiss(toasterLoading)
        setLoading({ ...loading, collectionForm: false })
        if (response?.success) {
          toast.success(response?.message)
          setApprovedList([])
          mutate()
          return
        }
        toast.error(response?.message)
      })
      .catch((errResponse) => {
        toast.dismiss(toasterLoading)
        toast.error(errResponse?.message)
        setLoading({ ...loading, collectionForm: false })
      })
  }

  return (
    <tfoot className="collection-sheet-tfoot">
      {!isMobileSheet && (
        <tr className="collection-sheet-desktop-summary-row">
          <th className={`${!columnList['#'] ? 'd-none' : ''}`}></th>
          <th className={`${!columnList.image ? 'd-none' : ''}`}></th>
          <th className={`${!columnList.name ? 'd-none' : ''}`}></th>
          <th className={`${!columnList.acc_no ? 'd-none' : ''}`}></th>
          <th className={`${!columnList.account ? 'd-none' : ''}`}></th>
          <th className={`${!columnList.installment ? 'd-none' : ''}`}></th>
          <th className={`${!columnList.description ? 'd-none' : ''} text-end`}>
            {t('common.total')}
          </th>
          <th className={`${!columnList.deposit ? 'd-none' : ''}`}>
            {depositSum && tsNumbers(`$${depositSum}/-`)}
          </th>
          <th className={`${!columnList.loan ? 'd-none' : ''}`}>
            {loanSum && tsNumbers(`$${loanSum}/-`)}
          </th>
          <th className={`${!columnList.interest ? 'd-none' : ''}`}>
            {interestSum && tsNumbers(`$${interestSum}/-`)}
          </th>
          <th className={`${!columnList.total ? 'd-none' : ''}`}>
            {totalSum && tsNumbers(`$${totalSum}/-`)}
          </th>
          {columnList.estimate_collection !== undefined && (
            <th className={`${!columnList.estimate_collection ? 'd-none' : ''}`}>
              {estimateSum && tsNumbers(`$${estimateSum}/-`)}
            </th>
          )}
          <th className={`${!columnList.creator ? 'd-none' : ''}`}></th>
          <th className={`${!columnList.time ? 'd-none' : ''}`}></th>
          {canApprove && (
            <th className={`${!columnList.approval ? 'd-none' : ''}`}>
              {approvedList.length > 0 && (
                <Button
                  type="submit"
                  name=""
                  className={'btn-primary py-2 px-3'}
                  onclick={approved}
                  loading={loading?.collectionForm || false}
                  endIcon={<Save size={20} />}
                  disabled={loading?.collectionForm || false}
                />
              )}
            </th>
          )}
          <th className={`${!columnList.action ? 'd-none' : ''}`}></th>
        </tr>
      )}
      {isMobileSheet && (
        <tr className="collection-sheet-mobile-summary-row">
          <th colSpan={99}>
            <div className="collection-sheet-mobile-summary">
              <div className="collection-sheet-mobile-summary__heading">
                <strong>{t('common.collection_progress')}</strong>
                {canApprove && approvedList.length > 0 && (
                  <span>
                    {t('common.approval')}: {tsNumbers(approvedList.length)}
                  </span>
                )}
              </div>
              <dl className="collection-sheet-mobile-summary__grid collection-sheet-mobile-summary__grid--loan">
                <div>
                  <dt>{t('common.collected_amount')}</dt>
                  <dd>{tsNumbers(`$${totalSum}/-`)}</dd>
                </div>
                {isRegular && (
                  <>
                    <div>
                      <dt>{t('common.remaining_to_collect')}</dt>
                      <dd>{tsNumbers(`$${remainingSum}/-`)}</dd>
                    </div>
                    <div>
                      <dt>{t('common.expected_collection')}</dt>
                      <dd>{tsNumbers(`$${estimateSum}/-`)}</dd>
                    </div>
                  </>
                )}
              </dl>
              {canApprove && approvedList.length > 0 && (
                <Button
                  type="submit"
                  name={t('common.approval')}
                  className={'btn-primary collection-sheet-mobile-summary__button'}
                  onclick={approved}
                  loading={loading?.collectionForm || false}
                  endIcon={<Save size={18} />}
                  disabled={loading?.collectionForm || false}
                />
              )}
            </div>
          </th>
        </tr>
      )}
    </tfoot>
  )
}

function calculateDepositSum(data = []) {
  let depositSum = 0
  let loanSum = 0
  let interestSum = 0
  let totalSum = 0
  let estimateSum = 0

  data.forEach((item) => {
    const loanCollections = item?.loan_collection || []
    if (!loanCollections.length) {
      estimateSum += getLoanEstimateBreakdown(item).total
      return
    }
    loanCollections.forEach((collection) => {
      depositSum += Number(collection?.deposit || 0)
      loanSum += Number(collection?.loan || 0)
      interestSum += Number(collection?.interest || 0)
      totalSum += Number(collection?.total || 0)
      estimateSum += getLoanEstimateBreakdown(item, collection).total
    })
  })

  return { depositSum, loanSum, interestSum, totalSum, estimateSum }
}
