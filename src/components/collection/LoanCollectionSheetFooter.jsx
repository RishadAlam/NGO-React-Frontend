import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import { checkPermission } from '../../helper/checkPermission'
import Save from '../../icons/Save'
import tsNumbers from '../../libs/tsNumbers'
import xFetch from '../../utilities/xFetch'
import Button from '../utilities/Button'

export default function LoanCollectionSheetFooter({
  columnList,
  center,
  approvedList,
  setApprovedList,
  mutate
}) {
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const [loading, setLoading] = useLoadingState({})
  const { t } = useTranslation()
  const { depositSum, loanSum, interestSum, totalSum } = useMemo(
    () => calculateDepositSum(center?.loan_account),
    [center]
  )

  const approved = (event) => {
    event.preventDefault()
    if (approvedList.length === 0) return

    const toasterLoading = toast.loading(`${t('common.delete')}...`)
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
    <tfoot>
      <tr>
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
        <th className={`${!columnList.creator ? 'd-none' : ''}`}></th>
        <th className={`${!columnList.time ? 'd-none' : ''}`}></th>
        {checkPermission('regular_loan_collection_approval', authPermissions) && (
          <th className={`${!columnList.time ? 'd-none' : ''}`}>
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
    </tfoot>
  )
}

function calculateDepositSum(data = []) {
  let depositSum = 0
  let loanSum = 0
  let interestSum = 0
  let totalSum = 0

  data.forEach((item) => {
    if (item.loan_collection && item.loan_collection.length > 0) {
      item.loan_collection.forEach((collection) => {
        depositSum += parseInt(collection.deposit || 0)
        loanSum += parseInt(collection.loan || 0)
        interestSum += parseInt(collection.interest || 0)
        totalSum += parseInt(collection.total || 0)
      })
    }
  })

  return { depositSum, loanSum, interestSum, totalSum }
}
