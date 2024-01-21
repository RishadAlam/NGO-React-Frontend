import { defaultNameCheck } from '../../helper/defaultNameCheck'
import dateFormat from '../../libs/dateFormat'
import tsNumbers from '../../libs/tsNumbers'

const lang = document.querySelector('html').lang

export const DashSavingCollectionTableColumns = (t, windowWidth) => [
  {
    Header: '#',
    accessor: 'id',
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
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
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
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
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
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
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
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
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
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
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
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
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
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
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.name'),
    accessor: 'name',
    Cell: ({ row, value }) =>
      defaultNameCheck(t, row.original.is_default, 'category.default.', value)
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
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.action'),
    accessor: 'action',
    show: isActionHide ? false : windowWidth < 576 ? false : true,
    disable: isActionHide,
    isActionHide: isActionHide,
    Cell: ({ row }) =>
      !Number(row.original.is_default) && actionBtnGroup(row.original.id, row.original)
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
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
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
      defaultNameCheck(t, row.original.role_is_default, 'staff_roles.default.', value)
  },
  { Header: t('common.phone'), accessor: 'phone', show: windowWidth < 576 ? false : true },
  {
    Header: t('common.verified_at'),
    accessor: 'verified_at',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) =>
      value ? tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a')) : pendingBadge(value)
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
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.role'),
    accessor: 'name',
    Cell: ({ row, value }) =>
      defaultNameCheck(t, row.original.is_default, 'staff_roles.default.', value)
  },
  {
    Header: t('common.action'),
    accessor: 'action',
    Cell: ({ row }) =>
      !Number(row.original.is_default) && actionBtnGroup(row.original.id, row.original)
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
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('account.Account_Info'),
    accessor: 'Account_Info',
    Cell: ({ row }) =>
      accInfo(
        defaultNameCheck(t, row.original.is_default, 'account.default.', row.original.name),
        tsNumbers(row.original.acc_no),
        row.original.acc_details
      )
  },
  {
    Header: t('common.total_deposit'),
    accessor: 'total_deposit',
    show: false,
    Cell: ({ value }) => tsNumbers(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.total_withdraw'),
    accessor: 'total_withdrawal',
    show: false,
    Cell: ({ value }) => tsNumbers(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.balance'),
    accessor: 'balance',
    Cell: ({ value }) => tsNumbers(`৳${value ? value : 0}`)
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
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.action'),
    accessor: 'action',
    show: isActionHide ? false : windowWidth < 576 ? false : true,
    disable: isActionHide,
    isActionHide: isActionHide,
    Cell: ({ row }) =>
      !Number(row.original.is_default) && actionBtnGroup(row.original.id, row.original)
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
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.name'),
    accessor: 'name',
    Cell: ({ row, value }) =>
      defaultNameCheck(t, row.original.is_default, 'income_categories.default.', value)
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
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.action'),
    accessor: 'action',
    show: isActionHide ? false : windowWidth < 576 ? false : true,
    disable: isActionHide,
    isActionHide: isActionHide,
    Cell: ({ row }) =>
      !Number(row.original.is_default) && actionBtnGroup(row.original.id, row.original)
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
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.name'),
    accessor: 'name',
    Cell: ({ row, value }) =>
      defaultNameCheck(t, row.original.is_default, 'expense_categories.default.', value)
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
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.action'),
    accessor: 'action',
    show: isActionHide ? false : windowWidth < 576 ? false : true,
    disable: isActionHide,
    isActionHide: isActionHide,
    Cell: ({ row }) =>
      !Number(row.original.is_default) && actionBtnGroup(row.original.id, row.original)
  }
]

export const IncomeTableColumns = (t, windowWidth, actionBtnGroup, isActionHide) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.date'),
    accessor: 'date',
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy'))
  },
  {
    Header: t('common.account'),
    accessor: 'account',
    Cell: ({ value }) =>
      value ? defaultNameCheck(t, value.is_default, 'account.default.', value.name) : ''
  },
  {
    Header: t('common.category'),
    accessor: 'income_category',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) =>
      value ? defaultNameCheck(t, value.is_default, 'category.default.', value.name) : ''
  },
  {
    Header: t('common.description'),
    Footer: t('common.total'),
    accessor: 'description',
    show: windowWidth < 576 ? false : true
  },
  {
    Header: t('common.amount'),
    accessor: 'amount',
    Cell: ({ value }) => tsNumbers(`৳${value ? value : 0}`),
    Footer: ({ data }) => {
      const totalAmount = data.reduce((sum, transaction) => {
        return sum + transaction.amount
      }, 0)

      return tsNumbers(`৳${totalAmount}/-`)
    }
  },
  {
    Header: t('common.previous_balance'),
    accessor: 'previous_balance',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => tsNumbers(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.balance'),
    accessor: 'balance',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => tsNumbers(`৳${value ? value : 0}`)
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
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
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
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.date'),
    accessor: 'date',
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy'))
  },
  {
    Header: t('common.account'),
    accessor: 'account',
    Cell: ({ value }) =>
      value ? defaultNameCheck(t, value.is_default, 'account.default.', value.name) : ''
  },
  {
    Header: t('common.category'),
    accessor: 'expense_category',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) =>
      value ? defaultNameCheck(t, value.is_default, 'category.default.', value.name) : ''
  },
  {
    Header: t('common.description'),
    Footer: t('common.total'),
    accessor: 'description',
    show: windowWidth < 576 ? false : true
  },
  {
    Header: t('common.amount'),
    accessor: 'amount',
    Cell: ({ value }) => tsNumbers(`৳${value ? value : 0}`),
    Footer: ({ data }) => {
      const totalAmount = data.reduce((sum, transaction) => {
        return sum + transaction.amount
      }, 0)

      return tsNumbers(`৳${totalAmount}/-`)
    }
  },
  {
    Header: t('common.previous_balance'),
    accessor: 'previous_balance',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => tsNumbers(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.balance'),
    accessor: 'balance',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => tsNumbers(`৳${value ? value : 0}`)
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
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
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
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.date'),
    accessor: 'date',
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy'))
  },
  {
    Header: t('common.account'),
    accessor: 'account',
    Cell: ({ value }) =>
      value ? defaultNameCheck(t, value.is_default, 'account.default.', value.name) : ''
  },
  {
    Header: t('common.description'),
    Footer: t('common.total'),
    accessor: 'description',
    show: windowWidth < 576 ? false : true
  },
  {
    Header: t('common.amount'),
    accessor: 'amount',
    Cell: ({ value }) => tsNumbers(`৳${value ? value : 0}`),
    Footer: ({ data }) => {
      const totalAmount = data.reduce((sum, transaction) => {
        return sum + transaction.amount
      }, 0)

      return tsNumbers(`৳${totalAmount}/-`)
    }
  },
  {
    Header: t('common.previous_balance'),
    accessor: 'previous_balance',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => tsNumbers(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.balance'),
    accessor: 'balance',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => tsNumbers(`৳${value ? value : 0}`)
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
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
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
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.date'),
    accessor: 'date',
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy'))
  },
  {
    Header: t('common.account'),
    accessor: 'account',
    Cell: ({ value }) =>
      value ? defaultNameCheck(t, value.is_default, 'account.default.', value.name) : ''
  },
  {
    Header: `${t('common.transaction')} ${t('common.account')}`,
    accessor: 'transaction_account',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) =>
      value ? defaultNameCheck(t, value.is_default, 'account.default.', value.name) : ''
  },
  {
    Header: t('common.type'),
    accessor: 'type',
    Cell: ({ value }) => setTransactionTypes(value)
  },
  {
    Header: t('common.description'),
    Footer: t('common.total'),
    accessor: 'description',
    show: windowWidth < 576 ? false : true
  },
  {
    Header: t('common.amount'),
    accessor: 'amount',
    Cell: ({ value }) => tsNumbers(`৳${value ? value : 0}`),
    Footer: ({ data }) => {
      const totalAmount = data.reduce((sum, transaction) => {
        return sum + transaction.amount
      }, 0)

      return tsNumbers(`৳${totalAmount}/-`)
    }
  },
  {
    Header: t('common.previous_balance'),
    accessor: 'previous_balance',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => tsNumbers(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.balance'),
    accessor: 'balance',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => tsNumbers(`৳${value ? value : 0}`)
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
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  }
]

export const TransactionTableColumns = (t, windowWidth, setTransactionTypes) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.date'),
    accessor: 'date',
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy'))
  },
  {
    Header: t('common.account'),
    accessor: 'account',
    Cell: ({ value }) =>
      value ? defaultNameCheck(t, value.is_default, 'account.default.', value.name) : ''
  },
  {
    Header: t('common.type'),
    accessor: 'type',
    Cell: ({ value }) => setTransactionTypes(value)
  },
  {
    Header: t('common.description'),
    Footer: t('common.total'),
    accessor: 'description',
    show: windowWidth < 576 ? false : true
  },
  {
    Header: t('common.amount'),
    accessor: 'amount',
    Cell: ({ value }) => tsNumbers(`৳${value ? value : 0}`),
    Footer: ({ data }) => {
      const totalAmount = data.reduce((sum, transaction) => {
        return sum + transaction.amount
      }, 0)

      return tsNumbers(`৳${totalAmount}/-`)
    }
  },
  {
    Header: t('common.previous_balance'),
    accessor: 'previous_balance',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => tsNumbers(`৳${value ? value : 0}`)
  },
  {
    Header: t('common.balance'),
    accessor: 'balance',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => tsNumbers(`৳${value ? value : 0}`)
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
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  }
]

