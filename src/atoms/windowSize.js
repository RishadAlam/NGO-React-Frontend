import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

const windowInnerWidthState = atom({
  key: 'windowInnerWidth',
  default: window.innerWidth
})

const useWindowInnerWidthState = () => useRecoilState(windowInnerWidthState)
const useWindowInnerWidthValue = () => useRecoilValue(windowInnerWidthState)
const useSetWindowInnerWidthState = () => useSetRecoilState(windowInnerWidthState)

export {
  useSetWindowInnerWidthState,
  useWindowInnerWidthState,
  useWindowInnerWidthValue,
  windowInnerWidthState
}
