import { useMemo, useState } from 'react'
import LoanCollectionSheetBody from './LoanCollectionSheetBody'
import LoanCollectionSheetFooter from './LoanCollectionSheetFooter'
import LoanCollectionSheetHead from './LoanCollectionSheetHead'

export default function LoanCollectionTable({ center, columnList, mutate, isRegular = true }) {
  const [approvedList, setApprovedList] = useState([])

  const totalCollection = useMemo(() => countTotalCollections(center?.loan_account || []), [center])

  return (
    <>
      <h2 className="heading">{center?.name}</h2>
      <div className="table-responsive" style={{ minHeight: 'unset' }}>
        <table className="table table-hover table-report">
          <LoanCollectionSheetHead
            columnList={columnList}
            setApprovedList={setApprovedList}
            accounts={center?.loan_account}
            totalCollection={totalCollection}
            approvedList={approvedList}
            isRegular={isRegular}
          />
          <LoanCollectionSheetBody
            center={center}
            columnList={columnList}
            mutate={mutate}
            approvedList={approvedList}
            setApprovedList={setApprovedList}
            isRegular={isRegular}
          />
          <LoanCollectionSheetFooter
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
    approvedCount += Number(account?.loan_collection?.length || 0)
  })

  return approvedCount
}
