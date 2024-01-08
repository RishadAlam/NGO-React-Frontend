import ClientRegisterTabsNav from '../../resources/staticData/ClientRegisterTabsNav'
import TabsGroup from '../utilities/TabsGroup'

export default function RegisterTabNav({ registerTabValue, setRegisterTabValue }) {
  return (
    <div className="border-top">
      <TabsGroup
        defaultValue={registerTabValue}
        setValue={setRegisterTabValue}
        data={ClientRegisterTabsNav()}
      />
    </div>
  )
}
