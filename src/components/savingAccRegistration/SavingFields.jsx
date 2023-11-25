import { create } from 'mutative'
import { useTranslation } from 'react-i18next'
import tsNumbers from '../../libs/tsNumbers'
import DatePickerInputField from '../utilities/DatePickerInputField'
import TextInputField from '../utilities/TextInputField'

export default function SavingFields({ formData, setFormData, errors, setErrors, disabled }) {
  const { t } = useTranslation()

  const total = (deposit = 0, installment = 0, interest = 0, ints = false) => {
    const total = Math.round(installment * deposit)
    if (ints) {
      return Math.ceil(parseFloat(total) + parseFloat((total / 100) * interest))
    }
    return total
  }

  const setChange = (val, name) => {
    val = tsNumbers(val, true)
    setFormData((prevData) =>
      create(prevData, (draftData) => {
        draftData[name] = val
        if (name !== 'start_date' && name !== 'duration_date') {
          draftData.total_deposit_without_interest = total(
            name === 'payable_deposit' ? val : formData.payable_deposit,
            name === 'payable_installment' ? val : formData.payable_installment,
            name === 'payable_interest' ? val : formData.payable_interest
          )
          draftData.total_deposit_with_interest = total(
            name === 'payable_deposit' ? val : formData.payable_deposit,
            name === 'payable_installment' ? val : formData.payable_installment,
            name === 'payable_interest' ? val : formData.payable_interest,
            true
          )
        }
      })
    )

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message
        if (!Number(val)) {
          draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_invalid`)}`
          return
        }

        val === '' || val === null
          ? (draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_required`)}`)
          : delete draftErr[name]
      })
    )
  }

  return (
    <>
      {/* Present Address */}
      <div className="col-md-12 mt-5 mb-3">
        <div className="form-divider py-2 px-3">
          <h5>{t('common.saving_info')}</h5>
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
          label={t('common.total_deposit_without_interest')}
          isRequired={true}
          defaultValue={tsNumbers(formData?.total_deposit_without_interest) || ''}
          setChange={(val) => setChange(val, 'total_deposit_without_interest')}
          error={errors?.total_deposit_without_interest}
          disabled={true}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.total_deposit_with_interest')}
          isRequired={true}
          defaultValue={tsNumbers(formData?.total_deposit_with_interest) || ''}
          setChange={(val) => setChange(val, 'total_deposit_with_interest')}
          error={errors?.total_deposit_with_interest}
          disabled={true}
        />
      </div>
    </>
  )
}
