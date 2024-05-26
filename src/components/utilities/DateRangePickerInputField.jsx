import { addDays, endOfDay, startOfDay, subDays } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { DateRangePicker } from 'rsuite'
import getCurrentMonth from '../../libs/getCurrentMonth'

export default function DateRangePickerInputField({
  defaultValue = getCurrentMonth(),
  setChange,
  placement = 'auto',
  disabled = false
}) {
  const { t } = useTranslation()

  const Ranges = [
    {
      label: t('common.today'),
      value: [startOfDay(new Date()), endOfDay(new Date())],
      placement: 'left'
    },
    {
      label: t('common.yesterday'),
      value: [startOfDay(addDays(new Date(), -1)), endOfDay(addDays(new Date(), -1))],
      placement: 'left'
    },
    {
      label: t('common.last_7days'),
      value: [startOfDay(subDays(new Date(), 6)), endOfDay(new Date())],
      placement: 'left'
    },
    {
      label: t('common.last_30days'),
      value: [startOfDay(subDays(new Date(), 29)), endOfDay(new Date())],
      placement: 'left'
    },
    {
      label: t('common.last_month'),
      value: [
        startOfDay(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)),
        endOfDay(new Date(new Date().getFullYear(), new Date().getMonth(), 0))
      ],
      placement: 'left'
    },
    {
      label: t('common.this_month'),
      value: [
        startOfDay(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
        endOfDay(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
      ],
      placement: 'left'
    },
    {
      label: t('common.last_365days'),
      value: [startOfDay(subDays(new Date(), 364)), endOfDay(new Date())],
      placement: 'left'
    },
    {
      label: t('common.last_year'),
      value: [
        startOfDay(new Date(new Date().getFullYear() - 1, 0, 1)),
        endOfDay(new Date(new Date().getFullYear() - 1, 11, 31))
      ],
      placement: 'left'
    },
    {
      label: t('common.this_year'),
      value: [
        startOfDay(new Date(new Date().getFullYear(), 0, 1)),
        endOfDay(new Date(new Date().getFullYear(), 11, 31))
      ],
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
