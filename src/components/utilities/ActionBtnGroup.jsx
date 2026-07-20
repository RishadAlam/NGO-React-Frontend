import { Children, createContext, isValidElement, useContext, useState } from 'react'
import ButtonGroup from '@mui/joy/ButtonGroup'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertical from '../../icons/MoreVertical'

export const MobileTableActionContext = createContext(false)

const getActionDetails = (child, index) => {
  const nestedChild = isValidElement(child?.props?.children) ? child.props.children : null
  const actionElement =
    typeof child?.props?.onClick === 'function' || child?.props?.['aria-label']
      ? child
      : nestedChild || child
  const label =
    child?.props?.title ||
    actionElement?.props?.['aria-label'] ||
    actionElement?.props?.title ||
    `Action ${index + 1}`

  return {
    disabled: Boolean(child?.props?.disabled || actionElement?.props?.disabled),
    icon: actionElement?.props?.children,
    key: child?.key || `${label}-${index}`,
    label,
    onClick: actionElement?.props?.onClick
  }
}

export default function ActionBtnGroup({ children }) {
  const visibleChildren = Children.toArray(children).filter(Boolean)
  const useCompactMobileMenu = useContext(MobileTableActionContext)
  const [anchorEl, setAnchorEl] = useState(null)

  if (!visibleChildren.length) return null

  if (useCompactMobileMenu && visibleChildren.length > 1) {
    const mobileActions = visibleChildren.map(getActionDetails)
    const closeMenu = () => setAnchorEl(null)

    return (
      <>
        <IconButton
          type="button"
          className="mobile-row-action-trigger"
          aria-label="Actions"
          aria-haspopup="menu"
          aria-expanded={anchorEl ? 'true' : undefined}
          onClick={(event) => {
            event.stopPropagation()
            setAnchorEl(event.currentTarget)
          }}>
          <MoreVertical size={20} />
        </IconButton>
        <Menu
          className="mobile-row-action-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={closeMenu}
          onClick={(event) => event.stopPropagation()}>
          {mobileActions.map((action) => (
            <MenuItem
              key={action.key}
              className="mobile-row-action-menu__item"
              disabled={action.disabled}
              onClick={(event) => {
                event.stopPropagation()
                closeMenu()
                action.onClick?.(event)
              }}>
              <span className="mobile-row-action-menu__icon">{action.icon}</span>
              <span>{action.label}</span>
            </MenuItem>
          ))}
        </Menu>
      </>
    )
  }

  return (
    <ButtonGroup
      aria-label="radius button group"
      sx={{
        '--ButtonGroup-radius': '40px',
        '& .MuiIconButton-root': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 0
        },
        '& .MuiIconButton-root svg': {
          display: 'block',
          flexShrink: 0
        }
      }}>
      {visibleChildren}
    </ButtonGroup>
  )
}
