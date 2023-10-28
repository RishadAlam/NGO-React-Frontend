import { addDays, endOfDay, subDays } from 'date-fns'
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
      value: [new Date().setUTCHours(0, 0, 0, 0), endOfDay(new Date())],
      placement: 'left'
    },
    {
      label: t('common.yesterday'),
      value: [addDays(new Date(), -1).setUTCHours(0, 0, 0, 0), endOfDay(addDays(new Date(), -1))],
      placement: 'left'
    },
    {
      label: t('common.last_7days'),
      value: [subDays(new Date(), 6).setUTCHours(0, 0, 0, 0), endOfDay(new Date())],
      placement: 'left'
    },
    {
      label: t('common.last_30days'),
      value: [subDays(new Date(), 29).setUTCHours(0, 0, 0, 0), endOfDay(new Date())],
      placement: 'left'
    },
    {
      label: t('common.last_month'),
      value: [
        new Date(new Date().getFullYear(), new Date().getMonth() - 1, 2).setUTCHours(0, 0, 0, 0),
        endOfDay(new Date(new Date().getFullYear(), new Date().getMonth(), 0))
      ],
      placement: 'left'
    },
    {
      label: t('common.this_month'),
      value: [
        new Date(new Date().getFullYear(), new Date().getMonth(), 2).setUTCHours(0, 0, 0, 0),
        endOfDay(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
      ],
      placement: 'left'
    },
    {
      label: t('common.last_365days'),
      value: [subDays(new Date(), 364).setUTCHours(0, 0, 0, 0), endOfDay(new Date())],
      placement: 'left'
    },
    {
      label: t('common.last_year'),
      value: [
        new Date(new Date().getFullYear() - 1, 0, 2).setUTCHours(0, 0, 0, 0),
        endOfDay(new Date(new Date().getFullYear() - 1, 11, 31))
      ],
      placement: 'left'
    },
    {
      label: t('common.this_year'),
      value: [
        new Date(new Date().getFullYear(), 0, 2).setUTCHours(0, 0, 0, 0),
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
