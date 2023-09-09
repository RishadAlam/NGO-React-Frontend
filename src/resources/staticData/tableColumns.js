export const DashSavingCollectionTableColumns = (t, windowWidth) => [
  { Header: '#', accessor: 'id' },
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
  { Header: '#', accessor: 'id' },
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
  { Header: '#', accessor: 'id', show: false },
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

export const StaffTableColumns = (t, windowWidth, avatar) => [
  {
    Header: '#',
    accessor: 'id',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row }) => (row.index + 1).toString().padStart(2, '0')
  },
  {
    Header: t('common.image'),
    accessor: 'image',
    show: windowWidth < 576 ? false : true,
    Cell: ({ row, value }) => avatar(row.original.name, value)
  },
  { Header: t('common.name'), accessor: 'name' },
  { Header: t('common.email'), accessor: 'email', show: windowWidth < 576 ? false : true },
  { Header: t('common.role'), accessor: 'role' },
  { Header: t('common.mobile'), accessor: 'mobile', show: windowWidth < 576 ? false : true },
  {
    Header: t('common.status'),
    accessor: 'status',
    Cell: (props) => {
      console.log(props.row.original.id)
    }
  },
  {
    Header: t('common.toggle_status'),
    accessor: 'toggle_status',
    show: windowWidth < 576 ? false : true
  },
  { Header: t('common.action'), accessor: 'action', show: windowWidth < 576 ? false : true }
]
