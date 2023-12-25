import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import TransferRegistration from '../../components/transfer/TransferRegistration'
import Badge from '../../components/utilities/Badge'
import DateRangePickerInputField from '../../components/utilities/DateRangePickerInputField'
import PrimaryBtn from '../../components/utilities/PrimaryBtn'
import ReactTable from '../../components/utilities/tables/ReactTable'
import useFetch from '../../hooks/useFetch'
import Dollar from '../../icons/Dollar'
import Home from '../../icons/Home'
import Pen from '../../icons/Pen'
import getCurrentMonth from '../../libs/getCurrentMonth'
import { TransferTableColumns } from '../../resources/staticData/tableColumns'

export default function Transfers() {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const [dateRange, setDateRange] = useState(getCurrentMonth())
  const {
    data: { data: transfers } = [],
    mutate,
    isLoading,
    isError
  } = useFetch({
    action: 'accounts/transfers',
    queryParams: { date_range: JSON.stringify(dateRange) }
  })

  const setDateRangeField = (dateRanges) => {
    if (dateRanges !== null) {
      setDateRange([new Date(dateRanges[0]), new Date(dateRanges[1])])
      mutate()
    }
  }

  const setTransactionTypes = (value) => {
    let className = value === 'send_money' ? 'bg-danger' : 'bg-primary'
    return <Badge name={t(`common.${value}`)} className={className} />
  }

  const columns = useMemo(
    () => TransferTableColumns(t, windowWidth, setTransactionTypes),
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
                  name: t('menu.account_management.Transfers'),
                  icon: <Dollar size={16} />,
                  active: true
                }
              ]}
            />
          </div>
          <div className="col-sm-6 text-end">
            <PrimaryBtn
              name={t('account_transfer.Transfer_Registration')}
              loading={false}
              endIcon={<Pen size={20} />}
              onclick={() => setIsTransferModalOpen(true)}
            />
            {isTransferModalOpen && (
              <TransferRegistration
                isOpen={isTransferModalOpen}
                setIsOpen={setIsTransferModalOpen}
                mutate={mutate}
              />
            )}
          </div>
        </div>
        <div className="text-end mb-3">
          <DateRangePickerInputField defaultValue={dateRange} setChange={setDateRangeField} />
        </div>
        <div className="staff-table">
          {isLoading && !transfers ? (
            <ReactTableSkeleton />
          ) : (
            <ReactTable
              title={t('account_transfer.Transfer_List')}
              columns={columns}
              data={transfers}
              footer={true}
            />
          )}
        </div>
      </section>
    </>
  )
}
