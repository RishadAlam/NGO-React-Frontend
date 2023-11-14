import dateFormat from '../../libs/dateFormat'
import setFontFamily from '../../libs/setFontFamily'

export const DashSavingCollectionTableColumns = (t, windowWidth) => [
  {
    Header: '#',
    accessor: 'id',
    Cell: ({ row }) => setFontFamily((row.index + 1).toString().padStart(2, '0'))
  },
  { Header: t('common.client_name'), accessor: 'name', show: windowWidth < 576 ? false : true },
  { Header: t('common.acc_no'), accessor: 'acc_no' },
  { Header: t('common.volume'), accessor: 'volume', show: false },
  { Header: t('common.center'), accessor: 'center', show: false },
  { Header: t('common.type'), accessor: 'type', show: windowWidth < 576 ? false : true },
  { Header: t('common.description'), accessor: 'description', show: false },
  { Header: t('common.deposit'), accessor: 'deposit' },
  { Header: t('common.officer'), accessor: 'officer', show: windowWidth < 576 ? false : true },
  { Header: t('common.time'), accessor: 'time', show: windowWidth < 576 ? false : true }
]

export const DashLoanCollectionTableColumns = (t, windowWidth) => [
  {
    Header: '#',
    accessor: 'id',
    Cell: ({ row }) => setFontFamily((row.index + 1).toString().padStart(2, '0'))
  },
  { Header: t('common.client_name'), accessor: 'name', show: windowWidth < 576 ? false : true },
  { Header: t('common.acc_no'), accessor: 'acc_no' },
  { Header: t('common.volume'), accessor: 'volume', show: false },
  { Header: t('common.center'), accessor: 'center', show: false },
  { Header: t('common.type'), accessor: 'type', show: windowWidth < 576 ? false : true },
  { Header: t('common.description'), accessor: 'description', show: false },
  { Header: t('common.deposit'), accessor: 'deposit' },
  { Header: t('common.loan'), accessor: 'loan' },
  { Header: t('common.interest'), accessor: 'interest' },
  { Header: t('common.total'), accessor: 'total', show: windowWidth < 576 ? false : true },
  { Header: t('common.officer'), accessor: 'officer', show: windowWidth < 576 ? false : true },
  { Header: t('common.time'), accessor: 'time', show: windowWidth < 576 ? false : true }
]

export const DashWithdrawalTableColumns = (t, windowWidth) => [
  {
    Header: '#',
    accessor: 'id',
    show: false,
    Cell: ({ row }) => setFontFamily((row.index + 1).toString().padStart(2, '0'))
  },
  { Header: t('common.client_name'), accessor: 'name', show: windowWidth < 576 ? false : true },
  { Header: t('common.acc_no'), accessor: 'acc_no' },
  { Header: t('common.volume'), accessor: 'volume', show: false },
  { Header: t('common.center'), accessor: 'center', show: false },
  { Header: t('common.type'), accessor: 'type', show: false },
  { Header: t('common.description'), accessor: 'description', show: false },
  { Header: t('common.withdrawal'), accessor: 'withdraw' },
  { Header: t('common.officer'), accessor: 'officer', show: windowWidth < 576 ? false : true },
  { Header: t('common.time'), accessor: 'time', show: false }
]

export const FieldTableColumns = (
  t,
  windowWidth,
  statusSwitch,
  actionBtnGroup,
  isActionHide,
  descParser
) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => setFontFamily((row.index + 1).toString().padStart(2, '0'))
  },
  { Header: t('common.name'), accessor: 'name' },
  {
    Header: t('common.description'),
    accessor: 'description',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => descParser(value)
  },
  {
    Header: t('common.status'),
    accessor: 'status',
    Cell: ({ value, row }) => statusSwitch(value, row.original.id)
  },
  {
    Header: t('common.creator'),
    accessor: 'author',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => (value ? value.name : '')
  },
  {
    Header: t('common.created_at'),
    accessor: 'created_at',
    show: false,
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.action'),
    accessor: 'action',
    show: isActionHide ? false : windowWidth < 576 ? false : true,
    disable: isActionHide,
    isActionHide: isActionHide,
    Cell: ({ row }) => actionBtnGroup(row.original.id, row.original)
  }
]

