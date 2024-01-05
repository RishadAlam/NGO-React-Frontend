import { memo, useEffect, useState } from 'react'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import { checkPermission } from '../../helper/checkPermission'
import '../../pages/staffs/staffs.scss'
import ReactTableSkeleton from '../loaders/skeleton/ReactTableSkeleton'
import SavingCollectionSheetHeader from './SavingCollectionSheetHeader'
import SavingCollectionTable from './SavingCollectionTable'

function SavingCollectionSheet({ data = [], mutate, loading }) {
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
    creator: windowWidth < 576 ? false : true,
    time: windowWidth < 576 ? false : true,
    action: true
  })

  useEffect(() => {
    if (checkPermission('regular_saving_collection_approval', authPermissions)) {
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
            <SavingCollectionSheetHeader columnList={columnList} setColumnList={setColumnList} />
            <div className="card-body">
              {data.map((center, index) => (
                <SavingCollectionTable
                  key={index}
                  center={center}
                  columnList={columnList}
                  mutate={mutate}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default memo(SavingCollectionSheet)