export const PendingClientRegTableColumns = (
  t,
  windowWidth,
  avatar,
  statusSwitch,
  actionBtnGroup,
  isApprovalHide,
  isActionHide
) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.image'),
    accessor: 'image_uri',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row, value }) => avatar(row.original.name, value)
  },
  { Header: t('common.name'), accessor: 'name' },
  {
    Header: t('common.acc_no'),
    accessor: 'acc_no',
    Cell: ({ value }) => tsNumbers(value)
  },
  { Header: t('common.field'), accessor: 'field', Cell: ({ value }) => (value ? value.name : '') },
  {
    Header: t('common.center'),
    accessor: 'center',
    Cell: ({ value }) => (value ? value.name : '')
  },
  {
    Header: t('common.created_at'),
    accessor: 'created_at',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.creator'),
    accessor: 'author',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => (value ? value.name : '')
  },
  {
    Header: t('common.approval'),
    accessor: 'is_approved',
    show: isApprovalHide ? false : true,
    disable: isApprovalHide,
    isActionHide: isApprovalHide,
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

export const PendingSavingRegTableColumns = (
  t,
  windowWidth,
  avatar,
  statusSwitch,
  actionBtnGroup,
  isApprovalHide,
  isActionHide
) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.image'),
    accessor: 'image_uri',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) =>
      avatar(row.original.client_registration.name, row.original.client_registration.image_uri)
  },
  {
    Header: t('common.name'),
    accessor: 'name',
    Cell: ({ row }) => row.original.client_registration.name
  },
  {
    Header: t('common.acc_no'),
    accessor: 'acc_no',
    Cell: ({ value }) => tsNumbers(value)
  },
  {
    Header: t('common.field'),
    accessor: 'field',
    show: false,
    Cell: ({ value }) => (value ? value.name : '')
  },
  {
    Header: t('common.center'),
    accessor: 'center',
    show: false,
    Cell: ({ value }) => (value ? value.name : '')
  },
  {
    Header: t('common.category'),
    accessor: 'category',
    Cell: ({ value }) => defaultNameCheck(t, value.is_default, 'category.default.', value.name)
  },
  {
    Header: t('common.deposit'),
    accessor: 'payable_deposit',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => tsNumbers(`$${value}/-`)
  },
  {
    Header: t('common.total_installment'),
    accessor: 'payable_installment',
    show: false,
    Cell: ({ value }) => tsNumbers(value)
  },
  {
    Header: t('common.interest'),
    accessor: 'payable_interest',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => tsNumbers(`${value}%`)
  },
  {
    Header: t('common.total_deposit_without_interest'),
    accessor: 'total_deposit_without_interest',
    show: false,
    Cell: ({ value }) => tsNumbers(`$${value}/-`)
  },
  {
    Header: t('common.total_deposit_with_interest'),
    accessor: 'total_deposit_with_interest',
    show: false,
    Cell: ({ value }) => tsNumbers(`$${value}/-`)
  },
  {
    Header: t('common.start_date'),
    accessor: 'start_date',
    show: false,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy'))
  },
  {
    Header: t('common.duration_date'),
    accessor: 'duration_date',
    show: false,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy'))
  },
  {
    Header: t('common.nominee'),
    accessor: 'nominees',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => (value?.length ? tsNumbers(value?.length || 0) : '')
  },
  {
    Header: t('common.created_at'),
    accessor: 'created_at',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.creator'),
    accessor: 'author',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => (value ? value.name : '')
  },
  {
    Header: t('common.approval'),
    accessor: 'is_approved',
    show: isApprovalHide ? false : true,
    disable: isApprovalHide,
    isActionHide: isApprovalHide,
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

export const PendingLoanRegTableColumns = (
  t,
  windowWidth,
  avatar,
  statusSwitch,
  actionBtnGroup,
  isApprovalHide,
  isActionHide
) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.image'),
    accessor: 'image_uri',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) =>
      avatar(row.original.client_registration.name, row.original.client_registration.image_uri)
  },
  {
    Header: t('common.name'),
    accessor: 'name',
    Cell: ({ row }) => row.original.client_registration.name
  },
  {
    Header: t('common.acc_no'),
    accessor: 'acc_no',
    Cell: ({ value }) => tsNumbers(value)
  },
  {
    Header: t('common.field'),
    accessor: 'field',
    show: false,
    Cell: ({ value }) => (value ? value.name : '')
  },
  {
    Header: t('common.center'),
    accessor: 'center',
    show: false,
    Cell: ({ value }) => (value ? value.name : '')
  },
  {
    Header: t('common.category'),
    accessor: 'category',
    Cell: ({ value }) => defaultNameCheck(t, value.is_default, 'category.default.', value.name)
  },
  {
    Header: t('common.deposit'),
    accessor: 'payable_deposit',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => tsNumbers(`$${value}/-`)
  },
  {
    Header: t('common.loan_given'),
    accessor: 'loan_given',
    Cell: ({ value }) => tsNumbers(`$${value}/-`)
  },
  {
    Header: t('common.total_installment'),
    accessor: 'payable_installment',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => tsNumbers(value)
  },
  {
    Header: t('common.interest'),
    accessor: 'payable_interest',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => tsNumbers(`${value}%`)
  },
  {
    Header: t('common.total_payable_interest'),
    accessor: 'total_payable_interest',
    show: false,
    Cell: ({ value }) => tsNumbers(`$${value}/-`)
  },
  {
    Header: t('common.total_payable_loan_with_interest'),
    accessor: 'total_payable_loan_with_interest',
    show: false,
    Cell: ({ value }) => tsNumbers(`$${value}/-`)
  },
  {
    Header: t('common.loan_installment'),
    accessor: 'loan_installment',
    show: false,
    Cell: ({ value }) => tsNumbers(`$${value}/-`)
  },
  {
    Header: t('common.interest_installment'),
    accessor: 'interest_installment',
    show: false,
    Cell: ({ value }) => tsNumbers(`$${value}/-`)
  },
  {
    Header: t('common.start_date'),
    accessor: 'start_date',
    show: false,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy'))
  },
  {
    Header: t('common.duration_date'),
    accessor: 'duration_date',
    show: false,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy'))
  },
  {
    Header: t('common.guarantor'),
    accessor: 'guarantors',
    show: false,
    Cell: ({ value }) => tsNumbers(value?.length || 0) + (lang === 'en' ? ' people' : ' জন')
  },
  {
    Header: t('common.created_at'),
    accessor: 'created_at',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.creator'),
    accessor: 'author',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => (value ? value.name : '')
  },
  {
    Header: t('common.approval'),
    accessor: 'is_approved',
    show: isApprovalHide ? false : true,
    disable: isApprovalHide,
    isActionHide: isApprovalHide,
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

export const CategoryCollectionSavingReportTableColumns = (t, windowWidth, actionBtnGroup) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.name'),
    Footer: t('common.total'),
    accessor: 'name',
    Cell: ({ row, value }) =>
      defaultNameCheck(t, row.original.is_default, 'category.default.', value)
  },
  {
    Header: t('common.deposit'),
    accessor: 'saving_collection',
    Cell: ({ value }) => tsNumbers(`$${value[0]?.deposit || 0}/-`),
    Footer: ({ data }) => {
      const totalAmount = data.reduce((sum, transaction) => {
        return sum + parseInt(transaction.saving_collection[0]?.deposit) || 0
      }, 0)

      return tsNumbers(`৳${totalAmount}/-`)
    }
  },
  {
    Header: t('common.action'),
    accessor: 'action',
    Cell: ({ row }) => actionBtnGroup(row.original.id)
  }
]

