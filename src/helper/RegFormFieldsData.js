import dateFormat from '../libs/dateFormat'

export const setSavingFields = ({
  id = '',
  field_id = '',
  center_id = '',
  creator_id = '',
  category_id = '',
  client_registration_id = '',
  acc_no = '',
  start_date = new Date(),
  duration_date = new Date(),
  payable_deposit = '',
  payable_installment = '',
  payable_interest = '',
  total_deposit_without_interest = '',
  total_deposit_with_interest = '',
  field = null,
  center = null,
  category = null,
  client_registration: client = null,
  author: creator = null,
  nominees = []
} = {}) => {
  return {
    id,
    field_id,
    center_id,
    creator_id,
    category_id,
    client_registration_id,
    acc_no,
    name: client?.name || '',
    start_date: dateFormat(start_date, 'yyyy-MM-dd'),
    duration_date: dateFormat(duration_date, 'yyyy-MM-dd') || '',
    payable_deposit,
    payable_installment,
    payable_interest,
    total_deposit_without_interest,
    total_deposit_with_interest,
    field,
    center,
    category,
    client,
    creator,
    nominees: setNomineesFields(nominees)
  }
}

const setNomineesFields = (nomineesData = []) => {
  const getDefaultNominee = () => ({
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
      police_station: '',
      district: '',
      division: ''
    }
  })

  return nomineesData.length
    ? nomineesData.map((nominee) => ({
        id: nominee?.id || '',
        name: nominee?.name || '',
        father_name: nominee?.father_name || '',
        husband_name: nominee?.husband_name || '',
        mother_name: nominee?.mother_name || '',
        nid: nominee?.nid || '',
        dob: dateFormat(nominee?.dob ? new Date(nominee?.dob) : new Date(), 'yyyy-MM-dd'),
        occupation: nominee?.occupation || '',
        relation: nominee?.relation || '',
        gender: nominee?.gender || '',
        primary_phone: nominee?.primary_phone || '',
        secondary_phone: nominee?.secondary_phone || '',
        image: '',
        image_uri: nominee?.image_uri || '',
        signature: '',
        signature_uri: nominee?.signature_uri || '',
        address: {
          street_address: nominee?.address?.street_address || '',
          city: nominee?.address?.city || '',
          word_no: nominee?.address?.word_no || '',
          post_office: nominee?.address?.post_office || '',
          police_station: nominee?.address?.police_station || '',
          district: nominee?.address?.district || '',
          division: nominee?.address?.division || ''
        }
      }))
    : [getDefaultNominee()]
}