export const CenterTableColumns = (
  t,
  windowWidth,
  statusSwitch,
  actionBtnGroup,
  isActionHide,
  descParser
) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => setFontFamily((row.index + 1).toString().padStart(2, '0'))
  },
  { Header: t('common.name'), accessor: 'name' },
  { Header: t('common.field'), accessor: 'field', Cell: ({ value }) => (value ? value.name : '') },
  {
    Header: t('common.description'),
    accessor: 'description',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => descParser(value)
  },
  {
    Header: t('common.status'),
    accessor: 'status',
    Cell: ({ value, row }) => statusSwitch(value, row.original.id)
  },
  {
    Header: t('common.creator'),
    accessor: 'author',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => (value ? value.name : '')
  },
  {
    Header: t('common.created_at'),
    accessor: 'created_at',
    show: false,
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.action'),
    accessor: 'action',
    show: isActionHide ? false : windowWidth < 576 ? false : true,
    disable: isActionHide,
    isActionHide: isActionHide,
    Cell: ({ row }) => actionBtnGroup(row.original.id, row.original)
  }
]

export const CategoryTableColumns = (
  t,
  windowWidth,
  statusSwitch,
  actionBtnGroup,
  isActionHide,
  descParser,
  savingLoanStatus
) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => setFontFamily((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.name'),
    accessor: 'name',
    Cell: ({ row, value }) => (row.original.is_default ? t(`category.default.${value}`) : value)
  },
  { Header: t('common.group'), accessor: 'group' },
  {
    Header: t('common.description'),
    accessor: 'description',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => descParser(value)
  },
  {
    Header: t('common.saving'),
    accessor: 'saving',
    Cell: ({ value }) => savingLoanStatus(value)
  },
  {
    Header: t('common.loan'),
    accessor: 'loan',
    Cell: ({ value }) => savingLoanStatus(value)
  },
  {
    Header: t('common.status'),
    accessor: 'status',
    Cell: ({ value, row }) => statusSwitch(value, row.original.id)
  },
  {
    Header: t('common.creator'),
    accessor: 'author',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => (value ? value.name : '')
  },
  {
    Header: t('common.created_at'),
    accessor: 'created_at',
    show: false,
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.action'),
    accessor: 'action',
    show: isActionHide ? false : windowWidth < 576 ? false : true,
    disable: isActionHide,
    isActionHide: isActionHide,
    Cell: ({ row }) => actionBtnGroup(row.original.id, row.original)
  }
]

export const StaffTableColumns = (
  t,
  windowWidth,
  avatar,
  pendingBadge,
  statusSwitch,
  actionBtnGroup,
  isActionHide
) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => setFontFamily((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.image'),
    accessor: 'image_uri',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row, value }) => avatar(row.original.name, value)
  },
  { Header: t('common.name'), accessor: 'name' },
  { Header: t('common.email'), accessor: 'email', show: windowWidth < 576 ? false : true },
  {
    Header: t('common.role'),
    accessor: 'role_name',
    Cell: ({ row, value }) =>
      row.original.role_is_default ? t(`staff_roles.default.${value}`) : value
  },
  { Header: t('common.phone'), accessor: 'phone', show: windowWidth < 576 ? false : true },
  {
    Header: t('common.verified_at'),
    accessor: 'verified_at',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) =>
      value ? setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a')) : pendingBadge(value)
  },
  {
    Header: t('common.status'),
    accessor: 'status',
    Cell: ({ value, row }) => statusSwitch(value, row.original.id)
  },
  {
    Header: t('common.action'),
    accessor: 'action',
    show: isActionHide ? false : windowWidth < 576 ? false : true,
    disable: isActionHide,
    isActionHide: isActionHide,
    Cell: ({ row }) => actionBtnGroup(row.original.id, row.original)
  }
]

