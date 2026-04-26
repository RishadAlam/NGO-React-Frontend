import { Children } from 'react'
import ButtonGroup from '@mui/joy/ButtonGroup'

export default function ActionBtnGroup({ children }) {
  const visibleChildren = Children.toArray(children).filter(Boolean)

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
