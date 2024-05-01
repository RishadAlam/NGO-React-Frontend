import dateFormat from '../libs/dateFormat'

export const setProfileDataObj = (profile) => {
  return {
    id: profile.id,
    field_id: profile.field_id,
    center_id: profile.center_id,
    acc_no: profile.acc_no,
    name: profile.name,
    father_name: profile.father_name,
    husband_name: profile.husband_name || '',
    mother_name: profile.mother_name,
    nid: profile.nid,
    dob: dateFormat(profile.dob, 'yyyy-MM-dd'),
    occupation: profile.occupation,
    religion: profile.religion,
    gender: profile.gender,
    primary_phone: profile.primary_phone,
    secondary_phone: profile.secondary_phone || '',
    image: '',
    image_uri: profile.image_uri,
    signature: '',
    signature_uri: profile.signature_uri || '',
    share: profile.share,
    annual_income: profile.annual_income || '',
    bank_acc_no: profile.bank_acc_no || '',
    bank_check_no: profile.bank_check_no || '',
    present_address: {
      street_address: profile.present_address.street_address,
      city: profile.present_address.city,
      word_no: profile.present_address.word_no || '',
      post_office: profile.present_address.post_office,
      post_code: profile.present_address.post_code,
      police_station: profile.present_address.police_station,
      district: profile.present_address.district,
      division: profile.present_address.division
    },
    permanent_address: {
      street_address: profile.permanent_address.street_address,
      city: profile.permanent_address.city,
      word_no: profile.permanent_address.word_no || '',
      post_office: profile.permanent_address.post_office,
      post_code: profile.permanent_address.post_code,
      police_station: profile.permanent_address.police_station,
      district: profile.permanent_address.district,
      division: profile.permanent_address.division
    },
    field: profile.field,
    center: profile.center
  }
}
