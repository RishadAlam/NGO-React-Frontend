import { create } from 'mutative'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { bn_districts, en_districts } from '../../resources/staticData/districts'
import { bn_divisions, en_divisions } from '../../resources/staticData/divisions'
import { bn_police_stations, en_police_stations } from '../../resources/staticData/policeStations'
import { bn_post_codes, en_post_codes } from '../../resources/staticData/postCodes'
import CheckboxInputField from '../utilities/CheckboxInputField'
import SelectBoxField from '../utilities/SelectBoxField'
import TextInputField from '../utilities/TextInputField'

export default function AddressFields({ clientData, setClientData, errors, setErrors, disabled }) {
  const { t } = useTranslation()
  const [addressCheck, setAddressCheck] = useState(false)
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

  const presentDivisionConfig = {
    ...setCommonConfig,
    options: divisionData,
    value: clientData?.present_address?.division || null,
    onInputChange: (e, option) => setAddress(option, 'division', 'present_address')
  }
  const presentDistrictConfig = {
    ...setCommonConfig,
    options: districtData,
    value: clientData?.present_address?.district || null,
    onInputChange: (e, option) => setAddress(option, 'district', 'present_address')
  }
  const presentPoliceStationConfig = {
    ...setCommonConfig,
    options: policeStationData,
    value: clientData?.present_address?.police_station || null,
    onInputChange: (e, option) => setAddress(option, 'police_station', 'present_address')
  }
  const presentPostOfficeConfig = {
    ...setCommonConfig,
    options: postCodeData,
    value: clientData?.present_address?.post_office || null,
    onInputChange: (e, option) => setAddress(option, 'post_office', 'present_address')
  }

  const permanentDivisionConfig = {
    ...setCommonConfig,
    options: divisionData,
    value: clientData?.permanent_address?.division || null,
    onInputChange: (e, option) => setAddress(option, 'division', 'permanent_address')
  }
  const permanentDistrictConfig = {
    ...setCommonConfig,
    options: districtData,
    value: clientData?.permanent_address?.district || null,
    onInputChange: (e, option) => setAddress(option, 'district', 'permanent_address')
  }
  const permanentPoliceStationConfig = {
    ...setCommonConfig,
    options: policeStationData,
    value: clientData?.permanent_address?.police_station || null,
    onInputChange: (e, option) => setAddress(option, 'police_station', 'permanent_address')
  }
  const permanentPostOfficeConfig = {
    ...setCommonConfig,
    options: postCodeData,
    value: clientData?.permanent_address?.post_office || null,
    onInputChange: (e, option) => setAddress(option, 'post_office', 'permanent_address')
  }

  const setPermanentAddress = (isChecked) => {
    if (isChecked) {
      setClientData((prevData) =>
        create(prevData, (draftData) => {
          draftData['permanent_address'] = draftData.present_address
        })
      )
      setErrors((prevErr) =>
        create(prevErr, (draftErr) => {
          clientData.present_address.division ? delete draftErr.permanent_address_division : ''
          clientData.present_address.district ? delete draftErr.permanent_address_district : ''
          clientData.present_address.police_station
            ? delete draftErr.permanent_address_police_station
            : ''
          clientData.present_address.post_office
            ? delete draftErr.permanent_address_post_office
            : ''
          clientData.present_address.city ? delete draftErr.permanent_address_city : ''
          clientData.present_address.street_address
            ? delete draftErr.permanent_address_street_address
            : ''
        })
      )
    } else {
      setClientData((prevData) =>
        create(prevData, (draftData) => {
          draftData['permanent_address'] = {
            street_address: '',
            city: '',
            post_office: '',
            police_station: '',
            district: '',
            division: ''
          }
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

  const setAddress = (val, name, address) => {
    setClientData((prevData) =>
      create(prevData, (draftData) => {
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
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <TextInputField
          label={t('common.city')}
          isRequired={true}
          defaultValue={clientData?.present_address?.city || ''}
          setChange={(val) => setAddress(val, 'city', 'present_address')}
          error={errors?.present_address_city}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <TextInputField
          label={t('common.word_no')}
          defaultValue={clientData?.present_address?.word_no || ''}
          setChange={(val) => setAddress(val, 'word_no', 'present_address')}
          error={errors?.present_address_word_no}
          disabled={disabled}
        />
      </div>
      {/* <div className="col-md-6 col-lg-4 mb-3">
        <TextInputField
          label={t('common.post_office')}
          isRequired={true}
          defaultValue={clientData?.present_address?.post_office || ''}
          setChange={(val) => setAddress(val, 'post_office', 'present_address')}
          error={errors?.present_address_post_office}
          disabled={disabled}
        />
      </div> */}
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.post_office')}
          isRequired={true}
          config={presentPostOfficeConfig || {}}
          error={errors?.present_address_post_office}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.police_station')}
          config={presentPoliceStationConfig || {}}
          isRequired={true}
          error={errors?.present_address_police_station}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.district')}
          config={presentDistrictConfig || {}}
          isRequired={true}
          error={errors?.present_address_district}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.division')}
          config={presentDivisionConfig || {}}
          isRequired={true}
          error={errors?.present_address_division}
          disabled={disabled}
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
              disabled={disabled}
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
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <TextInputField
          label={t('common.city')}
          isRequired={true}
          defaultValue={clientData?.permanent_address?.city || ''}
          setChange={(val) => setAddress(val, 'city', 'permanent_address')}
          error={errors?.permanent_address_city}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <TextInputField
          label={t('common.word_no')}
          defaultValue={clientData?.permanent_address?.word_no || ''}
          setChange={(val) => setAddress(val, 'word_no', 'permanent_address')}
          error={errors?.permanent_address_word_no}
          disabled={disabled}
        />
      </div>
      {/* <div className="col-md-6 col-lg-4 mb-3">
        <TextInputField
          label={t('common.post_office')}
          isRequired={true}
          defaultValue={clientData?.permanent_address?.post_office || ''}
          setChange={(val) => setAddress(val, 'post_office', 'permanent_address')}
          error={errors?.permanent_address_post_office}
          disabled={disabled}
        />
      </div> */}
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.post_office')}
          config={permanentPostOfficeConfig || {}}
          error={errors?.permanent_address_post_office}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.police_station')}
          config={permanentPoliceStationConfig || {}}
          isRequired={true}
          error={errors?.permanent_address_police_station}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.district')}
          config={permanentDistrictConfig || {}}
          isRequired={true}
          error={errors?.permanent_address_district}
          disabled={disabled}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.division')}
          config={permanentDivisionConfig || {}}
          isRequired={true}
          error={errors?.permanent_address_division}
          disabled={disabled}
        />
      </div>
    </>
  )
}
