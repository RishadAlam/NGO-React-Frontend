import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

const appApprovalConfigsState = atom({
  key: 'appApprovalConfigs',
  default: []
})

const useAppApprovalConfigsState = () => useRecoilState(appApprovalConfigsState)
const useApprovalConfigsValue = () => useRecoilValue(appApprovalConfigsState)
const useSetAppApprovalConfigsState = () => useSetRecoilState(appApprovalConfigsState)

export {
  appApprovalConfigsState,
  useAppApprovalConfigsState,
  useApprovalConfigsValue,
  useSetAppApprovalConfigsState
}
