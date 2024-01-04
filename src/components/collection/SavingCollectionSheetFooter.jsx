import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import tsNumbers from '../../libs/tsNumbers'

export default function SavingCollectionSheetFooter({ columnList, center }) {
  const { t } = useTranslation()
  const depositSum = useMemo(() => calculateDepositSum(center?.saving_account), [center])

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
        <th className={`${!columnList.creator ? 'd-none' : ''}`}></th>
        <th className={`${!columnList.time ? 'd-none' : ''}`}></th>
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
        depositSum += collection.deposit
      })
    }
  })

  return depositSum
}
