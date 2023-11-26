import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { create } from 'mutative'
import { useTranslation } from 'react-i18next'
import PlusCircle from '../../icons/PlusCircle'
import XCircle from '../../icons/XCircle'
import dateFormat from '../../libs/dateFormat'
import ActionBtnGroup from '../utilities/ActionBtnGroup'
import NomineeFields from './NomineeFields'

export default function Nominees({ formData, setFormData, errors, setErrors, disabled }) {
  const { t } = useTranslation()

  const total = (deposit = 0, installment = 0, interest = 0, ints = false) => {
    const total = Math.round(installment * deposit)
    if (ints) {
      return Math.ceil(parseFloat(total) + parseFloat((total / 100) * interest))
    }
    return total
  }
  console.log(formData.nominees)
  console.log(errors)
  const addNominee = () => {
    if (formData.nominees.length < 5) {
      setFormData((prevData) =>
        create(prevData, (draftData) => {
          draftData.nominees.splice(draftData.nominees.length, 0, {
            name: '',
            father_name: '',
            husband_name: '',
            mother_name: '',
            nid: '',
            dob: dateFormat(new Date(), 'yyyy-MM-dd'),
            occupation: '',
            relation: '',
            gender: '',
            primary_phone: '',
            secondary_phone: '',
            image: '',
            signature: '',
            address: {
              street_address: '',
              city: '',
              word_no: '',
              post_office: '',
              post_code: '',
              police_station: '',
              district: '',
              division: ''
            }
          })
        })
      )
      setErrors((prevErr) =>
        create(prevErr, (draftErr) => {
          draftErr.nominees.splice(draftErr.nominees.length, 0, {
            name: '',
            father_name: '',
            husband_name: '',
            mother_name: '',
            nid: '',
            occupation: '',
            relation: '',
            gender: '',
            primary_phone: '',
            secondary_phone: '',
            image: '',
            signature: '',
            address: {
              street_address: '',
              city: '',
              word_no: '',
              post_office: '',
              post_code: '',
              police_station: '',
              district: '',
              division: ''
            }
          })
        })
      )
    }
  }

  const removeNominee = () => {
    if (formData.nominees.length > 1) {
      setFormData((prevData) =>
        create(prevData, (draftData) => {
          draftData.nominees.pop()
        })
      )
      setErrors((prevErr) =>
        create(prevErr, (draftErr) => {
          draftErr.nominees.pop()
        })
      )
    }
  }

  const setChange = (val, name, index) => {
    setFormData((prevData) =>
      create(prevData, (draftData) => {
        draftData.nominees[index][name] = val
      })
    )

    setErrors((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message

        if (name !== 'husband_name' && name !== 'secondary_phone') {
          const nominees = draftErr?.nominees || {}
          nominees[index] = draftErr?.nominees[index] || {}

          val === '' || val === null
            ? (nominees[index][name] = `${t(`common.${name}`)} ${t(
                `common_validation.is_required`
              )}`)
            : draftErr['nominees'][index] && delete draftErr['nominees'][index][name]

          draftErr['nominees'] = nominees
        }

        if (draftErr['nominees'][index] && !Object.keys(draftErr['nominees'][index]).length) {
          draftErr['nominees'].splice(index, 1)
        }
        if (draftErr['nominees'] && !draftErr['nominees'].length) {
          delete draftErr['nominees']
        }
      })
    )
  }

  return (
    <>
      {formData.nominees.map((nominee, i) => (
        <NomineeFields
          key={i}
          nomineeData={nominee}
          setNomineeData={setFormData}
          i={i}
          setChange={setChange}
          errors={errors}
          setErrors={setErrors}
          disabled={disabled}
        />
      ))}
      <div className="col-md-12 d-flex justify-content-center my-3">
        <ActionBtnGroup>
          <Tooltip TransitionComponent={Zoom} title={t('common.add_nominee')} arrow followCursor>
            <span>
              <IconButton
                className="text-success"
                onClick={addNominee}
                disabled={formData.nominees.length < 5 ? false : true}>
                {<PlusCircle size={24} />}
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip TransitionComponent={Zoom} title={t('common.remove_nominee')} arrow followCursor>
            <span>
              <IconButton
                className="text-danger"
                onClick={removeNominee}
                disabled={formData.nominees.length > 1 ? false : true}>
                {<XCircle size={24} />}
              </IconButton>
            </span>
          </Tooltip>
        </ActionBtnGroup>
      </div>
    </>
  )
}
