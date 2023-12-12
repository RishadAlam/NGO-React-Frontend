import format from 'date-fns/format'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { useTranslation } from 'react-i18next'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import useFetch from '../../hooks/useFetch'
import BankTransferOut from '../../icons/BankTransferOut'
import CheckPatch from '../../icons/CheckPatch'
import Home from '../../icons/Home'

export default function PendingLoans() {
  const { t } = useTranslation()

  const locales = {
    'en-US': enUS
  }

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
  })

  const {
    data: { data: loanAccounts = [] } = [],
    mutate,
    isLoading,
    isError
  } = useFetch({
    action: 'client/registration/loan',
    queryParams: {
      fetch_pending_loans: true
    }
  })

  const events = loanAccounts.map((loan) => ({
    id: loan.id,
    start: new Date(loan.start_date),
    end: new Date(loan.start_date),
    allDay: true,
    title: loan.category.is_default
      ? t(`category.default.${loan.category.name}`)
      : loan.category.name,
    resource: 'This is a test description of an event',
    data: 'you can add what ever random data you may want to use later'
  }))
  console.log(events)

  return (
    <>
      <section className="staff">
        <div className="row align-items-center my-3">
          <div className="col-sm-6">
            <Breadcrumb
              breadcrumbs={[
                { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
                {
                  name: t('menu.categories.Pending_Approval'),
                  icon: <CheckPatch size={16} />,
                  active: false
                },
                {
                  name: t('menu.label.pending_loans'),
                  icon: <BankTransferOut size={16} />,
                  active: true
                }
              ]}
            />
          </div>
        </div>
        <div>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            tooltipAccessor={(event) => event.data}
            titleAccessor={(event) => event.data}
            onSelectEvent={(event) => console.log(event)}
            showAllEvents={true}
            style={{ height: '70vh' }}
          />
        </div>
      </section>
    </>
  )
}
