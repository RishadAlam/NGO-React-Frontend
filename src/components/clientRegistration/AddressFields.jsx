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

  const presentDivisionConfig = {
    options: divisionData,
    value: clientData?.present_address_division || null,
    freeSolo: true,
    getOptionLabel: (option) =>
      lang === 'en' ? option?.name || option : option?.bn_name || option,
    onChange: (e, option) =>
      setAddress(option, 'division', 'present_address', 'present_address_division'),
    isOptionEqualToValue: (option, value) => option.id === value.id,
    renderOption: (props, option, state) => {
      props.key = props.id
      return (
        <li {...props}>{lang === 'en' ? option?.name || option : option?.bn_name || option}</li>
      )
    }
  }
  const presentDistrictConfig = {
    options: clientData?.present_address_division?.id
      ? districtData?.filter(
          (district) => district?.division_id === clientData?.present_address_division?.id
        )
      : districtData,
    value: clientData?.present_address_district || null,
    freeSolo: true,
    getOptionLabel: (option) =>
      lang === 'en' ? option?.name || option : option?.bn_name || option,
    onChange: (e, option) =>
      setAddress(option, 'district', 'present_address', 'present_address_district'),
    isOptionEqualToValue: (option, value) => option.id === value.id,
    renderOption: (props, option, state) => {
      props.key = props.id
      return (
        <li {...props}>{lang === 'en' ? option?.name || option : option?.bn_name || option}</li>
      )
    }
  }
  const presentPoliceStationConfig = {
    options: clientData?.present_address_district?.id
      ? policeStationData?.filter(
          (policeStation) => policeStation?.district_id === clientData?.present_address_district?.id
        )
      : policeStationData,
    value: clientData?.present_address_police_station || null,
    freeSolo: true,
    getOptionLabel: (option) =>
      lang === 'en' ? option?.name || option : option?.bn_name || option,
    onChange: (e, option) =>
      setAddress(option, 'police_station', 'present_address', 'present_address_police_station'),
    isOptionEqualToValue: (option, value) => option.id === value.id,
    renderOption: (props, option, state) => {
      props.key = props.id
      return (
        <li {...props}>{lang === 'en' ? option?.name || option : option?.bn_name || option}</li>
      )
    }
  }
  const presentPostCodeConfig = {
    options:
      clientData?.present_address_district?.id || clientData?.present_address_division?.id
        ? postCodeData?.filter(
            (postCode) =>
              postCode?.district_id === clientData?.present_address_district?.id ||
              postCode?.division_id === clientData?.present_address_division?.id
          )
        : postCodeData,
    value: clientData?.present_address_post_code || null,
    freeSolo: true,
    getOptionLabel: (option) => option?.postCode || option,
    onChange: (e, option) =>
      setAddress(option, 'post_code', 'present_address', 'present_address_post_code'),
    isOptionEqualToValue: (option, value) => option.id === value.id,
    renderOption: (props, option, state) => {
      props.key = option.postCode
      return <li {...props}>{option?.postCode || option}</li>
    }
  }

  const permanentDivisionConfig = {
    options: divisionData,
    value: clientData?.permanent_address_division || null,
    freeSolo: true,
    getOptionLabel: (option) =>
      lang === 'en' ? option?.name || option : option?.bn_name || option,
    onChange: (e, option) =>
      setAddress(option, 'division', 'permanent_address', 'permanent_address_division'),
    isOptionEqualToValue: (option, value) => option.id === value.id,
    renderOption: (props, option, state) => {
      props.key = props.id
      return (
        <li {...props}>{lang === 'en' ? option?.name || option : option?.bn_name || option}</li>
      )
    }
  }
  const permanentDistrictConfig = {
    options: clientData?.permanent_address_division?.id
      ? districtData?.filter(
          (district) => district?.division_id === clientData?.permanent_address_division?.id
        )
      : districtData,
    value: clientData?.permanent_address_district || null,
    freeSolo: true,
    getOptionLabel: (option) =>
      lang === 'en' ? option?.name || option : option?.bn_name || option,
    onChange: (e, option) =>
      setAddress(option, 'district', 'permanent_address', 'permanent_address_district'),
    isOptionEqualToValue: (option, value) => option.id === value.id,
    renderOption: (props, option, state) => {
      props.key = props.id
      return (
        <li {...props}>{lang === 'en' ? option?.name || option : option?.bn_name || option}</li>
      )
    }
  }
  const permanentPoliceStationConfig = {
    options: clientData?.permanent_address_district?.id
      ? policeStationData?.filter(
          (policeStation) =>
            policeStation?.district_id === clientData?.permanent_address_district?.id
        )
      : policeStationData,
    value: clientData?.permanent_address_police_station || null,
    freeSolo: true,
    getOptionLabel: (option) =>
      lang === 'en' ? option?.name || option : option?.bn_name || option,
    onChange: (e, option) =>
      setAddress(option, 'police_station', 'permanent_address', 'permanent_address_police_station'),
    isOptionEqualToValue: (option, value) => option.id === value.id,
    renderOption: (props, option, state) => {
      props.key = props.id
      return (
        <li {...props}>{lang === 'en' ? option?.name || option : option?.bn_name || option}</li>
      )
    }
  }
  const permanentPostCodeConfig = {
    options:
      clientData?.permanent_address_district?.id || clientData?.permanent_address_division?.id
        ? postCodeData?.filter(
            (postCode) =>
              postCode?.district_id === clientData?.permanent_address_district?.id ||
              postCode?.division_id === clientData?.permanent_address_division?.id
          )
        : postCodeData,
    value: clientData?.permanent_address_post_code || null,
    freeSolo: true,
    getOptionLabel: (option) => option?.postCode || option,
    onChange: (e, option) =>
      setAddress(option, 'post_code', 'permanent_address', 'permanent_address_post_code'),
    isOptionEqualToValue: (option, value) => option.id === value.id,
    renderOption: (props, option, state) => {
      props.key = option.postCode
      return <li {...props}>{option?.postCode || option}</li>
    }
  }

  const setPermanentAddress = (isChecked) => {
    console.log(isChecked)
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
    }
    setAddressCheck(isChecked)
  }

  const setAddress = (val, name, address, addressObj = null) => {
    setClientData((prevData) =>
      create(prevData, (draftData) => {
        if (name === 'post_code') {
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
          name === 'post_code' ||
          name === 'police_station' ||
          name === 'district' ||
          name === 'division'
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

    // setErrors((prevErr) =>
    //   create(prevErr, (draftErr) => {
    //     delete draftErr.message
    //     val === '' || val === null
    //       ? (draftErr[name] = `${t(`common.${name}`)} ${t(`common_validation.is_required`)}`)
    //       : delete draftErr[name]
    //   })
    // )
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
          error={errors?.present_address?.street_address}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <TextInputField
          label={t('common.city')}
          isRequired={true}
          defaultValue={clientData?.present_address?.city || ''}
          setChange={(val) => setAddress(val, 'city', 'present_address')}
          error={errors?.present_address?.city}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <TextInputField
          label={t('common.post_office')}
          isRequired={true}
          defaultValue={clientData?.present_address?.post_office || ''}
          setChange={(val) => setAddress(val, 'post_office', 'present_address')}
          error={errors?.present_address?.post_office}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.post_code')}
          config={presentPostCodeConfig || {}}
          isRequired={true}
          error={errors?.present_address?.post_code}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.police_station')}
          config={presentPoliceStationConfig || {}}
          isRequired={true}
          error={errors?.present_address?.police_station}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.district')}
          config={presentDistrictConfig || {}}
          isRequired={true}
          error={errors?.present_address?.district}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.division')}
          config={presentDivisionConfig || {}}
          isRequired={true}
          error={errors?.present_address?.division}
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
          error={errors?.permanent_address?.street_address}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <TextInputField
          label={t('common.city')}
          isRequired={true}
          defaultValue={clientData?.permanent_address?.city || ''}
          setChange={(val) => setAddress(val, 'city', 'permanent_address')}
          error={errors?.permanent_address?.city}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <TextInputField
          label={t('common.post_office')}
          isRequired={true}
          defaultValue={clientData?.permanent_address?.post_office || ''}
          setChange={(val) => setAddress(val, 'post_office', 'permanent_address')}
          error={errors?.permanent_address?.post_office}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.post_code')}
          config={permanentPostCodeConfig || {}}
          isRequired={true}
          error={errors?.permanent_address?.post_code}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.police_station')}
          config={permanentPoliceStationConfig || {}}
          isRequired={true}
          error={errors?.permanent_address?.police_station}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.district')}
          config={permanentDistrictConfig || {}}
          isRequired={true}
          error={errors?.permanent_address?.district}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
      <div className="col-md-6 col-lg-4 mb-3">
        <SelectBoxField
          label={t('common.division')}
          config={permanentDivisionConfig || {}}
          isRequired={true}
          error={errors?.permanent_address?.division}
          disabled={loading?.clientRegistrationForm}
        />
      </div>
    </>
  )
}