export const RolesTableColumns = (t, windowWidth, actionBtnGroup) => [
  {
    Header: '#',
    accessor: 'id',
    Cell: ({ row }) => setFontFamily((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.role'),
    accessor: 'name',
    Cell: ({ row, value }) => (row.original.is_default ? t(`staff_roles.default.${value}`) : value)
  },
  {
    Header: t('common.action'),
    accessor: 'action',
    Cell: ({ row }) => !row.original.is_default && actionBtnGroup(row.original.id, row.original)
  }
]

export const AccountTableColumns = (
  t,
  windowWidth,
  statusSwitch,
  actionBtnGroup,
  isActionHide,
  accInfo
) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => setFontFamily((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('account.Account_Info'),
    accessor: 'Account_Info',
    Cell: ({ row }) =>
      accInfo(
        row.original.is_default ? t(`account.default.${row.original.name}`) : row.original.name,
        setFontFamily(row.original.acc_no),
        row.original.acc_details
      )
  },
  {
    Header: t('common.total_deposit'),
    accessor: 'total_deposit',
    show: false,
    Cell: ({ value }) => setFontFamily(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.total_withdraw'),
    accessor: 'total_withdrawal',
    show: false,
    Cell: ({ value }) => setFontFamily(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.balance'),
    accessor: 'balance',
    Cell: ({ value }) => setFontFamily(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.status'),
    accessor: 'status',
    Cell: ({ value, row }) => statusSwitch(value, row.original.id)
  },
  {
    Header: t('common.creator'),
    accessor: 'author',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => (value ? value.name : '')
  },
  {
    Header: t('common.created_at'),
    accessor: 'created_at',
    show: false,
    Cell: ({ value }) => setFontFamily(setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a')))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => setFontFamily(setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a')))
  },
  {
    Header: t('common.action'),
    accessor: 'action',
    show: isActionHide ? false : windowWidth < 576 ? false : true,
    disable: isActionHide,
    isActionHide: isActionHide,
    Cell: ({ row }) => !row.original.is_default && actionBtnGroup(row.original.id, row.original)
  }
]

export const IncomeCategoriesTableColumns = (
  t,
  windowWidth,
  statusSwitch,
  actionBtnGroup,
  isActionHide
) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => setFontFamily((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.name'),
    accessor: 'name',
    Cell: ({ row, value }) =>
      row.original.is_default ? t(`income_categories.default.${value}`) : value
  },
  {
    Header: t('common.description'),
    accessor: 'description',
    show: windowWidth < 576 ? false : true
  },
  {
    Header: t('common.status'),
    accessor: 'status',
    Cell: ({ value, row }) => statusSwitch(value, row.original.id)
  },
  {
    Header: t('common.creator'),
    accessor: 'author',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => (value ? value.name : '')
  },
  {
    Header: t('common.created_at'),
    accessor: 'created_at',
    show: false,
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.action'),
    accessor: 'action',
    show: isActionHide ? false : windowWidth < 576 ? false : true,
    disable: isActionHide,
    isActionHide: isActionHide,
    Cell: ({ row }) => !row.original.is_default && actionBtnGroup(row.original.id, row.original)
  }
]

export const ExpenseCategoriesTableColumns = (
  t,
  windowWidth,
  statusSwitch,
  actionBtnGroup,
  isActionHide
) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => setFontFamily((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.name'),
    accessor: 'name',
    Cell: ({ row, value }) =>
      row.original.is_default ? t(`expense_categories.default.${value}`) : value
  },
  {
    Header: t('common.description'),
    accessor: 'description',
    show: windowWidth < 576 ? false : true
  },
  {
    Header: t('common.status'),
    accessor: 'status',
    Cell: ({ value, row }) => statusSwitch(value, row.original.id)
  },
  {
    Header: t('common.creator'),
    accessor: 'author',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => (value ? value.name : '')
  },
  {
    Header: t('common.created_at'),
    accessor: 'created_at',
    show: false,
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.action'),
    accessor: 'action',
    show: isActionHide ? false : windowWidth < 576 ? false : true,
    disable: isActionHide,
    isActionHide: isActionHide,
    Cell: ({ row }) => !row.original.is_default && actionBtnGroup(row.original.id, row.original)
  }
]

export const IncomeTableColumns = (t, windowWidth, actionBtnGroup, isActionHide) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => setFontFamily((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.date'),
    accessor: 'date',
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy'))
  },
  {
    Header: t('common.account'),
    accessor: 'account',
    Cell: ({ value }) =>
      value ? (value.is_default ? t(`account.default.${value.name}`) : value.name) : ''
  },
  {
    Header: t('common.category'),
    accessor: 'income_category',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) =>
      value ? (value.is_default ? t(`income_categories.default.${value.name}`) : value.name) : ''
  },
  {
    Header: t('common.description'),
    accessor: 'description',
    show: windowWidth < 576 ? false : true
  },
  {
    Header: t('common.amount'),
    accessor: 'amount',
    Cell: ({ value }) => setFontFamily(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.previous_balance'),
    accessor: 'previous_balance',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => setFontFamily(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.balance'),
    accessor: 'balance',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => setFontFamily(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.creator'),
    accessor: 'author',
    show: false,
    Cell: ({ value }) => (value ? value.name : '')
  },
  {
    Header: t('common.created_at'),
    accessor: 'created_at',
    show: false,
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.action'),
    accessor: 'action',
    show: isActionHide ? false : windowWidth < 576 ? false : true,
    disable: isActionHide,
    isActionHide: isActionHide,
    Cell: ({ row }) => actionBtnGroup(row.original.id, row.original)
  }
]

export const ExpenseTableColumns = (t, windowWidth, actionBtnGroup, isActionHide) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => setFontFamily((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.date'),
    accessor: 'date',
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy'))
  },
  {
    Header: t('common.account'),
    accessor: 'account',
    Cell: ({ value }) =>
      value ? (value.is_default ? t(`account.default.${value.name}`) : value.name) : ''
  },
  {
    Header: t('common.category'),
    accessor: 'expense_category',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) =>
      value ? (value.is_default ? t(`expense_categories.default.${value.name}`) : value.name) : ''
  },
  {
    Header: t('common.description'),
    accessor: 'description',
    show: windowWidth < 576 ? false : true
  },
  {
    Header: t('common.amount'),
    accessor: 'amount',
    Cell: ({ value }) => setFontFamily(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.previous_balance'),
    accessor: 'previous_balance',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => setFontFamily(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.balance'),
    accessor: 'balance',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => setFontFamily(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.creator'),
    accessor: 'author',
    show: false,
    Cell: ({ value }) => (value ? value.name : '')
  },
  {
    Header: t('common.created_at'),
    accessor: 'created_at',
    show: false,
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.action'),
    accessor: 'action',
    show: isActionHide ? false : windowWidth < 576 ? false : true,
    disable: isActionHide,
    isActionHide: isActionHide,
    Cell: ({ row }) => actionBtnGroup(row.original.id, row.original)
  }
]

export const WithdrawalTableColumns = (t, windowWidth, actionBtnGroup, isActionHide) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => setFontFamily((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.date'),
    accessor: 'date',
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy'))
  },
  {
    Header: t('common.account'),
    accessor: 'account',
    Cell: ({ value }) =>
      value ? (value.is_default ? t(`account.default.${value.name}`) : value.name) : ''
  },
  {
    Header: t('common.description'),
    accessor: 'description',
    show: windowWidth < 576 ? false : true
  },
  {
    Header: t('common.amount'),
    accessor: 'amount',
    Cell: ({ value }) => setFontFamily(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.previous_balance'),
    accessor: 'previous_balance',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => setFontFamily(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.balance'),
    accessor: 'balance',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => setFontFamily(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.creator'),
    accessor: 'author',
    show: false,
    Cell: ({ value }) => (value ? value.name : '')
  },
  {
    Header: t('common.created_at'),
    accessor: 'created_at',
    show: false,
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.action'),
    accessor: 'action',
    show: isActionHide ? false : windowWidth < 576 ? false : true,
    disable: isActionHide,
    isActionHide: isActionHide,
    Cell: ({ row }) => actionBtnGroup(row.original.id, row.original)
  }
]

export const TransferTableColumns = (t, windowWidth, setTransactionTypes) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => setFontFamily((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.date'),
    accessor: 'date',
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy'))
  },
  {
    Header: t('common.account'),
    accessor: 'account',
    Cell: ({ value }) =>
      value ? (value.is_default ? t(`account.default.${value.name}`) : value.name) : ''
  },
  {
    Header: `${t('common.transaction')} ${t('common.account')}`,
    accessor: 'transaction_account',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) =>
      value ? (value.is_default ? t(`account.default.${value.name}`) : value.name) : ''
  },
  {
    Header: t('common.type'),
    accessor: 'type',
    Cell: ({ value }) => setTransactionTypes(value)
  },
  {
    Header: t('common.description'),
    accessor: 'description',
    show: windowWidth < 576 ? false : true
  },
  {
    Header: t('common.amount'),
    accessor: 'amount',
    Cell: ({ value }) => setFontFamily(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.previous_balance'),
    accessor: 'previous_balance',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => setFontFamily(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.balance'),
    accessor: 'balance',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => setFontFamily(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.creator'),
    accessor: 'author',
    show: false,
    Cell: ({ value }) => (value ? value.name : '')
  },
  {
    Header: t('common.created_at'),
    accessor: 'created_at',
    show: false,
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  }
]

export const TransactionTableColumns = (t, windowWidth, setTransactionTypes) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => setFontFamily((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.date'),
    accessor: 'date',
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy'))
  },
  {
    Header: t('common.account'),
    accessor: 'account',
    Cell: ({ value }) =>
      value ? (value.is_default ? t(`account.default.${value.name}`) : value.name) : ''
  },
  {
    Header: t('common.type'),
    accessor: 'type',
    Cell: ({ value }) => setTransactionTypes(value)
  },
  {
    Header: t('common.description'),
    accessor: 'description',
    show: windowWidth < 576 ? false : true
  },
  {
    Header: t('common.amount'),
    accessor: 'amount',
    Cell: ({ value }) => setFontFamily(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.previous_balance'),
    accessor: 'previous_balance',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => setFontFamily(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.balance'),
    accessor: 'balance',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => setFontFamily(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.creator'),
    accessor: 'author',
    show: false,
    Cell: ({ value }) => (value ? value.name : '')
  },
  {
    Header: t('common.created_at'),
    accessor: 'created_at',
    show: false,
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => setFontFamily(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  }
]
