import { memo, useEffect, useMemo, useState } from 'react'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import { checkPermission } from '../../helper/checkPermission'
import {
  createTableColumnVisibilityStorageKey,
  loadColumnVisibilityState,
  saveColumnVisibilityState
} from '../../helper/tableColumnVisibility'
import '../../pages/staffs/staffs.scss'
import './collectionSheet.scss'
import ReactTableSkeleton from '../loaders/skeleton/ReactTableSkeleton'
import SavingCollectionSheetHeader from './SavingCollectionSheetHeader'
import SavingCollectionTable from './SavingCollectionTable'

function SavingCollectionSheet({ data = [], mutate, loading, isRegular = true }) {
  const { permissions: authPermissions } = useAuthDataValue()
  const windowWidth = useWindowInnerWidthValue()
  const defaultColumnList = useMemo(
    () => ({
      '#': windowWidth < 576 ? false : true,
      image: windowWidth < 576 ? false : true,
      name: windowWidth < 576 ? false : true,
      acc_no: true,
      account: true,
      installment: true,
      description: windowWidth < 576 ? false : true,
      deposit: true,
      ...(isRegular ? { estimate_collection: true } : {}),
      creator: windowWidth < 576 ? false : true,
      time: windowWidth < 576 ? false : true,
      action: true
    }),
    [isRegular, windowWidth]
  )
  const columnVisibilityStorageKey = useMemo(
    () =>
      createTableColumnVisibilityStorageKey(
        'collection_sheet',
        'saving',
        isRegular ? 'regular' : 'pending'
      ),
    [isRegular]
  )
  const [columnList, setColumnList] = useState(() =>
    loadColumnVisibilityState(columnVisibilityStorageKey, defaultColumnList)
  )

  useEffect(() => {
    setColumnList((prevColumns) => ({ ...defaultColumnList, ...prevColumns }))
  }, [defaultColumnList])

  useEffect(() => {
    if (
      checkPermission(
        `${isRegular ? 'regular' : 'pending'}_saving_collection_approval`,
        authPermissions
      )
    ) {
      setColumnList((prevColumns) => ({
        ...prevColumns,
        approval: prevColumns.approval ?? true
      }))
    }
  }, [authPermissions, isRegular])

  useEffect(() => {
    saveColumnVisibilityState(columnVisibilityStorageKey, columnList)
  }, [columnList, columnVisibilityStorageKey])

  return (
    <>
      <div className="staff-table collection-sheet">
        {loading ? (
          <ReactTableSkeleton />
        ) : (
          <div className="card collection-sheet-card">
            <SavingCollectionSheetHeader columnList={columnList} setColumnList={setColumnList} />
            <div className="card-body collection-sheet-body">
              {data.map((center, index) => (
                <SavingCollectionTable
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

export default memo(SavingCollectionSheet)