export const FieldCollectionSavingReportTableColumns = (t, windowWidth, actionBtnGroup) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.name'),
    Footer: t('common.total'),
    accessor: 'name'
  },
  {
    Header: t('common.deposit'),
    accessor: 'saving_collection',
    Cell: ({ value }) => tsNumbers(`$${value[0]?.deposit || 0}/-`),
    Footer: ({ data }) => {
      const totalAmount = data.reduce((sum, transaction) => {
        return sum + parseInt(transaction.saving_collection[0]?.deposit) || 0
      }, 0)

      return tsNumbers(`৳${totalAmount}/-`)
    }
  },
  {
    Header: t('common.action'),
    accessor: 'action',
    Cell: ({ row }) => actionBtnGroup(row.original.id)
  }
]

export const CategoryCollectionLoanReportTableColumns = (t, windowWidth, actionBtnGroup) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.name'),
    Footer: t('common.total'),
    accessor: 'name',
    Cell: ({ row, value }) =>
      defaultNameCheck(t, row.original.is_default, 'category.default.', value)
  },
  {
    Header: t('common.deposit'),
    accessor: 'deposit',
    Cell: ({ row }) => tsNumbers(`$${row.original?.loan_collection[0]?.deposit || 0}/-`),
    Footer: ({ data }) => {
      const totalAmount = data.reduce((sum, transaction) => {
        return sum + parseInt(transaction.loan_collection[0]?.deposit) || 0
      }, 0)

      return tsNumbers(`৳${totalAmount}/-`)
    }
  },
  {
    Header: t('common.loan'),
    accessor: 'loan',
    Cell: ({ row }) => tsNumbers(`$${row.original?.loan_collection[0]?.loan || 0}/-`),
    Footer: ({ data }) => {
      const totalAmount = data.reduce((sum, transaction) => {
        return sum + parseInt(transaction.loan_collection[0]?.loan) || 0
      }, 0)

      return tsNumbers(`৳${totalAmount}/-`)
    }
  },
  {
    Header: t('common.interest'),
    accessor: 'interest',
    Cell: ({ row }) => tsNumbers(`$${row.original?.loan_collection[0]?.interest || 0}/-`),
    Footer: ({ data }) => {
      const totalAmount = data.reduce((sum, transaction) => {
        return sum + parseInt(transaction.loan_collection[0]?.interest) || 0
      }, 0)

      return tsNumbers(`৳${totalAmount}/-`)
    }
  },
  {
    Header: t('common.total'),
    accessor: 'total',
    Cell: ({ row }) => tsNumbers(`$${row.original?.loan_collection[0]?.total || 0}/-`),
    Footer: ({ data }) => {
      const totalAmount = data.reduce((sum, transaction) => {
        return sum + parseInt(transaction.loan_collection[0]?.total) || 0
      }, 0)

      return tsNumbers(`৳${totalAmount}/-`)
    }
  },
  {
    Header: t('common.action'),
    accessor: 'action',
    Cell: ({ row }) => actionBtnGroup(row.original.id)
  }
]

