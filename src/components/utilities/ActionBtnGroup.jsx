import ButtonGroup from '@mui/joy/ButtonGroup'

export default function ActionBtnGroup({ children }) {
  //   return (
  //     <ButtonGroup aria-label="radius button group" sx={{ '--ButtonGroup-radius': '40px' }}>
  //       {buttons.map((button, key) => {
  //         return <IconButton key={key}>{button.icon}</IconButton>
  //       })}
  //     </ButtonGroup>
  //   )
  return (
    <ButtonGroup aria-label="radius button group" sx={{ '--ButtonGroup-radius': '40px' }}>
      {children}
    </ButtonGroup>
  )
}
