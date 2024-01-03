import { Fragment, memo, useState } from 'react'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import '../../pages/staffs/staffs.scss'
import ReactTableSkeleton from '../loaders/skeleton/ReactTableSkeleton'
import SavingCollectionSheetBody from './SavingCollectionSheetBody'
import SavingCollectionSheetFooter from './SavingCollectionSheetFooter'
import SavingCollectionSheetHead from './SavingCollectionSheetHead'
import SavingCollectionSheetHeader from './SavingCollectionSheetHeader'

function SavingCollectionSheet({ data = [], loading }) {
  const windowWidth = useWindowInnerWidthValue()
  const [columnList, setColumnList] = useState({
    '#': windowWidth < 576 ? false : true,
    image: windowWidth < 576 ? false : true,
    name: windowWidth < 576 ? false : true,
    acc_no: true,
    description: true,
    deposit: true,
    creator: windowWidth < 576 ? false : true,
    time: windowWidth < 576 ? false : true,
    action: true
  })

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
                <Fragment key={index}>
                  <h2 className="heading">{center?.name}</h2>
                  <div className="table-responsive" style={{ minHeight: 'unset' }}>
                    <table className="table table-hover table-report">
                      <SavingCollectionSheetHead columnList={columnList} />
                      <SavingCollectionSheetBody center={center} columnList={columnList} />
                      <SavingCollectionSheetFooter columnList={columnList} center={center} />
                    </table>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default memo(SavingCollectionSheet)
