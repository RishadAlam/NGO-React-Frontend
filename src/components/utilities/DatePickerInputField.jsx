import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { bn, enUS } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

export default function DatePickerInputField({
  label,
  defaultValue,
  error,
  setChange,
  isRequired = false,
  disabled = false
}) {
  const { t, i18n } = useTranslation()
  const locale = (i18n.resolvedLanguage || i18n.language).startsWith('bn') ? bn : enUS
  const localeText = {
    previousMonth: t('localization.shared.date.previous_month'),
    nextMonth: t('localization.shared.date.next_month'),
    openPreviousView: t('localization.shared.date.previous_view'),
    openNextView: t('localization.shared.date.next_view'),
    calendarViewSwitchingButtonAriaLabel: (view) =>
      t(
        view === 'year'
          ? 'localization.shared.date.calendar_view'
          : 'localization.shared.date.year_view'
      ),
    start: t('common.start_date'),
    end: t('localization.shared.date.select_end'),
    cancelButtonLabel: t('common.cancel'),
    clearButtonLabel: t('localization.shared.clear'),
    okButtonLabel: t('localization.shared.date.ok'),
    todayButtonLabel: t('common.today'),
    datePickerToolbarTitle: t('localization.shared.date.select_date'),
    dateRangePickerToolbarTitle: t('localization.shared.date.range'),
    selectViewText: (view) =>
      t(
        view === 'year'
          ? 'localization.shared.date.select_year'
          : 'localization.shared.date.select_month'
      ),
    calendarWeekNumberHeaderLabel: t('localization.shared.date.week_number'),
    calendarWeekNumberHeaderText: t('localization.shared.date.week_short'),
    calendarWeekNumberAriaLabelText: (number) => t('localization.shared.date.week', { number }),
    openDatePickerDialogue: (value, utils) =>
      value && utils.isValid(value)
        ? t('localization.shared.date.selected_date', { date: utils.format(value, 'fullDate') })
        : t('localization.shared.date.select_date'),
    fieldClearLabel: t('localization.shared.clear'),
    dateTableLabel: t('localization.shared.date.select_date')
  }
  const requiredLabel = (
    <span>
      {label}
      <span className="text-danger">*</span>
    </span>
  )

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={locale}
      localeText={localeText}>
      <DatePicker
        label={isRequired ? requiredLabel : label}
        className="form-control"
        value={(defaultValue && new Date(defaultValue)) || new Date()}
        format="dd/MM/yyyy"
        onChange={(newValue) => setChange(newValue)}
        error={error ? true : false}
        disabled={disabled ? true : false}
      />
      {error && <span className="text-danger my-3">{error}</span>}
    </LocalizationProvider>
  )
}
