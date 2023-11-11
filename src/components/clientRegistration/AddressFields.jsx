import { create } from 'mutative'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { districts } from '../../resources/staticData/districts'
import { divisions } from '../../resources/staticData/divisions'
import { policeStations } from '../../resources/staticData/policeStations'
import { postCodes } from '../../resources/staticData/postCodes'
import CheckboxInputField from '../utilities/CheckboxInputField'
import SelectBoxField from '../utilities/SelectBoxField'
import TextInputField from '../utilities/TextInputField'

export default function AddressFields({ clientData, setClientData, errors, setErrors, loading }) {
  const { t } = useTranslation()
  const [addressCheck, setAddressCheck] = useState(false)
  const lang = document.querySelector('html').lang
  const divisionData = useMemo(() => divisions(), [])
  const districtData = useMemo(() => districts(), [])
  const policeStationData = useMemo(() => policeStations(), [])
  const postCodeData = useMemo(() => postCodes(), [])

  const setCommonConfig = {
    freeSolo: true,
    clearOnBlur: true,
    getOptionLabel: (option) =>
      lang === 'en' ? option?.name || option : option?.bn_name || option,
    isOptionEqualToValue: (option, value) => option.id === value.id,
    renderOption: (props, option, state) => {
      props.key = props.id
      return (
        <li {...props}>{lang === 'en' ? option?.name || option : option?.bn_name || option}</li>
      )
    }
  }

  const presentDivisionConfig = {
    ...setCommonConfig,
    options: divisionData,
    value: clientData?.present_address_division || null,
    onInputChange: (e, option) =>
      setAddress(option, 'division', 'present_address', 'present_address_division')
  }
  const presentDistrictConfig = {
    ...setCommonConfig,
    options: districtData,
    value: clientData?.present_address_district || null,
    onInputChange: (e, option) =>
      setAddress(option, 'district', 'present_address', 'present_address_district')
  }
  const presentPoliceStationConfig = {
    ...setCommonConfig,
    options: policeStationData,
    value: clientData?.present_address_police_station || null,
    onInputChange: (e, option) =>
      setAddress(option, 'police_station', 'present_address', 'present_address_police_station')
  }
  const presentPostCodeConfig = {
    options: postCodeData,
    value: clientData?.present_address_post_code || null,
    freeSolo: true,
    clearOnBlur: true,
    getOptionLabel: (option) => option?.postCode || option,
    onInputChange: (e, option) =>
      setAddress(option, 'post_code', 'present_address', 'present_address_post_code'),
    isOptionEqualToValue: (option, value) => option.id === value.id,
    renderOption: (props, option, state) => {
      props.key = option.postCode
      return <li {...props}>{option?.postCode || option}</li>
    }
  }

  const permanentDivisionConfig = {
    ...setCommonConfig,
    options: divisionData,
    value: clientData?.permanent_address_division || null,
    onInputChange: (e, option) =>
      setAddress(option, 'division', 'permanent_address', 'permanent_address_division')
  }
  const permanentDistrictConfig = {
    ...setCommonConfig,
    options: districtData,
    value: clientData?.permanent_address_district || null,
    onInputChange: (e, option) =>
      setAddress(option, 'district', 'permanent_address', 'permanent_address_district')
  }
  const permanentPoliceStationConfig = {
    ...setCommonConfig,
    options: policeStationData,
    value: clientData?.permanent_address_police_station || null,
    onInputChange: (e, option) =>
      setAddress(option, 'police_station', 'permanent_address', 'permanent_address_police_station')
  }
  const permanentPostCodeConfig = {
    options: postCodeData,
    value: clientData?.permanent_address_post_code || null,
    freeSolo: true,
    clearOnBlur: true,
    getOptionLabel: (option) => option?.postCode || option,
    onInputChange: (e, option) =>
      setAddress(option, 'post_code', 'permanent_address', 'permanent_address_post_code'),
    isOptionEqualToValue: (option, value) => option.postCode === value.postCode,
    renderOption: (props, option, state) => {
      props.key = option.postCode
      return <li {...props}>{option?.postCode || option}</li>
    }
  }

  const setPermanentAddress = (isChecked) => {
    if (isChecked) {
      setClientData((prevData) =>
        create(prevData, (draftData) => {
          draftData['permanent_address'] = draftData.present_address
          draftData['permanent_address_district'] = draftData.present_address_district
          draftData['permanent_address_division'] = draftData.present_address_division
          draftData['permanent_address_police_station'] = draftData.present_address_police_station
          draftData['permanent_address_post_code'] = draftData.present_address_post_code
        })
      )
      setErrors((prevErr) =>
        create(prevErr, (draftErr) => {
          delete draftErr.permanent_address_district
          delete draftErr.permanent_address_division
          delete draftErr.permanent_address_police_station
          delete draftErr.permanent_address_post_office
          delete draftErr.permanent_address_city
          delete draftErr.permanent_address_street_address
        })
      )
    } else {
      setClientData((prevData) =>
        create(prevData, (draftData) => {
          draftData['permanent_address'] = {
            street_address: '',
            city: '',
            post_office: '',
            post_code: '',
            police_station: '',
            district: '',
            division: ''
          }
          delete draftData.permanent_address_district
          delete draftData.permanent_address_division
          delete draftData.permanent_address_police_station
          delete draftData.permanent_address_post_code
        })
      )
      setErrors((prevErr) =>
        create(prevErr, (draftErr) => {
          draftErr.permanent_address_district = `${t('common.district')} ${t(
            `common_validation.is_required`
          )}`
          draftErr.permanent_address_division = `${t('common.division')} ${t(
            `common_validation.is_required`
          )}`
          draftErr.permanent_address_police_station = `${t('common.police_station')} ${t(
            `common_validation.is_required`
          )}`
          draftErr.permanent_address_post_office = `${t('common.post_office')} ${t(
            `common_validation.is_required`
          )}`
          draftErr.permanent_address_city = `${t('common.city')} ${t(
            `common_validation.is_required`
          )}`
          draftErr.permanent_address_street_address = `${t('common.street_address')} ${t(
            `common_validation.is_required`
          )}`
        })
      )
    }
    setAddressCheck(isChecked)
  }

  const setAddress = (val, name, address, addressObj = null) => {
    setClientData((prevData) =>
      create(prevData, (draftData) => {
        if (name === 'post_code' && val !== '' && val !== null) {
          if (typeof val === 'string') {
            draftData[address][name] = val
            draftData[addressObj] = {
              postCode: val
            }
            return
          }
          draftData[address][name] = val?.postCode || ''
          draftData[addressObj] = val || null
          return
        }
        if (
          (name === 'police_station' || name === 'district' || name === 'division') &&
          val !== '' &&
          val !== null
        ) {
          if (typeof val === 'string') {
            draftData[address][name] = val
            draftData[addressObj] = {
              id: Math.floor(Math.random() * (99999 - 9999 + 1) + 9999),
              name: val,
              bn_name: val
            }
            return
          }
          draftData[address][name] = lang === 'en' ? val?.name || '' : val?.bn_name || ''
          draftData[addressObj] = val || null
          return
        }

        draftData[address][name] = val
      })
    )

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message
        if (name !== 'word_no') {
          val === '' || val === null
            ? (draftErr[`${address}_${name}`] = `${t(`common.${name}`)} ${t(
                `common_validation.is_required`
              )}`)
            : delete draftErr[`${address}_${name}`]
        }
      })
    )
  }

  return (
    <>
      {/* Present Address */}
      <div className="col-md-12 mt-5 mb-3">
        <div className="form-divider py-2 px-3">
          <h5>{t('common.present_address')}</h5>
        </div>
      </div>
      <div className="col-md-12 mb-3">
        <TextInputField
          label={t('common.street_address')}
          isRequired={true}
          defaultValue={clientData?.present_address?.street_address || ''}
          setChange={(val) => setAddress(val, 'street_address', 'present_address')}
          error={errors?.present_address_street_address}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <TextInputField
          label={t('common.city')}
          isRequired={true}
          defaultValue={clientData?.present_address?.city || ''}
          setChange={(val) => setAddress(val, 'city', 'present_address')}
          error={errors?.present_address_city}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <TextInputField
          label={t('common.word_no')}
          defaultValue={clientData?.present_address?.word_no || ''}
          setChange={(val) => setAddress(val, 'word_no', 'present_address')}
          error={errors?.present_address_word_no}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <TextInputField
          label={t('common.post_office')}
          isRequired={true}
          defaultValue={clientData?.present_address?.post_office || ''}
          setChange={(val) => setAddress(val, 'post_office', 'present_address')}
          error={errors?.present_address_post_office}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.post_code')}
          config={presentPostCodeConfig || {}}
          error={errors?.present_address_post_code}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.police_station')}
          config={presentPoliceStationConfig || {}}
          isRequired={true}
          error={errors?.present_address_police_station}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.district')}
          config={presentDistrictConfig || {}}
          isRequired={true}
          error={errors?.present_address_district}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.division')}
          config={presentDivisionConfig || {}}
          isRequired={true}
          error={errors?.present_address_division}
          disabled={loading?.clientRegistrationForm}
        />
      </div>

      {/* Permanent Address */}
      <div className="col-md-12 my-3">
        <div className="form-divider py-2 px-3 d-flex align-items-center justify-content-between">
          <h5>{t('common.permanent_address')}</h5>
          <div>
            <CheckboxInputField
              label={t('common.if_permanent_address_same_as_present_address')}
              isChecked={addressCheck}
              setChange={(e) => setPermanentAddress(e.target.checked)}
              error={false}
              disabled={loading?.clientRegistrationForm}
            />
          </div>
        </div>
      </div>
      <div className="col-md-12 mb-3">
        <TextInputField
          label={t('common.street_address')}
          isRequired={true}
          defaultValue={clientData?.permanent_address?.street_address || ''}
          setChange={(val) => setAddress(val, 'street_address', 'permanent_address')}
          error={errors?.permanent_address_street_address}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <TextInputField
          label={t('common.city')}
          isRequired={true}
          defaultValue={clientData?.permanent_address?.city || ''}
          setChange={(val) => setAddress(val, 'city', 'permanent_address')}
          error={errors?.permanent_address_city}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <TextInputField
          label={t('common.word_no')}
          defaultValue={clientData?.permanent_address?.word_no || ''}
          setChange={(val) => setAddress(val, 'word_no', 'permanent_address')}
          error={errors?.permanent_address_word_no}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <TextInputField
          label={t('common.post_office')}
          isRequired={true}
          defaultValue={clientData?.permanent_address?.post_office || ''}
          setChange={(val) => setAddress(val, 'post_office', 'permanent_address')}
          error={errors?.permanent_address_post_office}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.post_code')}
          config={permanentPostCodeConfig || {}}
          error={errors?.permanent_address_post_code}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.police_station')}
          config={permanentPoliceStationConfig || {}}
          isRequired={true}
          error={errors?.permanent_address_police_station}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.district')}
          config={permanentDistrictConfig || {}}
          isRequired={true}
          error={errors?.permanent_address_district}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.division')}
          config={permanentDivisionConfig || {}}
          isRequired={true}
          error={errors?.permanent_address_division}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
    </>
  )
}
