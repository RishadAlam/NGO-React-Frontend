import { useTranslation } from 'react-i18next'
import useFetch from '../../hooks/useFetch'
import tsNumbers from '../../libs/tsNumbers'
import DatePickerInputField from '../utilities/DatePickerInputField'
import RadioInputGroup from '../utilities/RadioInputGroup'
import SelectBoxField from '../utilities/SelectBoxField'
import TextInputField from '../utilities/TextInputField'

export default function NomineeFields({ i, nomineeData, setChange, errors, disabled }) {
  const { t } = useTranslation()
  const { data: { data: occupations = [] } = [] } = useFetch({
    action: 'client/registration/occupations'
  })

  const occupationConfig = {
    options: occupations,
    value: nomineeData?.occupation || null,
    freeSolo: true,
    onInputChange: (e, option) => setChange(option, 'occupation')
  }

  return (
    <>
      {/* Present Address */}
      <div className="col-md-12 mt-5 mb-3">
        <div className="form-divider py-2 px-3">
          <h5>{`${t('common.nominee_info')}-${tsNumbers(i + 1)}`}</h5>
        </div>
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.name')}
          isRequired={true}
          defaultValue={nomineeData?.name || ''}
          setChange={(val) => setChange(val, 'name')}
          error={errors?.name}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.father_name')}
          defaultValue={nomineeData?.father_name || ''}
          setChange={(val) => setChange(val, 'father_name')}
          isRequired={true}
          error={errors?.father_name}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.husband_name')}
          defaultValue={nomineeData?.husband_name || ''}
          setChange={(val) => setChange(val, 'husband_name')}
          error={errors?.husband_name}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.mother_name')}
          isRequired={true}
          defaultValue={nomineeData?.mother_name || ''}
          setChange={(val) => setChange(val, 'mother_name')}
          error={errors?.mother_name}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.nid')}
          isRequired={true}
          defaultValue={tsNumbers(nomineeData?.nid) || ''}
          setChange={(val) => setChange(val, 'nid')}
          error={errors?.nid}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <DatePickerInputField
          label={t('common.dob')}
          isRequired={true}
          defaultValue={nomineeData?.dob || ''}
          setChange={(val) => setChange(val, 'dob')}
          error={errors?.dob}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <SelectBoxField
          label={t('common.occupation')}
          config={occupationConfig}
          isRequired={true}
          error={errors?.occupation}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <RadioInputGroup
          label={t('common.gender')}
          options={[
            { label: t('common.male'), value: 'male' },
            { label: t('common.female'), value: 'female' },
            { label: t('common.others'), value: 'others' }
          ]}
          isRequired={true}
          defaultValue={nomineeData?.gender || ''}
          setChange={(val) => setChange(val, 'gender')}
          error={errors?.gender}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.primary_phone')}
          isRequired={true}
          defaultValue={tsNumbers(nomineeData?.primary_phone) || ''}
          setChange={(val) => setChange(val, 'primary_phone')}
          error={errors?.primary_phone}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-xl-4 mb-3">
        <TextInputField
          label={t('common.secondary_phone')}
          defaultValue={tsNumbers(nomineeData?.secondary_phone) || ''}
          setChange={(val) => setChange(val, 'secondary_phone')}
          error={errors?.secondary_phone}
          disabled={disabled}
        />
      </div>
    </>
  )
}
