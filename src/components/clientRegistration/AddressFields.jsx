import { create } from 'mutative'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isEmpty } from '../../helper/isEmpty'
import tsNumbers from '../../libs/tsNumbers'
import AddressGrp from '../_helper/AddressGrp'
import CheckboxInputField from '../utilities/CheckboxInputField'

export default function AddressFields({ clientData, setClientData, errors, setErrors, disabled }) {
  const { t } = useTranslation()
  const [addressCheck, setAddressCheck] = useState(false)

  const setPermanentAddress = (isChecked) => {
    const addressErrKeys = [
      'street_address',
      'city',
      'post_office',
      'police_station',
      'district',
      'division'
    ]

    if (isChecked) {
      setClientData((prevData) =>
        create(prevData, (draftData) => {
          draftData['permanent_address'] = draftData.present_address
        })
      )
      setErrors((prevErr) =>
        create(prevErr, (draftErr) => {
          addressErrKeys.forEach((address) => {
            isEmpty(clientData.present_address[address])
              ? (draftErr.permanent_address[address] = `${t(`common.${address}`)} ${t(
                  `common_validation.is_required`
                )}`)
              : delete draftErr.permanent_address[address]
          })
        })
      )
    } else {
      setClientData((prevData) =>
        create(prevData, (draftData) => {
          draftData.permanent_address = {
            street_address: '',
            city: '',
            word_no: '',
            post_office: '',
            police_station: '',
            district: '',
            division: ''
          }
        })
      )
      setErrors((prevErr) =>
        create(prevErr, (draftErr) => {
          addressErrKeys.forEach((address) => {
            draftErr['permanent_address'][address] = `${t(`common.${address}`)} ${t(
              `common_validation.is_required`
            )}`
          })
        })
      )
    }
    setAddressCheck(isChecked)
  }

  const setAddress = (val, name, address) => {
    if (name === 'word_no') {
      val = tsNumbers(val, true)
    }

    setClientData((prevData) =>
      create(prevData, (draftData) => {
        draftData[address][name] = val
      })
    )

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message
        draftErr[address] = draftErr[address] || {}

        if (name === 'word_no' && !Number(val) && !isEmpty(val)) {
          draftErr[address][name] = `${t(`common.${name}`)} ${t(`common_validation.is_invalid`)}`
          return
        }

        if (name !== 'word_no') {
          isEmpty(val)
            ? (draftErr[address][name] = `${t(`common.${name}`)} ${t(
                `common_validation.is_required`
              )}`)
            : draftErr[address] && delete draftErr[address][name]
        } else if (isEmpty(val) || Number(val)) {
          draftErr[address] && delete draftErr[address][name]
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
      <AddressGrp
        addressData={clientData.present_address}
        setAddress={setAddress}
        errors={errors?.present_address || null}
        disabled={disabled}
        index="present_address"
      />

      {/* Permanent Address */}
      <div className="col-md-12 my-3">
        <div className="form-divider py-2 px-3 d-flex align-items-center justify-content-between">
          <h6>{t('common.permanent_address')}</h6>
          {!disabled && (
            <div>
              <CheckboxInputField
                label={t('common.if_permanent_address_same_as_present_address')}
                isChecked={addressCheck}
                setChange={(e) => setPermanentAddress(e.target.checked)}
                error={false}
                disabled={disabled}
              />
            </div>
          )}
        </div>
      </div>
      <AddressGrp
        addressData={clientData.permanent_address}
        setAddress={setAddress}
        errors={errors?.permanent_address || null}
        disabled={disabled}
        index="permanent_address"
      />
    </>
  )
}
