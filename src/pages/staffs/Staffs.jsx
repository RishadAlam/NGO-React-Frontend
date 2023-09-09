import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import StaffRegistration from '../../components/staffRegistration/StaffRegistration'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import AndroidSwitch from '../../components/utilities/AndroidSwitch'
import Avatar from '../../components/utilities/Avatar'
import PrimaryBtn from '../../components/utilities/PrimaryBtn'
import ReactTable from '../../components/utilities/tables/ReactTable'
import Edit from '../../icons/Edit'
import Home from '../../icons/Home'
import List from '../../icons/List'
import Pen from '../../icons/Pen'
import Trash from '../../icons/Trash'
import { MOCK_DATA } from '../../resources/staticData/MOCK_DATA'
import { StaffTableColumns } from '../../resources/staticData/tableColumns'
import './staffs.scss'

export default function Staffs() {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const avatar = (name, img) => <Avatar name={name} img={img} />
  const statusSwitch = (value, id) => (
    <AndroidSwitch value={value} id={id} toggleStatus={toggleStatus} />
  )
  const actionBtnGroup = (id) => (
    <ActionBtnGroup>
      <Tooltip TransitionComponent={Zoom} title="View User Permissions" arrow followCursor>
        <IconButton className="text-success" onClick={() => view(id)}>
          {<List size={20} />}
        </IconButton>
      </Tooltip>
      <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
        <IconButton className="text-warning" onClick={() => editf(id)}>
          {<Edit size={20} />}
        </IconButton>
      </Tooltip>
      <Tooltip TransitionComponent={Zoom} title="Delete" arrow followCursor>
        <IconButton className="text-danger" onClick={() => deletef(id)}>
          {<Trash size={20} />}
        </IconButton>
      </Tooltip>
    </ActionBtnGroup>
  )

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
            <PrimaryBtn
              name={t('staffs.Staff_Registration')}
              loading={false}
              endIcon={<Pen size={20} />}
              onclick={() => setIsUserModalOpen(true)}
            />
            <StaffRegistration
              isUserModalOpen={isUserModalOpen}
              setIsUserModalOpen={setIsUserModalOpen}
            />
          </div>
        </div>
        <div className="staff-table">
          <ReactTable title={t('staffs.Staff_List')} columns={columns} data={data} />
        </div>
      </section>
    </>
  )
}