export const FieldCollectionLoanReportTableColumns = (t, windowWidth, actionBtnGroup) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.name'),
    Footer: t('common.total'),
    accessor: 'name'
  },
  {
    Header: t('common.deposit'),
    accessor: 'deposit',
    Cell: ({ row }) => tsNumbers(`$${row.original?.loan_collection[0]?.deposit || 0}/-`),
    Footer: ({ data }) => {
      const totalAmount = data.reduce((sum, transaction) => {
        return sum + parseInt(transaction.loan_collection[0]?.deposit) || 0
      }, 0)

      return tsNumbers(`৳${totalAmount}/-`)
    }
  },
  {
    Header: t('common.loan'),
    accessor: 'loan',
    Cell: ({ row }) => tsNumbers(`$${row.original?.loan_collection[0]?.loan || 0}/-`),
    Footer: ({ data }) => {
      const totalAmount = data.reduce((sum, transaction) => {
        return sum + parseInt(transaction.loan_collection[0]?.loan) || 0
      }, 0)

      return tsNumbers(`৳${totalAmount}/-`)
    }
  },
  {
    Header: t('common.interest'),
    accessor: 'interest',
    Cell: ({ row }) => tsNumbers(`$${row.original?.loan_collection[0]?.interest || 0}/-`),
    Footer: ({ data }) => {
      const totalAmount = data.reduce((sum, transaction) => {
        return sum + parseInt(transaction.loan_collection[0]?.interest) || 0
      }, 0)

      return tsNumbers(`৳${totalAmount}/-`)
    }
  },
  {
    Header: t('common.total'),
    accessor: 'total',
    Cell: ({ row }) => tsNumbers(`$${row.original?.loan_collection[0]?.total || 0}/-`),
    Footer: ({ data }) => {
      const totalAmount = data.reduce((sum, transaction) => {
        return sum + parseInt(transaction.loan_collection[0]?.total) || 0
      }, 0)

      return tsNumbers(`৳${totalAmount}/-`)
    }
  },
  {
    Header: t('common.action'),
    accessor: 'action',
    Cell: ({ row }) => actionBtnGroup(row.original.id)
  }
]

