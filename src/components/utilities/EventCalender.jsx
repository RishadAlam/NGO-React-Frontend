import format from 'date-fns/format'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import { memo } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'

function EventCalender({
  events = [],
  onClick,
  titleAccessor = (e) => e.title,
  tooltipAccessor = (e) => e.title,
  showAllEvents = true
}) {
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

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      tooltipAccessor={tooltipAccessor}
      titleAccessor={titleAccessor}
      onSelectEvent={onClick}
      showAllEvents={showAllEvents}
      style={{ height: '70vh' }}
    />
  )
}

export default memo(EventCalender)
