import { FormControlLabel, Switch } from '@mui/material'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { create } from 'mutative'
import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MoreVertical from '../../icons/MoreVertical'
import '../../pages/staffs/staffs.scss'

function SavingCollectionSheetHeader({ columnList, setColumnList }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const { t } = useTranslation()

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

  return (
    <div className="card-header">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="heading">{t('common.collection_sheet')}</h2>
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
  )
}

export default memo(SavingCollectionSheetHeader)