export const PendingSavingWithdrawalTableColumns = (
  t,
  windowWidth,
  avatar,
  statusSwitch,
  descParser,
  actionBtnGroup,
  isApprovalHide,
  isActionHide
) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
  },
  {
    Header: t('common.image'),
    accessor: 'image_uri',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) =>
      avatar(
        row.original.saving_account.client_registration.name,
        row.original.saving_account.client_registration.image_uri
      )
  },
  {
    Header: t('common.name'),
    accessor: 'name',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => row.original.saving_account.client_registration.name
  },
  {
    Header: t('common.acc_no'),
    accessor: 'acc_no',
    Cell: ({ value }) => tsNumbers(value)
  },
  {
    Header: t('common.field'),
    accessor: 'field',
    show: false,
    Cell: ({ value }) => (value ? value.name : '')
  },
  {
    Header: t('common.center'),
    accessor: 'center',
    show: false,
    Cell: ({ value }) => (value ? value.name : '')
  },
  {
    Header: t('common.category'),
    Footer: t('common.total'),
    accessor: 'category',
    Cell: ({ value }) => defaultNameCheck(t, value.is_default, 'category.default.', value.name)
  },
  {
    Header: t('common.description'),
    accessor: 'description',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => descParser(value)
  },
  {
    Header: t('common.balance'),
    accessor: 'balance',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => tsNumbers(`$${value}/-`)
  },
  {
    Header: t('common.balance_remaining'),
    accessor: 'balance_remaining',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => tsNumbers(`$${value}/-`)
  },
  {
    Header: t('common.amount'),
    accessor: 'amount',
    Cell: ({ value }) => tsNumbers(`$${value}/-`),
    Footer: ({ data }) => {
      const totalAmount = data.reduce((sum, withdrawal) => {
        return sum + parseInt(withdrawal.amount) || 0
      }, 0)

      return tsNumbers(`৳${totalAmount}/-`)
    }
  },
  {
    Header: t('common.created_at'),
    accessor: 'created_at',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.updated_at'),
    accessor: 'updated_at',
    show: false,
    Cell: ({ value }) => tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a'))
  },
  {
    Header: t('common.creator'),
    accessor: 'author',
    show: windowWidth < 576 ? false : true,
    Cell: ({ value }) => (value ? value.name : '')
  },
  {
    Header: t('common.approval'),
    accessor: 'is_approved',
    show: isApprovalHide ? false : true,
    disable: isApprovalHide,
    isActionHide: isApprovalHide,
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
