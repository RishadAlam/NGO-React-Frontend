const toNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const getInstallmentMultiplier = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

export const getSavingEstimateDeposit = (account = {}, collection = {}) => {
  const payableDeposit = toNumber(account?.payable_deposit)
  const installment = getInstallmentMultiplier(collection?.installment)
  return payableDeposit * installment
}

export const getLoanEstimateBreakdown = (account = {}, collection = {}) => {
  const isLoanApproved = Number(account?.is_loan_approved) === 1
  const installment = isLoanApproved ? getInstallmentMultiplier(collection?.installment) : 1
  const deposit = toNumber(account?.payable_deposit) * installment
  const loan = isLoanApproved ? toNumber(account?.loan_installment) * installment : 0
  const interest = isLoanApproved ? toNumber(account?.interest_installment) * installment : 0

  return {
    deposit,
    loan,
    interest,
    total: deposit + loan + interest
  }
}
