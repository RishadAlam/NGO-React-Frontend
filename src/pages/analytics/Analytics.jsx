import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import Badge from '../../components/utilities/Badge'
import DateRangePickerInputField from '../../components/utilities/DateRangePickerInputField'
import SelectBoxField from '../../components/utilities/SelectBoxField'
import TabsGroup from '../../components/utilities/TabsGroup'
import ReactTable from '../../components/utilities/tables/ReactTable'
import { defaultNameCheck } from '../../helper/defaultNameCheck'
import useFetch from '../../hooks/useFetch'
import Dollar from '../../icons/Dollar'
import Home from '../../icons/Home'
import dateFormat from '../../libs/dateFormat'
import getCurrentMonth from '../../libs/getCurrentMonth'
import tsNumbers from '../../libs/tsNumbers'

export default function Analytics() {
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()

  const [dateRange, setDateRange] = useState(getCurrentMonth())
  const [selectedField, setSelectedField] = useState(null)
  const [selectedCenter, setSelectedCenter] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedCreator, setSelectedCreator] = useState(null)
  const [selectedApprover, setSelectedApprover] = useState(null)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [selectedSourceType, setSelectedSourceType] = useState('all')
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState(null)

  const { data: { data: fields = [] } = [] } = useFetch({ action: 'fields/active' })
  const { data: { data: centers = [] } = [] } = useFetch({
    action: 'centers/active',
    queryParams: { field_id: selectedField?.id || '' }
  })
  const { data: { data: categories = [] } = [] } = useFetch({
    action: 'categories/active'
  })
  const { data: { data: incomeCategories = [] } = [] } = useFetch({
    action: 'accounts/incomes/categories/active'
  })
  const { data: { data: expenseCategories = [] } = [] } = useFetch({
    action: 'accounts/expenses/categories/active'
  })
  const { data: { data: users = [] } = [] } = useFetch({ action: 'users/active' })
  const { data: { data: accounts = [] } = [] } = useFetch({ action: 'accounts/active' })

  const sourceCapabilitiesMap = useMemo(
    () => ({
      all: {
        supportsField: true,
        supportsCenter: true,
        supportsCategory: true,
        supportsApprover: true,
        supportsAccount: true,
        supportsApprovalStatus: true,
        categoryScope: 'default'
      },
      saving_collection: {
        supportsField: true,
        supportsCenter: true,
        supportsCategory: true,
        supportsApprover: true,
        supportsAccount: true,
        supportsApprovalStatus: true,
        categoryScope: 'default'
      },
      loan_collection: {
        supportsField: true,
        supportsCenter: true,
        supportsCategory: true,
        supportsApprover: true,
        supportsAccount: true,
        supportsApprovalStatus: true,
        categoryScope: 'default'
      },
      saving_withdrawal: {
        supportsField: true,
        supportsCenter: true,
        supportsCategory: true,
        supportsApprover: true,
        supportsAccount: true,
        supportsApprovalStatus: true,
        categoryScope: 'default'
      },
      loan_saving_withdrawal: {
        supportsField: true,
        supportsCenter: true,
        supportsCategory: true,
        supportsApprover: true,
        supportsAccount: true,
        supportsApprovalStatus: true,
        categoryScope: 'default'
      },
      saving_to_saving: {
        supportsField: true,
        supportsCenter: true,
        supportsCategory: true,
        supportsApprover: true,
        supportsAccount: false,
        supportsApprovalStatus: true,
        categoryScope: 'default'
      },
      saving_to_loan: {
        supportsField: true,
        supportsCenter: true,
        supportsCategory: true,
        supportsApprover: true,
        supportsAccount: false,
        supportsApprovalStatus: true,
        categoryScope: 'default'
      },
      loan_to_saving: {
        supportsField: true,
        supportsCenter: true,
        supportsCategory: true,
        supportsApprover: true,
        supportsAccount: false,
        supportsApprovalStatus: true,
        categoryScope: 'default'
      },
      loan_to_loan: {
        supportsField: true,
        supportsCenter: true,
        supportsCategory: true,
        supportsApprover: true,
        supportsAccount: false,
        supportsApprovalStatus: true,
        categoryScope: 'default'
      },
      income: {
        supportsField: false,
        supportsCenter: false,
        supportsCategory: true,
        supportsApprover: false,
        supportsAccount: true,
        supportsApprovalStatus: false,
        categoryScope: 'income'
      },
      expense: {
        supportsField: false,
        supportsCenter: false,
        supportsCategory: true,
        supportsApprover: false,
        supportsAccount: true,
        supportsApprovalStatus: false,
        categoryScope: 'expense'
      },
      account_transfer: {
        supportsField: false,
        supportsCenter: false,
        supportsCategory: false,
        supportsApprover: false,
        supportsAccount: true,
        supportsApprovalStatus: false,
        categoryScope: 'none'
      },
      account_withdrawal: {
        supportsField: false,
        supportsCenter: false,
        supportsCategory: false,
        supportsApprover: false,
        supportsAccount: true,
        supportsApprovalStatus: false,
        categoryScope: 'none'
      },
      client_registration: {
        supportsField: true,
        supportsCenter: true,
        supportsCategory: false,
        supportsApprover: true,
        supportsAccount: false,
        supportsApprovalStatus: true,
        categoryScope: 'none'
      },
      saving_account_registration: {
        supportsField: true,
        supportsCenter: true,
        supportsCategory: true,
        supportsApprover: true,
        supportsAccount: false,
        supportsApprovalStatus: true,
        categoryScope: 'default'
      },
      loan_account_registration: {
        supportsField: true,
        supportsCenter: true,
        supportsCategory: true,
        supportsApprover: true,
        supportsAccount: false,
        supportsApprovalStatus: true,
        categoryScope: 'default'
      },
      loan_given: {
        supportsField: true,
        supportsCenter: true,
        supportsCategory: true,
        supportsApprover: true,
        supportsAccount: false,
        supportsApprovalStatus: false,
        categoryScope: 'default'
      }
    }),
    []
  )

  const sourceCapabilities =
    sourceCapabilitiesMap[selectedSourceType] || sourceCapabilitiesMap.all
  const {
    supportsField,
    supportsCenter,
    supportsCategory,
    supportsApprover,
    supportsAccount,
    supportsApprovalStatus,
    categoryScope
  } = sourceCapabilities

  const categoryOptions = useMemo(() => {
    if (categoryScope === 'income') return incomeCategories
    if (categoryScope === 'expense') return expenseCategories
    return categories
  }, [categoryScope, incomeCategories, expenseCategories, categories])

  useEffect(() => {
    if (!supportsField && selectedField) {
      setSelectedField(null)
    }

    if (!supportsCenter && selectedCenter) {
      setSelectedCenter(null)
    }

    if (!supportsCategory && selectedCategory) {
      setSelectedCategory(null)
    }

    if (
      supportsCategory &&
      selectedCategory &&
      !categoryOptions.some((option) => option.id === selectedCategory.id)
    ) {
      setSelectedCategory(null)
    }

    if (!supportsApprover && selectedApprover) {
      setSelectedApprover(null)
    }

    if (!supportsAccount && selectedAccount) {
      setSelectedAccount(null)
    }

    if (!supportsApprovalStatus && (selectedApprovalStatus?.id || 'all') !== 'all') {
      setSelectedApprovalStatus({ id: 'all', name: t('analytics.approval_status.all') })
    }
  }, [
    supportsField,
    supportsCenter,
    supportsCategory,
    supportsApprover,
    supportsAccount,
    supportsApprovalStatus,
    selectedField,
    selectedCenter,
    selectedCategory,
    selectedApprover,
    selectedAccount,
    selectedApprovalStatus,
    categoryOptions,
    t
  ])

  const {
    data: { data: analyticsRows } = [],
    isLoading
  } = useFetch({
    action: 'analytics',
    queryParams: {
      date_range: JSON.stringify(dateRange),
      field_id: supportsField ? selectedField?.id || '' : '',
      center_id: supportsCenter ? selectedCenter?.id || '' : '',
      category_id: supportsCategory ? selectedCategory?.id || '' : '',
      creator_id: selectedCreator?.id || '',
      approved_by: supportsApprover ? selectedApprover?.id || '' : '',
      account_id: supportsAccount ? selectedAccount?.id || '' : '',
      source_type: selectedSourceType === 'all' ? '' : selectedSourceType,
      approval_status: supportsApprovalStatus ? selectedApprovalStatus?.id || 'all' : 'all'
    }
  })

  const sourceTypeOptions = useMemo(
    () => [
      { id: 'all', name: t('analytics.source_types.all') },
      { id: 'client_registration', name: t('analytics.source_types.client_registration') },
      {
        id: 'saving_account_registration',
        name: t('analytics.source_types.saving_account_registration')
      },
      { id: 'loan_account_registration', name: t('analytics.source_types.loan_account_registration') },
      { id: 'loan_given', name: t('analytics.source_types.loan_given') },
      { id: 'saving_collection', name: t('analytics.source_types.saving_collection') },
      { id: 'loan_collection', name: t('analytics.source_types.loan_collection') },
      { id: 'saving_withdrawal', name: t('analytics.source_types.saving_withdrawal') },
      { id: 'loan_saving_withdrawal', name: t('analytics.source_types.loan_saving_withdrawal') },
      { id: 'saving_to_saving', name: t('analytics.source_types.saving_to_saving') },
      { id: 'saving_to_loan', name: t('analytics.source_types.saving_to_loan') },
      { id: 'loan_to_saving', name: t('analytics.source_types.loan_to_saving') },
      { id: 'loan_to_loan', name: t('analytics.source_types.loan_to_loan') },
      { id: 'income', name: t('analytics.source_types.income') },
      { id: 'expense', name: t('analytics.source_types.expense') },
      { id: 'account_transfer', name: t('analytics.source_types.account_transfer') },
      { id: 'account_withdrawal', name: t('analytics.source_types.account_withdrawal') }
    ],
    [t]
  )

  const sourceTypeTabs = useMemo(
    () =>
      sourceTypeOptions.map((item) => ({
        value: item.id,
        label: item.name
      })),
    [sourceTypeOptions]
  )

  const approvalStatusOptions = useMemo(
    () => [
      { id: 'all', name: t('analytics.approval_status.all') },
      { id: 'approved', name: t('analytics.approval_status.approved') },
      { id: 'pending', name: t('analytics.approval_status.pending') }
    ],
    [t]
  )

  const sourceTypeLabelMap = useMemo(() => {
    return sourceTypeOptions.reduce((acc, item) => {
      acc[item.id] = item.name
      return acc
    }, {})
  }, [sourceTypeOptions])

  const fieldConfig = {
    options: fields,
    value: selectedField || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => {
      setSelectedField(option)
      setSelectedCenter(null)
    },
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

  const centerConfig = {
    options: centers,
    value: selectedCenter || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setSelectedCenter(option),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

  const categoryConfig = {
    options: categoryOptions,
    value: selectedCategory || null,
    getOptionLabel: (option) => {
      if (categoryScope === 'income') {
        return defaultNameCheck(t, option.is_default, 'income_categories.default.', option.name)
      }

      if (categoryScope === 'expense') {
        return defaultNameCheck(t, option.is_default, 'expense_categories.default.', option.name)
      }

      return defaultNameCheck(t, option.is_default, 'category.default.', option.name)
    },
    onChange: (e, option) => setSelectedCategory(option),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

  const creatorConfig = {
    options: users,
    value: selectedCreator || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setSelectedCreator(option),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

  const approverConfig = {
    options: users,
    value: selectedApprover || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setSelectedApprover(option),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

  const accountConfig = {
    options: accounts,
    value: selectedAccount || null,
    getOptionLabel: (option) =>
      defaultNameCheck(t, option.is_default, 'account.default.', option.name),
    onChange: (e, option) => setSelectedAccount(option),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

  const approvalStatusConfig = {
    options: approvalStatusOptions,
    value: selectedApprovalStatus || approvalStatusOptions[0],
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setSelectedApprovalStatus(option || approvalStatusOptions[0]),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

  const setDateRangeField = (dateRanges) => {
    if (dateRanges !== null) {
      setDateRange([new Date(dateRanges[0]), new Date(dateRanges[1])])
    }
  }

  const sourceBadge = (sourceType) => {
    const name = sourceTypeLabelMap[sourceType] || t('recycle_bin.not_available')
    const themes = {
      saving_collection: { className: 'text-white', style: { backgroundColor: '#0f766e' } },
      loan_collection: { className: 'text-white', style: { backgroundColor: '#047857' } },
      saving_withdrawal: { className: 'text-white', style: { backgroundColor: '#b91c1c' } },
      loan_saving_withdrawal: { className: 'text-white', style: { backgroundColor: '#9f1239' } },
      saving_to_saving: { className: 'text-dark', style: { backgroundColor: '#facc15' } },
      saving_to_loan: { className: 'text-dark', style: { backgroundColor: '#f59e0b' } },
      loan_to_saving: { className: 'text-white', style: { backgroundColor: '#0369a1' } },
      loan_to_loan: { className: 'text-white', style: { backgroundColor: '#4338ca' } },
      income: { className: 'text-dark', style: { backgroundColor: '#22d3ee' } },
      expense: { className: 'text-white', style: { backgroundColor: '#334155' } },
      account_transfer: { className: 'text-white', style: { backgroundColor: '#7c3aed' } },
      account_withdrawal: { className: 'text-white', style: { backgroundColor: '#dc2626' } },
      client_registration: { className: 'text-white', style: { backgroundColor: '#0ea5e9' } },
      saving_account_registration: {
        className: 'text-white',
        style: { backgroundColor: '#2563eb' }
      },
      loan_account_registration: { className: 'text-white', style: { backgroundColor: '#7c3aed' } },
      loan_given: { className: 'text-white', style: { backgroundColor: '#1d4ed8' } },
      default: { className: 'bg-primary', style: null }
    }
    const theme = themes[sourceType] || themes.default

    return <Badge name={name} className={theme.className} style={theme.style} />
  }

  const transactionTypeBadge = (type) => {
    const labels = {
      collection: t('analytics.transaction_types.collection'),
      withdrawal: t('analytics.transaction_types.withdrawal'),
      transfer: t('analytics.transaction_types.transfer'),
      income: t('analytics.transaction_types.income'),
      expense: t('analytics.transaction_types.expense'),
      registration: t('analytics.transaction_types.registration')
    }
    const name = labels[type] || t('recycle_bin.not_available')
    const themes = {
      collection: { className: 'text-white', style: { backgroundColor: '#059669' } },
      withdrawal: { className: 'text-white', style: { backgroundColor: '#dc2626' } },
      transfer: { className: 'text-dark', style: { backgroundColor: '#facc15' } },
      income: { className: 'text-dark', style: { backgroundColor: '#67e8f9' } },
      expense: { className: 'text-white', style: { backgroundColor: '#475569' } },
      registration: { className: 'text-white', style: { backgroundColor: '#2563eb' } },
      default: { className: 'bg-info', style: null }
    }
    const theme = themes[type] || themes.default

    return <Badge name={name} className={theme.className} style={theme.style} />
  }

  const approvalStatusBadge = (value) => {
    if (value === null || value === undefined) {
      return <Badge name={t('analytics.approval_status.not_required')} className="bg-secondary" />
    }

    return value ? (
      <Badge name={t('analytics.approval_status.approved')} className="bg-success" />
    ) : (
      <Badge name={t('analytics.approval_status.pending')} className="bg-warning text-dark" />
    )
  }

  const setCategoryName = (category, row) => {
    if (!category) return ''

    if (Number(category?.is_default)) {
      if (row.original.source_type === 'income') {
        return defaultNameCheck(t, category.is_default, 'income_categories.default.', category.name)
      }

      if (row.original.source_type === 'expense') {
        return defaultNameCheck(
          t,
          category.is_default,
          'expense_categories.default.',
          category.name
        )
      }
    }

    return defaultNameCheck(t, category.is_default, 'category.default.', category.name)
  }

  const transferSourceTypes = useMemo(
    () =>
      new Set([
        'saving_to_saving',
        'saving_to_loan',
        'loan_to_saving',
        'loan_to_loan',
        'account_transfer'
      ]),
    []
  )

  const accountSourceTypes = useMemo(
    () =>
      new Set([
        'saving_collection',
        'loan_collection',
        'saving_withdrawal',
        'loan_saving_withdrawal',
        'income',
        'expense',
        'account_withdrawal'
      ]),
    []
  )

  const clientSourceTypes = useMemo(
    () =>
      new Set([
        'client_registration',
        'saving_account_registration',
        'loan_account_registration',
        'loan_given',
        'saving_collection',
        'loan_collection',
        'saving_withdrawal',
        'loan_saving_withdrawal',
        'saving_to_saving',
        'saving_to_loan',
        'loan_to_saving',
        'loan_to_loan'
      ]),
    []
  )

  const shouldShowAccNoColumn = selectedSourceType === 'all' || clientSourceTypes.has(selectedSourceType)
  const shouldShowClientColumn =
    selectedSourceType === 'all' || clientSourceTypes.has(selectedSourceType)
  const shouldShowAccountColumn =
    selectedSourceType === 'all' || accountSourceTypes.has(selectedSourceType)
  const shouldShowTransferColumns =
    selectedSourceType === 'all' || transferSourceTypes.has(selectedSourceType)

  const formatMoney = (amount) => tsNumbers(`৳${Number(amount || 0)}`)

  const formatAccountEntity = (entity) => {
    if (!entity) return ''

    const accNo = entity.acc_no ? tsNumbers(entity.acc_no) : ''
    const clientName = entity.client?.name || ''
    const accountName = entity.name || ''

    if (accNo && clientName) return `${accNo} (${clientName})`
    if (accNo) return accNo
    if (accountName) return accountName
    if (clientName) return clientName

    return ''
  }

  const sourceDetails = (row) => {
    const meta = row?.meta || {}
    const sourceType = row?.source_type
    const notAvailable = t('recycle_bin.not_available')
    const balanceFlow = (from, to) =>
      t('analytics.details.balance_flow', {
        from: formatMoney(from),
        to: formatMoney(to)
      })

    if (sourceType === 'saving_collection') {
      return `${t('common.deposit')}: ${formatMoney(meta.deposit)}, ${t('common.installment')}: ${tsNumbers(meta.installment || 0)}`
    }

    if (sourceType === 'loan_collection') {
      return `${t('common.loan')}: ${formatMoney(meta.loan)}, ${t('common.interest')}: ${formatMoney(meta.interest)}, ${t('common.installment')}: ${tsNumbers(meta.installment || 0)}`
    }

    if (sourceType === 'saving_withdrawal' || sourceType === 'loan_saving_withdrawal') {
      return `${t('common.previous_balance')}: ${formatMoney(meta.balance)}, ${t('common.balance')}: ${formatMoney(meta.balance_remaining)}`
    }

    if (
      sourceType === 'saving_to_saving' ||
      sourceType === 'saving_to_loan' ||
      sourceType === 'loan_to_saving' ||
      sourceType === 'loan_to_loan'
    ) {
      return `${t('analytics.from_account')}: ${balanceFlow(meta.tx_prev_balance, meta.tx_balance)}, ${t('analytics.to_account')}: ${balanceFlow(meta.rx_prev_balance, meta.rx_balance)}`
    }

    if (sourceType === 'income' || sourceType === 'expense' || sourceType === 'account_withdrawal') {
      return `${t('common.previous_balance')}: ${formatMoney(meta.previous_balance)}, ${t('common.balance')}: ${formatMoney(meta.balance)}`
    }

    if (sourceType === 'account_transfer') {
      return `${t('analytics.from_account')}: ${balanceFlow(meta.tx_prev_balance, meta.tx_balance)}, ${t('analytics.to_account')}: ${balanceFlow(meta.rx_prev_balance, meta.rx_balance)}`
    }

    if (sourceType === 'client_registration') {
      return `${t('common.nid')}: ${tsNumbers(meta.nid || notAvailable)}, ${t('common.phone')}: ${tsNumbers(meta.primary_phone || notAvailable)}, ${t('common.share')}: ${formatMoney(meta.share)}`
    }

    if (sourceType === 'saving_account_registration') {
      const clientName = meta.client?.name || notAvailable
      return `${t('common.client_name')}: ${clientName}, ${t('common.deposit')}: ${formatMoney(meta.payable_deposit)}, ${t('common.installment')}: ${tsNumbers(meta.payable_installment || 0)}, ${t('common.interest')}: ${tsNumbers(meta.payable_interest || 0)}%`
    }

    if (sourceType === 'loan_account_registration' || sourceType === 'loan_given') {
      const clientName = meta.client?.name || notAvailable
      const loanApprovalStatus = meta.is_loan_approved
        ? t('analytics.approval_status.approved')
        : t('analytics.approval_status.pending')
      return `${t('common.client_name')}: ${clientName}, ${t('common.loan')}: ${formatMoney(meta.loan_given)}, ${t('common.installment')}: ${tsNumbers(meta.payable_installment || 0)}, ${t('common.interest')}: ${tsNumbers(meta.payable_interest || 0)}%, ${t('common.status')}: ${loanApprovalStatus}`
    }

    return ''
  }

  const columns = useMemo(
    () => [
      {
        Header: t('common.#'),
        accessor: 'id',
        show: windowWidth < 576 ? false : true,
        Cell: ({ row }) => tsNumbers((row.index + 1).toString().padStart(2, '0'))
      },
      {
        Header: t('common.date'),
        accessor: 'date',
        Cell: ({ value }) => (value ? tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a')) : '')
      },
      {
        Header: t('analytics.filters.source_type'),
        accessor: 'source_type',
        Cell: ({ value }) => sourceBadge(value)
      },
      {
        Header: t('common.type'),
        accessor: 'transaction_type',
        Cell: ({ value }) => transactionTypeBadge(value)
      },
      {
        Header: t('common.amount'),
        accessor: 'amount',
        Cell: ({ value }) => tsNumbers(`৳${value ? value : 0}`),
        Footer: ({ data }) => {
          const total = data.reduce((sum, row) => sum + Number(row.amount || 0), 0)
          return tsNumbers(`৳${total}/-`)
        }
      },
      {
        Header: t('common.acc_no'),
        accessor: 'acc_no',
        show: shouldShowAccNoColumn ? (windowWidth < 992 ? false : true) : false,
        Cell: ({ value }) => (value ? tsNumbers(value) : '')
      },
      {
        Header: t('common.client_name'),
        accessor: 'client',
        show: shouldShowClientColumn ? (windowWidth < 1200 ? false : true) : false,
        Cell: ({ value }) => (value ? value.name : '')
      },
      {
        Header: t('common.field'),
        accessor: 'field',
        show: windowWidth < 768 ? false : true,
        Cell: ({ value }) => (value ? value.name : '')
      },
      {
        Header: t('common.center'),
        accessor: 'center',
        show: windowWidth < 768 ? false : true,
        Cell: ({ value }) => (value ? value.name : '')
      },
      {
        Header: t('common.category'),
        accessor: 'category',
        show: windowWidth < 992 ? false : true,
        Cell: ({ value, row }) => setCategoryName(value, row)
      },
      {
        Header: t('common.account'),
        accessor: 'account',
        show: shouldShowAccountColumn ? (windowWidth < 1200 ? false : true) : false,
        Cell: ({ value }) =>
          value ? defaultNameCheck(t, value.is_default, 'account.default.', value.name) : ''
      },
      {
        Header: t('analytics.from_account'),
        accessor: 'from_account',
        show: shouldShowTransferColumns ? (windowWidth < 1200 ? false : true) : false,
        Cell: ({ value }) => formatAccountEntity(value)
      },
      {
        Header: t('analytics.to_account'),
        accessor: 'to_account',
        show: shouldShowTransferColumns ? (windowWidth < 1200 ? false : true) : false,
        Cell: ({ value }) => formatAccountEntity(value)
      },
      {
        Header: t('common.creator'),
        accessor: 'author',
        Cell: ({ value }) => (value ? value.name : '')
      },
      {
        Header: t('common.approver'),
        accessor: 'approver',
        show: false,
        Cell: ({ value }) => (value ? value.name : '')
      },
      {
        Header: t('analytics.filters.approval_status'),
        accessor: 'is_approved',
        Cell: ({ value }) => approvalStatusBadge(value)
      },
      {
        Header: t('common.description'),
        accessor: 'description',
        show: false,
        Cell: ({ value }) =>
          value ? <div className="view ql-editor" dangerouslySetInnerHTML={{ __html: value }} /> : ''
      },
      {
        Header: t('common.details'),
        accessor: 'meta',
        show: windowWidth < 1200 ? false : true,
        Cell: ({ row }) => sourceDetails(row.original)
      },
      {
        Header: t('common.created_at'),
        accessor: 'created_at',
        show: false,
        Cell: ({ value }) => (value ? tsNumbers(dateFormat(value, 'dd/MM/yyyy hh:mm a')) : '')
      }
    ],
    [
      t,
      windowWidth,
      sourceTypeLabelMap,
      shouldShowAccNoColumn,
      shouldShowClientColumn,
      shouldShowAccountColumn,
      shouldShowTransferColumns
    ]
  )

  return (
    <section className="staff">
      <div className="row align-items-center my-3">
        <div className="col-sm-6">
          <Breadcrumb
            breadcrumbs={[
              { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
              {
                name: t('menu.label.analytics'),
                icon: <Dollar size={16} />,
                active: true
              }
            ]}
          />
        </div>
      </div>

      <div className="staff-table rounded-4 py-0 mb-3">
        <TabsGroup
          defaultValue={selectedSourceType}
          setValue={setSelectedSourceType}
          data={sourceTypeTabs}
        />
        <div className="border-bottom" />
      </div>

      <div className="row">
        {supportsField && (
          <div className="col-md-6 col-lg-4 col-xxl-2 mb-3">
            <SelectBoxField label={t('common.field')} config={fieldConfig} />
          </div>
        )}
        {supportsCenter && (
          <div className="col-md-6 col-lg-4 col-xxl-2 mb-3">
            <SelectBoxField label={t('common.center')} config={centerConfig} />
          </div>
        )}
        {supportsCategory && (
          <div className="col-md-6 col-lg-4 col-xxl-2 mb-3">
            <SelectBoxField label={t('common.category')} config={categoryConfig} />
          </div>
        )}
        <div className="col-md-6 col-lg-4 col-xxl-2 mb-3">
          <SelectBoxField label={t('common.creator')} config={creatorConfig} />
        </div>
        {supportsApprover && (
          <div className="col-md-6 col-lg-4 col-xxl-2 mb-3">
            <SelectBoxField label={t('common.approver')} config={approverConfig} />
          </div>
        )}
        {supportsAccount && (
          <div className="col-md-6 col-lg-4 col-xxl-2 mb-3">
            <SelectBoxField label={t('common.account')} config={accountConfig} />
          </div>
        )}
        {supportsApprovalStatus && (
          <div className="col-md-6 col-lg-4 col-xxl-2 mb-3">
            <SelectBoxField
              label={t('analytics.filters.approval_status')}
              config={approvalStatusConfig}
            />
          </div>
        )}
        <div className="col-md-12 mb-3 text-end">
          <DateRangePickerInputField defaultValue={dateRange} setChange={setDateRangeField} />
        </div>
      </div>

      <div className="staff-table">
        {isLoading && !analyticsRows ? (
          <ReactTableSkeleton />
        ) : (
          <ReactTable
            title={t('analytics.table_title')}
            columns={columns}
            data={analyticsRows || []}
            footer={true}
          />
        )}
      </div>
    </section>
  )
}
