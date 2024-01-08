import { Tabs } from '@mui/material'
import Tab from '@mui/material/Tab'

export default function TabsGroup({ defaultValue, setValue, data = [] }) {
  return (
    <Tabs
      value={defaultValue}
      onChange={(e, value) => setValue(value)}
      variant="scrollable"
      scrollButtons
      allowScrollButtonsMobile>
      {data.map((tab, index) => (
        <Tab
          key={index}
          label={tab?.label}
          value={tab?.value}
          icon={tab?.icon}
          iconPosition={tab?.iconPosition || 'start'}
        />
      ))}
    </Tabs>
  )
}
