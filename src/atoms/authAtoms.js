import { atom, useRecoilState, useRecoilValue } from 'recoil'

const isAuthorizedState = atom({
  key: 'IsAuthorized',
  default: false
})

const authDataState = atom({
  key: 'AuthData',
  default: {}
})

const useIsAuthorizedState = () => useRecoilState(isAuthorizedState)
const useIsAuthorizedValue = () => useRecoilValue(isAuthorizedState)
const useAuthDataState = () => useRecoilState(authDataState)
const useAuthDataValue = () => useRecoilValue(authDataState)

export { useAuthDataState, useAuthDataValue, useIsAuthorizedState, useIsAuthorizedValue }
