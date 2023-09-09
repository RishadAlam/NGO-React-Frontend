import { IconButton } from '@mui/joy'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import AndroidSwitch from '../../components/utilities/AndroidSwitch'
import Avatar from '../../components/utilities/Avatar'
import PrimaryBtn from '../../components/utilities/PrimaryBtn'
import ReactTable from '../../components/utilities/tables/ReactTable'
import Home from '../../icons/Home'
import Pen from '../../icons/Pen'
import { MOCK_DATA } from '../../resources/staticData/MOCK_DATA'
import { StaffTableColumns } from '../../resources/staticData/tableColumns'
import './staff.scss'

export default function Staffs() {
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const avatar = (name, img) => <Avatar name={name} img={img} />
  const statusSwitch = (value, id) => (
    <AndroidSwitch value={value} id={id} toggleStatus={toggleStatus} />
  )
  const actionBtnGroup = (id) => {
    return (
      <ActionBtnGroup>
        <IconButton className="text-success" onClick={() => view(id)}>
          {<Pen />}
        </IconButton>
        <IconButton className="text-warning" onClick={() => editf(id)}>
          {<Pen />}
        </IconButton>
        <IconButton className="text-danger" onClick={() => deletef(id)}>
          {<Pen />}
        </IconButton>
      </ActionBtnGroup>
    )
  }
  const columns = useMemo(
    () => StaffTableColumns(t, windowWidth, avatar, statusSwitch, actionBtnGroup),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth]
  )
  const data = useMemo(() => MOCK_DATA(), [])
  const toggleStatus = (id) => console.log(id)
  const editf = (id) => console.log(id)
  const deletef = (id) => console.log(id)
  const view = (id) => console.log(id)

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
