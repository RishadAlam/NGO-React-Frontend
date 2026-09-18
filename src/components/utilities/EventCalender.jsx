import format from 'date-fns/format'
import getDay from 'date-fns/getDay'
import { bn, enUS } from 'date-fns/locale'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import { memo, useEffect, useRef } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import debounce from '../../libs/debounce'

function EventCalender({
  events = [],
  onClick,
  titleAccessor = (e) => e.title,
  tooltipAccessor = (e) => e.title,
  showAllEvents = true,
  mutate,
  setDateRange
}) {
  const { t, i18n } = useTranslation()
  const calendarRoot = useRef(null)
  useEffect(() => {
    const root = calendarRoot.current
    if (!root) return
    // This label is hard-coded in react-big-calendar's Month view.
    const localizeMonthLabel = () => {
      const month = root.querySelector('.rbc-month-view')
      if (month) month.setAttribute('aria-label', t('localization.shared.calendar.month'))
    }
    localizeMonthLabel()
    const observer = new MutationObserver(localizeMonthLabel)
    observer.observe(root, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [t])
  const lang = (i18n.resolvedLanguage || i18n.language).startsWith('bn') ? 'bn' : 'en'
  const locales = lang === 'bn' ? { 'bn-BD': bn } : { 'en-US': enUS }
  const culture = lang === 'bn' ? 'bn-BD' : 'en-US'
  const messages = {
    allDay: t('localization.shared.calendar.all_day'),
    month: t('localization.shared.calendar.month'),
    week: t('localization.shared.calendar.week'),
    work_week: t('localization.shared.calendar.work_week'),
    day: t('common.day'),
    agenda: t('localization.shared.calendar.agenda'),
    previous: t('localization.shared.previous'),
    next: t('localization.shared.next'),
    today: t('common.today'),
    yesterday: t('common.yesterday'),
    tomorrow: t('localization.shared.calendar.tomorrow'),
    date: t('common.date'),
    time: t('common.time'),
    event: t('localization.shared.calendar.event'),
    noEventsInRange: t('localization.shared.calendar.no_events'),
    showMore: (number) => t('localization.shared.calendar.show_more', { number }),
    nextLabel: t('localization.shared.next'),
    previousLabel: t('localization.shared.previous'),
    todayLabel: t('common.today')
  }

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
  })

  const eventStyleGetter = (event) => {
    const backgroundColor = Number(event?.is_loan_approved) ? 'green' : 'red'
    const style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0',
      display: 'block'
    }

    return {
      style
    }
  }

  const handleNavigate = debounce((date, view) => {
    if (view === 'month' || view === 'week' || view === 'day') {
      const dateRange = new Date(date)
      setDateRange(dateRange.toISOString())
      toast.loading(t('common.loading'))
      mutate()
    }
  }, 500)

  return (
    <Calendar
      elementProps={{ ref: calendarRoot }}
      className="event-calendar"
      culture={culture}
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      tooltipAccessor={tooltipAccessor}
      titleAccessor={titleAccessor}
      onSelectEvent={onClick}
      showAllEvents={showAllEvents}
      style={{ height: '70vh' }}
      messages={messages}
      eventPropGetter={eventStyleGetter}
      onNavigate={handleNavigate}
    />
  )
}

export default memo(EventCalender)
