import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

const appApprovalConfigsState = atom({
  key: 'appApprovalConfigs',
  default: []
})

const useAppApprovalConfigsState = () => useRecoilState(appApprovalConfigsState)
const useAppSettingsValue = () => useRecoilValue(appApprovalConfigsState)
const useSetAppApprovalConfigsState = () => useSetRecoilState(appApprovalConfigsState)

export {
  appApprovalConfigsState,
  useAppApprovalConfigsState,
  useAppSettingsValue,
  useSetAppApprovalConfigsState
}
