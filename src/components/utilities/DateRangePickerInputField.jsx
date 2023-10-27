import { addDays, endOfDay, startOfDay, subDays } from 'date-fns'
import { DateRangePicker } from 'rsuite'
import getCurrentMonth from '../../libs/getCurrentMonth'

export default function DateRangePickerInputField({
  defaultValue = getCurrentMonth(),
  setChange,
  placement = 'auto',
  disabled = false
}) {
  const Ranges = [
    {
      label: 'today',
      value: [startOfDay(new Date()), endOfDay(new Date())],
      placement: 'left'
    },
    {
      label: 'yesterday',
      value: [startOfDay(addDays(new Date(), -1)), endOfDay(addDays(new Date(), -1))],
      placement: 'left'
    },
    {
      label: 'last7Days',
      value: [startOfDay(subDays(new Date(), 6)), endOfDay(new Date())],
      placement: 'left'
    }
  ]

  return (
    <DateRangePicker
      showOneCalendar
      placement={placement}
      defaultValue={defaultValue}
      format="dd-MM-yyyy"
      onChange={(newDateRange) => setChange(newDateRange)}
      ranges={Ranges}
      disabled={disabled}
    />
  )
}
