import format from 'date-fns/format'
import getDay from 'date-fns/getDay'
import { bn, enUS } from 'date-fns/locale'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import { memo } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import debounce from '../../libs/debounce'

function EventCalender({
  events = [],
  onClick,
  titleAccessor = (e) => e.title,
  tooltipAccessor = (e) => e.title,
  showAllEvents = false,
  mutate,
  setDateRange
}) {
  const lang = document.querySelector('html').lang
  const locales = lang === 'bn' ? { 'bn-BD': bn } : { 'en-US': enUS }
  const culture = lang === 'bn' ? 'bn-BD' : 'en-US'
  const messages = lang === 'bn' ? bnView : enView

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
  })

  const eventStyleGetter = (event, start, end, isSelected) => {
    const backgroundColor = event?.is_loan_approved ? 'green' : 'red'
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
      mutate()
    }
  }, 500)

  return (
    <Calendar
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

const bnView = {
  allDay: 'সকল দিন',
  month: 'মাস',
  week: 'সপ্তাহ',
  day: 'দিন',
  agenda: 'অজেন্ডা',
  previous: 'পূর্ববর্তী',
  next: 'পরবর্তী',
  today: 'আজ',
  date: 'তারিখ',
  time: 'সময়',
  event: 'ঘটনা',
  showMore: (total) => `আরো দেখুন (${total})`,
  nextLabel: 'পরবর্তী',
  previousLabel: 'পূর্ববর্তী',
  todayLabel: 'আজ'
}
const enView = {
  allDay: 'All Day',
  month: 'Month',
  week: 'Week',
  day: 'Day',
  agenda: 'Agenda',
  previous: 'Back',
  next: 'Next',
  today: 'Today',
  date: 'Date',
  time: 'time',
  event: 'Event',
  showMore: (total) => `Show More (${total})`,
  nextLabel: 'Next',
  previousLabel: 'Back',
  todayLabel: 'Today'
}
