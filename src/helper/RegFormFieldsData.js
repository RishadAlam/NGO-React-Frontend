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
    nominees: setNomiGuarantorFields(nominees)
  }
}

export const setNomiGuarantorFields = (subData = []) => {
  const getDefaultFields = () => ({
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

  return subData.length
    ? subData.map((fields) => ({
        id: fields?.id || '',
        name: fields?.name || '',
        father_name: fields?.father_name || '',
        husband_name: fields?.husband_name || '',
        mother_name: fields?.mother_name || '',
        nid: fields?.nid || '',
        dob: dateFormat(fields?.dob ? new Date(fields?.dob) : new Date(), 'yyyy-MM-dd'),
        occupation: fields?.occupation || '',
        relation: fields?.relation || '',
        gender: fields?.gender || '',
        primary_phone: fields?.primary_phone || '',
        secondary_phone: fields?.secondary_phone || '',
        image: '',
        image_uri: fields?.image_uri || '',
        signature: '',
        signature_uri: fields?.signature_uri || '',
        address: {
          street_address: fields?.address?.street_address || '',
          city: fields?.address?.city || '',
          word_no: fields?.address?.word_no || '',
          post_office: fields?.address?.post_office || '',
          police_station: fields?.address?.police_station || '',
          district: fields?.address?.district || '',
          division: fields?.address?.division || ''
        }
      }))
    : [getDefaultFields()]
}

export const setLoanAccFields = ({
  id = '',
  field_id = '',
  center_id = '',
  creator_id = '',
  category_id = '',
  client_registration_id = '',
  acc_no = '',
  start_date = new Date(),
  duration_date = new Date(),
  loan_given = 0,
  payable_deposit = 0,
  payable_installment = 0,
  payable_interest = 0,
  total_payable_interest = 0,
  total_payable_loan_with_interest = 0,
  loan_installment = 0,
  interest_installment = 0,
  field = null,
  center = null,
  category = null,
  client_registration: client = null,
  author: creator = null,
  guarantors = []
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
    loan_given,
    payable_deposit,
    payable_installment,
    payable_interest,
    total_payable_interest,
    total_payable_loan_with_interest,
    loan_installment,
    interest_installment,
    total_payable_loan_installment: loan_installment + interest_installment,
    field,
    center,
    category,
    client,
    creator,
    guarantors: setNomiGuarantorFields(guarantors)
  }
}

export const setApprovalWithdrawalModalData = (data) => {
  return {
    id: data.id,
    category: data?.category,
    name: data?.saving_account?.client_registration?.name,
    acc_no: data?.acc_no,
    fee: data?.category?.category_config?.saving_withdrawal_fee,
    amount: data?.amount,
    balance: data?.saving_account?.balance,
    balance_remaining: data?.saving_account?.balance - data?.amount,
    description: data?.description,
    created_at: data?.created_at,
    creator: data?.author?.name
  }
}
