import { create } from 'mutative'

export default function checkPassword(password, SetErrors) {
  const uppercaseRegExp = /(?=.*?[A-Z])/
  const lowercaseRegExp = /(?=.*?[a-z])/
  const digitsRegExp = /(?=.*?[0-9])/
  const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/

  SetErrors((prevErrors) =>
    create(prevErrors, (draftErrors) => {
      password.length < 8 ? (draftErrors.passwordLength = true) : delete draftErrors.passwordLength
      !uppercaseRegExp.test(password)
        ? (draftErrors.passwordUppercase = true)
        : delete draftErrors.passwordUppercase
      !lowercaseRegExp.test(password)
        ? (draftErrors.passwordLowercase = true)
        : delete draftErrors.passwordLowercase
      !digitsRegExp.test(password)
        ? (draftErrors.passwordDigits = true)
        : delete draftErrors.passwordDigits
      !specialCharRegExp.test(password)
        ? (draftErrors.passwordSpecial = true)
        : delete draftErrors.passwordSpecial
    })
  )
}
