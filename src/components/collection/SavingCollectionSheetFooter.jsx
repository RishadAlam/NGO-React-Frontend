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

export default function SavingCollectionSheetFooter({
  columnList,
  center,
  approvedList,
  setApprovedList,
  mutate
}) {
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const [loading, setLoading] = useLoadingState({})
  const { t } = useTranslation()
  const depositSum = useMemo(() => calculateDepositSum(center?.saving_account), [center])

  const approved = (event) => {
    event.preventDefault()
    if (approvedList.length === 0) return

    const toasterLoading = toast.loading(`${t('common.delete')}...`)
    setLoading({ ...loading, collectionForm: true })
    xFetch(`collection/saving/approved`, { approvedList }, null, accessToken, null, 'POST')
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
        <th className={`${!columnList.creator ? 'd-none' : ''}`}></th>
        <th className={`${!columnList.time ? 'd-none' : ''}`}></th>
        {checkPermission('regular_saving_collection_approval', authPermissions) && (
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
    </tfoot>
  )
}

function calculateDepositSum(data = []) {
  let depositSum = 0

  data.forEach((item) => {
    if (item.saving_collection && item.saving_collection.length > 0) {
      item.saving_collection.forEach((collection) => {
        depositSum += Number(collection?.deposit || 0)
      })
    }
  })

  return depositSum
}
