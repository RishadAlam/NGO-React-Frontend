import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

const appSettingsState = atom({
  key: 'appSettings',
  default: {}
})

const useAppSettingsState = () => useRecoilState(appSettingsState)
const useAppSettingsValue = () => useRecoilValue(appSettingsState)
const useSetAppSettingsState = () => useSetRecoilState(appSettingsState)

export { appSettingsState, useAppSettingsState, useAppSettingsValue, useSetAppSettingsState }
