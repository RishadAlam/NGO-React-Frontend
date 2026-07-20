import { useEffect, useMemo, useState } from 'react'
import LoanCollectionSheetBody from './LoanCollectionSheetBody'
import LoanCollectionSheetFooter from './LoanCollectionSheetFooter'
import LoanCollectionSheetHead from './LoanCollectionSheetHead'

export default function LoanCollectionTable({ center, columnList, mutate, isRegular = true }) {
  const [approvedList, setApprovedList] = useState([])

  const totalCollection = useMemo(() => countTotalCollections(center?.loan_account || []), [center])
  const visibleCollectionIds = useMemo(
    () =>
      new Set(
        (center?.loan_account || []).flatMap((account) =>
          (account?.loan_collection || [])
            .map((collection) => collection?.id)
            .filter((id) => id !== undefined && id !== null)
        )
      ),
    [center]
  )
  const visibleApprovedList = useMemo(
    () => approvedList.filter((id) => visibleCollectionIds.has(id)),
    [approvedList, visibleCollectionIds]
  )

  useEffect(() => {
    setApprovedList((currentList) => {
      const visibleList = currentList.filter((id) => visibleCollectionIds.has(id))
      return visibleList.length === currentList.length ? currentList : visibleList
    })
  }, [visibleCollectionIds])

  return (
    <>
      <section className="collection-sheet-center-block">
        <h2 className="heading collection-sheet-center-title">{center?.name}</h2>
        <div
          className="table-responsive table-scroll-both collection-sheet-table-wrap"
          style={{ minHeight: 'unset' }}>
          <table className="table table-hover table-report collection-sheet-table collection-sheet-table--loan mobile-hide-first-serial">
            <LoanCollectionSheetHead
              columnList={columnList}
              setApprovedList={setApprovedList}
              accounts={center?.loan_account}
              totalCollection={totalCollection}
              approvedList={visibleApprovedList}
              isRegular={isRegular}
            />
            <LoanCollectionSheetBody
              center={center}
              columnList={columnList}
              mutate={mutate}
              approvedList={visibleApprovedList}
              setApprovedList={setApprovedList}
              isRegular={isRegular}
            />
            <LoanCollectionSheetFooter
              columnList={columnList}
              center={center}
              approvedList={visibleApprovedList}
              setApprovedList={setApprovedList}
              mutate={mutate}
              isRegular={isRegular}
            />
          </table>
        </div>
      </section>
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
