import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { create } from 'mutative'
import { useTranslation } from 'react-i18next'
import { setNomiGuarantorFields } from '../../helper/RegFormFieldsData'
import PlusCircle from '../../icons/PlusCircle'
import XCircle from '../../icons/XCircle'
import dateFormat from '../../libs/dateFormat'
import tsNumbers from '../../libs/tsNumbers'
import ActionBtnGroup from '../utilities/ActionBtnGroup'
import GuarantorFields from './GuarantorFields'

export default function Guarantors({
  formData,
  setFormData,
  fields,
  centers,
  errors,
  setErrors,
  disabled
}) {
  const { t } = useTranslation()
  const addGuarantor = (length) => {
    if (length < 5) {
      setFormData((prevData) =>
        create(prevData, (draftData) => {
          draftData.guarantors.splice(length, 0, setNomiGuarantorFields()[0])
        })
      )
      setErrors((prevErr) =>
        create(prevErr, (draftErr) => {
          draftErr['guarantors'] = draftErr?.guarantors || []
          // draftErr.guarantors.splice(length, 0, guarantorFieldsErrs)
          draftErr.guarantors[length] = guarantorFieldsErrs
        })
      )
    }
  }

  const removeGuarantor = (length) => {
    if (length > 1) {
      setFormData((prevData) =>
        create(prevData, (draftData) => {
          draftData.guarantors.pop()
        })
      )
      setErrors((prevErr) =>
        create(prevErr, (draftErr) => {
          draftErr.guarantors.pop()
          if (!draftErr?.guarantors.length) {
            delete draftErr.guarantors
          }
        })
      )
    }
  }

  const setChange = (val, name, index) => {
    if (name === 'primary_phone' || name === 'secondary_phone' || name === 'nid') {
      val = tsNumbers(val, true)
    }

    setFormData((prevData) =>
      create(prevData, (draftData) => {
        if (name === 'dob') {
          draftData.guarantors[index].dob = dateFormat(val, 'yyyy-MM-dd')
          return
        } else if (name === 'image') {
          draftData.guarantors[index].image = val
          draftData.guarantors[index].image_uri = null
          return
        } else if (name === 'signature') {
          draftData.guarantors[index].signature = val
          draftData.guarantors[index].signature_uri = null
          return
        }
        draftData.guarantors[index][name] = val
      })
    )

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr?.message
        draftErr['guarantors'] = draftErr['guarantors'] || []
        draftErr['guarantors'][index] = draftErr['guarantors'][index] || {}

        if (name !== 'husband_name') {
          if (name === 'primary_phone' || name === 'secondary_phone') {
            val.length !== 11 ||
            !String(val).startsWith('01') ||
            !Number(val) ||
            val === '' ||
            val === null
              ? (draftErr.guarantors[index][name] = `${t(`common.${name}`)} ${t(
                  'common_validation.is_invalid'
                )}`)
              : draftErr['guarantors'] &&
                draftErr['guarantors'][index] &&
                delete draftErr['guarantors'][index][name]

            if (name === 'secondary_phone' && val === '') {
              draftErr['guarantors'] &&
                draftErr['guarantors'][index] &&
                delete draftErr['guarantors'][index][name]
            }
          } else if (name === 'nid') {
            !Number(val) || val === '' || val === null
              ? (draftErr.guarantors[index][name] = `${t(`common.${name}`)} ${t(
                  'common_validation.is_invalid'
                )}`)
              : draftErr['guarantors'] &&
                draftErr['guarantors'][index] &&
                delete draftErr['guarantors'][index][name]
          } else {
            val === '' || val === null
              ? (draftErr.guarantors[index][name] = `${t(`common.${name}`)} ${t(
                  `common_validation.is_required`
                )}`)
              : draftErr['guarantors'] &&
                draftErr['guarantors'][index] &&
                delete draftErr['guarantors'][index][name]
          }
        }
      })
    )
  }

  return (
    <>
      {formData?.guarantors &&
        formData?.guarantors.map((guarantor, i) => (
          <GuarantorFields
            key={i}
            guarantorData={guarantor}
            setGuarantorData={setFormData}
            fields={fields}
            centers={centers}
            i={i}
            setChange={setChange}
            errors={(errors?.guarantors && errors?.guarantors[i]) || {}}
            setErrors={setErrors}
            disabled={disabled}
          />
        ))}
      {!disabled && (
        <div className="col-md-12 d-flex justify-content-center my-3">
          <ActionBtnGroup>
            <Tooltip
              TransitionComponent={Zoom}
              title={t('common.add_guarantor')}
              arrow
              followCursor>
              <span>
                <IconButton
                  className="text-success"
                  onClick={() => addGuarantor(formData?.guarantors?.length)}
                  disabled={
                    formData?.guarantors && formData?.guarantors?.length < 5 ? false : true
                  }>
                  {<PlusCircle size={24} />}
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip
              TransitionComponent={Zoom}
              title={t('common.remove_guarantor')}
              arrow
              followCursor>
              <span>
                <IconButton
                  className="text-danger"
                  onClick={() => removeGuarantor(formData?.guarantors?.length)}
                  disabled={
                    formData?.guarantors && formData?.guarantors?.length > 1 ? false : true
                  }>
                  {<XCircle size={24} />}
                </IconButton>
              </span>
            </Tooltip>
          </ActionBtnGroup>
        </div>
      )}
    </>
  )
}

const guarantorFieldsErrs = {
  name: '',
  father_name: '',
  mother_name: '',
  nid: '',
  occupation: '',
  relation: '',
  gender: '',
  primary_phone: '',
  image: '',
  address: {
    street_address: '',
    city: '',
    post_office: '',
    police_station: '',
    district: '',
    division: ''
  }
}
