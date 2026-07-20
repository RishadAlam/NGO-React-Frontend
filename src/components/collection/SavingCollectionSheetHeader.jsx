import { FormControlLabel, Switch, useMediaQuery } from '@mui/material'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { create } from 'mutative'
import { memo, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MoreVertical from '../../icons/MoreVertical'
import '../../pages/staffs/staffs.scss'
import CollectionSheetFilters from './CollectionSheetFilters'

const MOBILE_LOCKED_COLUMNS = new Set([
  '#',
  'image',
  'name',
  'acc_no',
  'deposit',
  'approval',
  'action'
])

function SavingCollectionSheetHeader({
  columnList,
  setColumnList,
  searchQuery,
  setSearchQuery,
  centerOptions,
  selectedCenter,
  onCenterChange
}) {
  const [anchorEl, setAnchorEl] = useState(null)
  const columnMenuTriggerId = useId()
  const columnMenuId = `${columnMenuTriggerId}-menu`
  const open = Boolean(anchorEl)
  const isMobileTable = useMediaQuery('(max-width:767.98px)', { noSsr: true })
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
    <div className="card-header collection-sheet-header">
      <div className="d-flex justify-content-between align-items-center collection-sheet-toolbar">
        <h2 className="heading">{t('common.collection_sheet')}</h2>
        <div className="collection-sheet-toolbar-actions">
          <CollectionSheetFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            centerOptions={centerOptions}
            selectedCenter={selectedCenter}
            onCenterChange={onCenterChange}
          />
          <div className="column-hiding text-end position-relative">
            <Button
              id={columnMenuTriggerId}
              className="table-btn table-btn--icon"
              aria-label={t('common.choose_columns')}
              aria-controls={open ? columnMenuId : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}>
              <MoreVertical size={24} />
            </Button>
            <Menu
              id={columnMenuId}
              className="table-column-visibility-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={isMobileTable ? { vertical: 'bottom', horizontal: 'right' } : undefined}
              transformOrigin={isMobileTable ? { vertical: 'top', horizontal: 'right' } : undefined}
              marginThreshold={isMobileTable ? 12 : undefined}
              PaperProps={{
                className: 'table-column-visibility-menu__paper'
              }}
              MenuListProps={{
                'aria-labelledby': columnMenuTriggerId,
                className: 'table-column-visibility-menu__list'
              }}>
              {Object.keys(columnList)
                .filter((column) => !isMobileTable || !MOBILE_LOCKED_COLUMNS.has(column))
                .map((column) => (
                  <MenuItem className="table-column-visibility-menu__item" key={column}>
                    <FormControlLabel
                      className="table-column-visibility-menu__label"
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
    </div>
  )
}

export default memo(SavingCollectionSheetHeader)
