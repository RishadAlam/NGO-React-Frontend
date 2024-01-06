import { useMemo, useState } from 'react'
import SavingCollectionSheetBody from './SavingCollectionSheetBody'
import SavingCollectionSheetFooter from './SavingCollectionSheetFooter'
import SavingCollectionSheetHead from './SavingCollectionSheetHead'

export default function SavingCollectionTable({ center, columnList, mutate, isRegular = true }) {
  const [approvedList, setApprovedList] = useState([])

  const totalCollection = useMemo(
    () => countTotalCollections(center?.saving_account || []),
    [center]
  )

  return (
    <>
      <h2 className="heading">{center?.name}</h2>
      <div className="table-responsive" style={{ minHeight: 'unset' }}>
        <table className="table table-hover table-report">
          <SavingCollectionSheetHead
            columnList={columnList}
            setApprovedList={setApprovedList}
            accounts={center?.saving_account}
            totalCollection={totalCollection}
            approvedList={approvedList}
            isRegular={isRegular}
          />
          <SavingCollectionSheetBody
            center={center}
            columnList={columnList}
            mutate={mutate}
            approvedList={approvedList}
            setApprovedList={setApprovedList}
            isRegular={isRegular}
          />
          <SavingCollectionSheetFooter
            columnList={columnList}
            center={center}
            approvedList={approvedList}
            setApprovedList={setApprovedList}
            mutate={mutate}
            isRegular={isRegular}
          />
        </table>
      </div>
    </>
  )
}

function countTotalCollections(data) {
  let approvedCount = 0

  data.forEach((account) => {
    approvedCount += account.saving_collection.length
  })

  return approvedCount
}
