import { atom, useRecoilState, useRecoilValue } from 'recoil'

const isLoadingState = atom({
  key: 'IsLoading',
  default: true
})

const loadingState = atom({
  key: 'Loading',
  default: {}
})

const useIsLoadingState = () => useRecoilState(isLoadingState)
const useIsLoadingValue = () => useRecoilValue(isLoadingState)
const useLoadingState = () => useRecoilState(loadingState)
const useLoadingValue = () => useRecoilValue(loadingState)

export { useIsLoadingState, useIsLoadingValue, useLoadingState, useLoadingValue }
