import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import tsNumbers from '../../libs/tsNumbers'
import { bn_districts, en_districts } from '../../resources/staticData/districts'
import { bn_divisions, en_divisions } from '../../resources/staticData/divisions'
import { bn_police_stations, en_police_stations } from '../../resources/staticData/policeStations'
import { bn_post_codes, en_post_codes } from '../../resources/staticData/postCodes'
import SelectBoxField from '../utilities/SelectBoxField'
import TextInputField from '../utilities/TextInputField'

export default function AddressGrp({ addressData, setAddress, errors, disabled, index = null }) {
  const { t } = useTranslation()
  const lang = document.querySelector('html').lang
  const divisionData = useMemo(() => (lang === 'en' ? en_divisions() : bn_divisions()), [lang])
  const districtData = useMemo(() => (lang === 'en' ? en_districts() : bn_districts()), [lang])
  const policeStationData = useMemo(
    () => (lang === 'en' ? en_police_stations() : bn_police_stations()),
    [lang]
  )
  const postCodeData = useMemo(() => (lang === 'en' ? en_post_codes() : bn_post_codes()), [lang])

  const setCommonConfig = {
    freeSolo: true,
    clearOnBlur: true
  }

  const divisionConfig = {
    ...setCommonConfig,
    options: divisionData,
    value: addressData?.division || null,
    onInputChange: (e, option) => setAddress(option, 'division', index)
  }
  const districtConfig = {
    ...setCommonConfig,
    options: districtData,
    value: addressData?.district || null,
    onInputChange: (e, option) => setAddress(option, 'district', index)
  }
  const policeStationConfig = {
    ...setCommonConfig,
    options: policeStationData,
    value: addressData?.police_station || null,
    onInputChange: (e, option) => setAddress(option, 'police_station', index)
  }
  const postOfficeConfig = {
    ...setCommonConfig,
    options: postCodeData,
    value: addressData?.post_office || null,
    onInputChange: (e, option) => setAddress(option, 'post_office', index)
  }

  return (
    <>
      <div className="col-md-12 mb-3">
        <TextInputField
          label={t('common.street_address')}
          isRequired={true}
          defaultValue={addressData?.street_address || ''}
          setChange={(val) => setAddress(val, 'street_address', index)}
          error={errors?.street_address || ''}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <TextInputField
          label={t('common.city')}
          isRequired={true}
          defaultValue={addressData?.city || ''}
          setChange={(val) => setAddress(val, 'city', index)}
          error={errors?.city || ''}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <TextInputField
          label={t('common.word_no')}
          defaultValue={tsNumbers(addressData?.word_no) || ''}
          setChange={(val) => setAddress(val, 'word_no', index)}
          error={errors?.word_no || ''}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.post_office')}
          isRequired={true}
          config={postOfficeConfig || {}}
          error={errors?.post_office || ''}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.police_station')}
          config={policeStationConfig || {}}
          isRequired={true}
          error={errors?.police_station || ''}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.district')}
          config={districtConfig || {}}
          isRequired={true}
          error={errors?.district || ''}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.division')}
          config={divisionConfig || {}}
          isRequired={true}
          error={errors?.division || ''}
          disabled={disabled}
        />
      </div>
    </>
  )
}
