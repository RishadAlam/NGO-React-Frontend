import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import PrimaryBtn from '../../components/utilities/PrimaryBtn'
import ReactTable from '../../components/utilities/tables/ReactTable'
import Home from '../../icons/Home'
import Pen from '../../icons/Pen'
import { StaffTableColumns } from '../../resources/staticData/tableColumns'
import './staff.scss'

export default function Staffs() {
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const columns = useMemo(() => StaffTableColumns(t, windowWidth), [t, windowWidth])
  const data = []

  return (
    <>
      <section className="staff">
        <div className="row align-items-center my-3">
          <div className="col-sm-6">
            <Breadcrumb
              breadcrumbs={[
                { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
                { name: t('menu.staffs.Staffs'), icon: <Home size={16} />, active: true }
              ]}
            />
          </div>
          <div className="col-sm-6 text-end">
            <PrimaryBtn name={'Create Staff'} loading={false} endIcon={<Pen size={20} />} />
          </div>
        </div>
        <div className="staff-table">
          <ReactTable title={t('staffs.Staff_List')} columns={columns} data={data} />
        </div>
      </section>
    </>
  )
}
