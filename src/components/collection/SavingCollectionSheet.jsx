import { IconButton } from '@mui/joy'
import { FormControlLabel, Switch, Tooltip, Zoom } from '@mui/material'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { create } from 'mutative'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import Folder from '../../icons/Folder'
import MoreVertical from '../../icons/MoreVertical'
import '../../pages/staffs/staffs.scss'
import ReactTableSkeleton from '../loaders/skeleton/ReactTableSkeleton'
import ActionBtnGroup from '../utilities/ActionBtnGroup'

export default function SavingCollectionSheet({ data = [], loading }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const navigate = useNavigate()
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const setColumnVisible = (val, name) => {
    setColumnList((prev) =>
      create(prev, (draft) => {
        draft[name] = val
      })
    )
  }

  const actionBtnGroup = (id) => (
    <ActionBtnGroup>
      <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
        <IconButton className="text-warning" onClick={() => navigate(`${id}`)}>
          {<Folder size={20} />}
        </IconButton>
      </Tooltip>
    </ActionBtnGroup>
  )

  return (
    <>
      <div className="staff-table">
        {loading ? (
          <ReactTableSkeleton />
        ) : (
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="heading"></h2>
                <div className="column-hiding text-end position-relative">
                  <Button
                    id="hide-column--button"
                    className="table-btn p-0"
                    aria-controls={open ? 'hide-column-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}>
                    <MoreVertical size={24} />
                  </Button>
                  <Menu
                    id="hide-column-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'hide-column--button'
                    }}>
                    {Object.keys(columnList).map((column, index) => (
                      <MenuItem key={index}>
                        <FormControlLabel
                          control={
                            <Switch
                              size="small"
                              checked={columnList[column]}
                              onChange={(e) => setColumnVisible(e.target.checked, column)}
                            />
                          }
                          label={t(`common.${column}`)}
                        />
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-report">
                  <thead>
                    <tr>
                      <th className={`${!columnList['#'] ? 'd-none' : ''}`}>#</th>
                      <th className={`${!columnList.image ? 'd-none' : ''}`}>
                        {t('common.image')}
                      </th>
                      <th className={`${!columnList.name ? 'd-none' : ''}`}>{t('common.name')}</th>
                      <th className={`${!columnList.acc_no ? 'd-none' : ''}`}>
                        {t('common.acc_no')}
                      </th>
                      <th className={`${!columnList.description ? 'd-none' : ''}`}>
                        {t('common.description')}
                      </th>
                      <th className={`${!columnList.deposit ? 'd-none' : ''}`}>
                        {t('common.deposit')}
                      </th>
                      <th className={`${!columnList.creator ? 'd-none' : ''}`}>
                        {t('common.creator')}
                      </th>
                      <th className={`${!columnList.time ? 'd-none' : ''}`}>{t('common.time')}</th>
                      <th className={`${!columnList.action ? 'd-none' : ''}`}>
                        {t('common.action')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={`${!columnList['#'] ? 'd-none' : ''}`}>1</td>
                      <td className={`${!columnList.image ? 'd-none' : ''}`}>2</td>
                      <td className={`${!columnList.name ? 'd-none' : ''}`}>3</td>
                      <td className={`${!columnList.acc_no ? 'd-none' : ''}`}>4</td>
                      <td className={`${!columnList.description ? 'd-none' : ''}`}>5</td>
                      <td className={`${!columnList.deposit ? 'd-none' : ''}`}>6</td>
                      <td className={`${!columnList.creator ? 'd-none' : ''}`}>7</td>
                      <td className={`${!columnList.time ? 'd-none' : ''}`}>8</td>
                      <td className={`${!columnList.action ? 'd-none' : ''}`}>
                        {actionBtnGroup(1)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9} className="text-center">
                        {t('common.No_Records_Found')}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="5"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
