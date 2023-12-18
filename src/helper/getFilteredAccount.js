import { isEmptyArray } from './isEmptyObject'

export const getFilteredAccount = (accounts, accountId) =>
  !isEmptyArray(accounts) && accounts.find((account) => Number(account.id) === Number(accountId))
