import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import Badge from '../../components/utilities/Badge'
import DateRangePickerInputField from '../../components/utilities/DateRangePickerInputField'
import SelectBoxField from '../../components/utilities/SelectBoxField'
import ReactTable from '../../components/utilities/tables/ReactTable'
import useFetch from '../../hooks/useFetch'
import Dollar from '../../icons/Dollar'
import Home from '../../icons/Home'
import getCurrentMonth from '../../libs/getCurrentMonth'
import { TransactionTableColumns } from '../../resources/staticData/tableColumns'

export default function Transactions() {
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const [dateRange, setDateRange] = useState(getCurrentMonth())
  const [selectedAcc, setSelectedAcc] = useState(null)
  const {
    data: { data: transactions } = [],
    mutate,
    isLoading,
    isError
  } = useFetch({
    action: `accounts/transactions/${JSON.stringify(dateRange)}/${
      selectedAcc ? selectedAcc?.id : 0
    }`
  })
  const { data: { data: accounts = [] } = [], isLoading: accountsLoading } = useFetch({
    action: 'accounts/active'
  })

  const accountSelectBoxConfig = {
    options: accounts,
    value: selectedAcc || null,
    getOptionLabel: (option) =>
      option.is_default ? t(`account.default.${option.name}`) : option.name,
    onChange: (e, option) => setSelectAccount(option),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

  const setDateRangeField = (dateRanges) => {
    if (dateRanges !== null) {
      setDateRange([new Date(dateRanges[0]), new Date(dateRanges[1])])
      mutate()
    }
  }

  const setSelectAccount = (option) => {
    setSelectedAcc(option)
    mutate()
  }

  const setTransactionTypes = (value) => {
    let className = 'bg-primary'

    if (value === 'send_money') {
      className = 'bg-warning text-dark'
    } else if (value === 'received_money') {
      className = 'bg-primary'
    } else if (value === 'income') {
      className = 'bg-success'
    } else if (value === 'expense' || value === 'withdrawal') {
      className = 'bg-danger'
    }

    return <Badge name={t(`common.${value}`)} className={className} />
  }

  const columns = useMemo(
    () => TransactionTableColumns(t, windowWidth, setTransactionTypes),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth]
  )

  return (
    <>
      <section className="staff">
        <div className="row align-items-center my-3">
          <div className="col-sm-6">
            <Breadcrumb
              breadcrumbs={[
                { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
                {
                  name: t('menu.account_management.Transactions'),
                  icon: <Dollar size={16} />,
                  active: true
                }
              ]}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-lg-4 col-xxl-2 mb-3">
            <SelectBoxField
              label={t('common.account')}
              config={accountSelectBoxConfig}
              disabled={accountsLoading}
            />
          </div>
          <div className="col-sm-6 col-lg-8 col-xxl-10 text-end mb-3">
            <DateRangePickerInputField defaultValue={dateRange} setChange={setDateRangeField} />
          </div>
        </div>
        <div className="staff-table">
          {isLoading && !transactions ? (
            <ReactTableSkeleton />
          ) : (
            <ReactTable
              title={t('account_transaction.Transaction_List')}
              columns={columns}
              data={transactions}
            />
          )}
        </div>
      </section>
    </>
  )
}
