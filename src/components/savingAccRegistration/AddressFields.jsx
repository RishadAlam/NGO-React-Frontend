import { create } from 'mutative'
import { useTranslation } from 'react-i18next'
import tsNumbers from '../../libs/tsNumbers'
import AddressGrp from '../_helper/AddressGrp'

export default function AddressFields({
  i,
  addressData,
  setAddressData,
  errors,
  setErrors,
  disabled
}) {
  const { t } = useTranslation()

  const setAddress = (val, name, index) => {
    if (name === 'word_no') {
      val = tsNumbers(val, true)
    }

    setAddressData((prevData) =>
      create(prevData, (draftData) => {
        draftData.nominees[index].address[name] = val
      })
    )

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr?.message

        if (name !== 'word_no') {
          val === '' || val === null
            ? (draftErr.nominees[index]['address'][name] = `${t(`common.${name}`)} ${t(
                `common_validation.is_required`
              )}`)
            : delete draftErr['nominees'][index]['address'][name]
        } else if (name === 'word_no' && !Number(val)) {
          draftErr.nominees[index]['address'][name] = `${t(`common.${name}`)} ${t(
            `common_validation.is_invalid`
          )}`
        }
        if (val !== '' && val !== null) {
          delete draftErr['nominees'][index]['address'][name]
        }
      })
    )
  }

  return (
    <>
      {/* Present Address */}
      <div className="col-md-12 mt-5 mb-3">
        <div className="form-divider py-2 px-3">
          <h5>{`${t('common.address')} - ${tsNumbers((i + 1).toString().padStart(2, '0'))}`}</h5>
        </div>
      </div>
      <AddressGrp
        addressData={addressData}
        setAddress={setAddress}
        errors={errors || null}
        disabled={disabled}
        index={i}
      />
    </>
  )
}
