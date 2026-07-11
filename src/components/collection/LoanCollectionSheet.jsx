import { memo, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import {
  ALL_COLLECTION_SHEET_CENTERS,
  createCollectionSheetCenterOptions,
  filterCollectionSheetData
} from './collectionSheetFilter'
import LoanCollectionSheetHeader from './LoanCollectionSheetHeader'
import LoanCollectionTable from './LoanCollectionTable'

function LoanCollectionSheet({
  data = [],
  mutate,
  loading,
  isRegular = true,
  categoryName = '',
  fieldName = ''
}) {
  const { t } = useTranslation()
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
      loan: true,
      interest: true,
      total: true,
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
        'loan',
        isRegular ? 'regular' : 'pending'
      ),
    [isRegular]
  )
  const [columnList, setColumnList] = useState(() =>
    loadColumnVisibilityState(columnVisibilityStorageKey, defaultColumnList)
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCenter, setSelectedCenter] = useState(ALL_COLLECTION_SHEET_CENTERS)
  const centerOptions = useMemo(() => createCollectionSheetCenterOptions(data), [data])
  const filteredData = useMemo(
    () =>
      filterCollectionSheetData({
        data,
        accountKey: 'loan_account',
        query: searchQuery,
        selectedCenter,
        context: [categoryName, fieldName],
        translate: t
      }),
    [categoryName, data, fieldName, searchQuery, selectedCenter, t]
  )

  useEffect(() => {
    if (loading) return

    if (
      selectedCenter !== ALL_COLLECTION_SHEET_CENTERS &&
      !centerOptions.some((center) => center.value === selectedCenter)
    ) {
      setSelectedCenter(ALL_COLLECTION_SHEET_CENTERS)
    }
  }, [centerOptions, loading, selectedCenter])

  useEffect(() => {
    setColumnList((prevColumns) => ({ ...defaultColumnList, ...prevColumns }))
  }, [defaultColumnList])

  useEffect(() => {
    if (
      checkPermission(
        `${isRegular ? 'regular' : 'pending'}_loan_collection_approval`,
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
            <LoanCollectionSheetHeader
              columnList={columnList}
              setColumnList={setColumnList}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              centerOptions={centerOptions}
              selectedCenter={selectedCenter}
              onCenterChange={setSelectedCenter}
            />
            <div className="card-body collection-sheet-body">
              {filteredData.length > 0 ? (
                filteredData.map((center, index) => (
                  <LoanCollectionTable
                    key={center?.id || `${center?.name || 'center'}-${index}`}
                    center={center}
                    columnList={columnList}
                    mutate={mutate}
                    isRegular={isRegular}
                  />
                ))
              ) : (
                <div className="collection-sheet-empty-state" role="status">
                  {t('common.No_Records_Found')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default memo(LoanCollectionSheet)
