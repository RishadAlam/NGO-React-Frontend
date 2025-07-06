import { create } from 'mutative'
import { useTranslation } from 'react-i18next'
import { isEmpty } from '../../helper/isEmpty'
import dateFormat from '../../libs/dateFormat'
import tsNumbers from '../../libs/tsNumbers'
import DatePickerInputField from '../utilities/DatePickerInputField'
import TextInputField from '../utilities/TextInputField'

export default function LoanFields({ formData, setFormData, errors, setErrors, disabled }) {
  const { t } = useTranslation()

  const calculateLoanDetails = (
    loanAmount = 0,
    totalInstallments = 0,
    interestRatePercentage = 0
  ) => {
    // Convert interest rate percentage to decimal
    const interestRateDecimal = Number(interestRatePercentage) / 100

    // Calculate total interest
    const totalInterest = Math.ceil(Number(loanAmount) * interestRateDecimal)

    // Calculate total loan with interest
    const totalLoan = Number(loanAmount) + totalInterest

    // Calculate loan installment
    const loanInstallment = Math.ceil(Number(loanAmount) / Number(totalInstallments))

    // Calculate interest installment
    const interestInstallment = Math.ceil(totalInterest / Number(totalInstallments))

    return {
      totalInterest,
      totalLoan,
      loanInstallment,
      interestInstallment
    }
  }

  const setChange = (val, name) => {
    val = tsNumbers(val, true)

    setFormData((prevData) =>
      create(prevData, (draftData) => {
        draftData[name] = val
        if (name !== 'start_date' && name !== 'duration_date' && Number(val) && !isEmpty(val)) {
          const { totalInterest, totalLoan, loanInstallment, interestInstallment } =
            calculateLoanDetails(
              name === 'loan_given' ? val : formData.loan_given,
              name === 'payable_installment' ? val : formData.payable_installment,
              name === 'payable_interest' ? val : formData.payable_interest
            )

          draftData.total_payable_interest = totalInterest
          draftData.total_payable_loan_with_interest = totalLoan
          draftData.loan_installment = loanInstallment
          draftData.interest_installment = interestInstallment
          draftData.total_payable_loan_installment = loanInstallment + interestInstallment
          return
        }

        if (name === 'start_date' || name === 'duration_date') {
          draftData[name] = val !== 'null' ? dateFormat(val, 'yyyy-MM-dd') : ''
        }
      })
    )

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message

        if (name !== 'start_date' && name !== 'duration_date') {
          if (!Number(val) && !isEmpty(val)) {
            draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_invalid`)}`
          } else if (isEmpty(val)) {
            draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_required`)}`
          } else {
            delete draftErr[name]
            delete draftErr?.total_payable_interest
            delete draftErr?.total_payable_loan_with_interest
            delete draftErr?.loan_installment
            delete draftErr?.interest_installment
            delete draftErr?.total_payable_loan_installment
          }
        } else {
          isEmpty(val)
            ? (draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_required`)}`)
            : delete draftErr[name]
        }
      })
    )
  }

  return (
    <>
      {/* Present Address */}
      <div className="col-md-12 mt-5 mb-3">
        <div className="form-divider py-2 px-3">
          <h5>{t('common.loan_info')}</h5>
        </div>
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <DatePickerInputField
          label={t('common.start_date')}
          isRequired={true}
          defaultValue={formData?.start_date || ''}
          setChange={(val) => setChange(val, 'start_date')}
          error={errors?.start_date}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <DatePickerInputField
          label={t('common.duration_date')}
          isRequired={true}
          defaultValue={formData?.duration_date || ''}
          setChange={(val) => setChange(val, 'duration_date')}
          error={errors?.duration_date}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.loan_given')}
          isRequired={true}
          defaultValue={tsNumbers(formData?.loan_given) || ''}
          setChange={(val) => setChange(val, 'loan_given')}
          error={errors?.loan_given}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.deposit')}
          isRequired={true}
          defaultValue={tsNumbers(formData?.payable_deposit) || ''}
          setChange={(val) => setChange(val, 'payable_deposit')}
          error={errors?.payable_deposit}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.total_installment')}
          isRequired={true}
          defaultValue={tsNumbers(formData?.payable_installment) || ''}
          setChange={(val) => setChange(val, 'payable_installment')}
          error={errors?.payable_installment}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={`${t('common.interest')}(%)`}
          isRequired={true}
          defaultValue={tsNumbers(formData?.payable_interest) || ''}
          setChange={(val) => setChange(val, 'payable_interest')}
          error={errors?.payable_interest}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={`${t('common.total')} ${t('common.interest')}`}
          isRequired={true}
          defaultValue={tsNumbers(formData?.total_payable_interest) || ''}
          setChange={(val) => setChange(val, 'total_payable_interest')}
          error={errors?.total_payable_interest}
          disabled={true}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.total_payable_loan_with_interest')}
          isRequired={true}
          defaultValue={tsNumbers(formData?.total_payable_loan_with_interest) || ''}
          setChange={(val) => setChange(val, 'total_payable_loan_with_interest')}
          error={errors?.total_payable_loan_with_interest}
          disabled={true}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.loan_installment')}
          isRequired={true}
          defaultValue={tsNumbers(formData?.loan_installment) || ''}
          setChange={(val) => setChange(val, 'loan_installment')}
          error={errors?.loan_installment}
          disabled={true}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.interest_installment')}
          isRequired={true}
          defaultValue={tsNumbers(formData?.interest_installment) || ''}
          setChange={(val) => setChange(val, 'interest_installment')}
          error={errors?.interest_installment}
          disabled={true}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.total_payable_loan_installment')}
          isRequired={true}
          defaultValue={tsNumbers(formData?.total_payable_loan_installment) || ''}
          setChange={(val) => setChange(val, 'total_payable_loan_installment')}
          error={errors?.total_payable_loan_installment}
          disabled={true}
        />
      </div>
    </>
  )
}
