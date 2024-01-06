import { memo, useEffect, useState } from 'react'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import { checkPermission } from '../../helper/checkPermission'
import '../../pages/staffs/staffs.scss'
import ReactTableSkeleton from '../loaders/skeleton/ReactTableSkeleton'
import LoanCollectionSheetHeader from './LoanCollectionSheetHeader'
import LoanCollectionTable from './LoanCollectionTable'

function LoanCollectionSheet({ data = [], mutate, loading, isRegular = true }) {
  const { permissions: authPermissions } = useAuthDataValue()
  const windowWidth = useWindowInnerWidthValue()
  const [columnList, setColumnList] = useState({
    '#': windowWidth < 576 ? false : true,
    image: windowWidth < 576 ? false : true,
    name: windowWidth < 576 ? false : true,
    acc_no: true,
    account: true,
    installment: true,
    description: windowWidth < 576 ? false : true,
    deposit: true,
    loan: true,
    interest: true,
    total: true,
    creator: windowWidth < 576 ? false : true,
    time: windowWidth < 576 ? false : true,
    action: true
  })

  useEffect(() => {
    if (
      checkPermission(
        `${isRegular ? 'regular' : 'pending'}_loan_collection_approval`,
        authPermissions
      )
    ) {
      setColumnList({ ...columnList, approval: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="staff-table">
        {loading ? (
          <ReactTableSkeleton />
        ) : (
          <div className="card">
            <LoanCollectionSheetHeader columnList={columnList} setColumnList={setColumnList} />
            <div className="card-body">
              {data.map((center, index) => (
                <LoanCollectionTable
                  key={index}
                  center={center}
                  columnList={columnList}
                  mutate={mutate}
                  isRegular={isRegular}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default memo(LoanCollectionSheet)
