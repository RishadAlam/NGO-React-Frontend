import { addDays, endOfDay, startOfDay, subDays } from 'date-fns'
import { bn, enUS } from 'date-fns/locale'
import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { CustomProvider, DateRangePicker } from 'rsuite'
import rsuiteEnglish from 'rsuite/locales/en_US'
import getCurrentMonth from '../../libs/getCurrentMonth'

export default function DateRangePickerInputField({
  defaultValue = getCurrentMonth(),
  setChange,
  placement = 'auto',
  disabled = false
}) {
  const { t, i18n } = useTranslation()
  const pickerRef = useRef(null)
  const overlayRef = useRef(null)
  const observerRef = useRef(null)
  const dateLocale = (i18n.resolvedLanguage || i18n.language).startsWith('bn') ? bn : enUS
  const calendarLocale = {
    ...rsuiteEnglish.DateRangePicker,
    dateLocale,
    ...Object.fromEntries(
      ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map(
        (day, index) => [day, dateLocale.localize.day(index, { width: 'short' })]
      )
    ),
    ok: t('localization.shared.date.ok'),
    today: t('common.today'),
    yesterday: t('common.yesterday'),
    now: t('localization.shared.date.now'),
    hours: t('localization.shared.date.hours'),
    minutes: t('localization.shared.date.minutes'),
    seconds: t('localization.shared.date.seconds'),
    last7Days: t('common.last_7days')
  }
  const locale = {
    ...rsuiteEnglish,
    common: {
      ...rsuiteEnglish.common,
      clear: t('localization.shared.clear'),
      loading: t('common.loading'),
      emptyMessage: t('common.No_Records_Found'),
      remove: t('common.delete')
    },
    Calendar: calendarLocale,
    DateTimeFormats: calendarLocale,
    DateRangePicker: calendarLocale
  }

  // RSuite 5 exposes locale props for text, but hard-codes these accessibility labels.
  // Limit this bridge to this picker's own root and portal, and disconnect on unmount.
  const localizePicker = useCallback(() => {
    observerRef.current?.disconnect()
    const roots = [pickerRef.current?.root, overlayRef.current].filter(Boolean)
    const labels = {
      'Previous month': t('localization.shared.date.previous_month'),
      'Next month': t('localization.shared.date.next_month'),
      'Select month': t('localization.shared.date.select_month'),
      'Select time': t('localization.shared.date.select_time'),
      'Select start date': t('localization.shared.date.select_start'),
      'Select end date': t('localization.shared.date.select_end'),
      'Collapse month view': t('localization.shared.date.collapse_month'),
      'Collapse time view': t('localization.shared.date.collapse_time'),
      ...Object.fromEntries(
        ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
          (day, index) => [day, dateLocale.localize.day(index, { width: 'wide' })]
        )
      )
    }
    const update = () =>
      roots.forEach((root) =>
        root.querySelectorAll('[aria-label]').forEach((element) => {
          const original = element.dataset.localeSource || element.getAttribute('aria-label')
          const label =
            labels[original] ||
            (/^Week \d+$/.test(original)
              ? t('localization.shared.date.week', { number: original.slice(5) })
              : null)
          if (label) {
            element.dataset.localeSource = original
            if (element.getAttribute('aria-label') !== label)
              element.setAttribute('aria-label', label)
          }
        })
      )
    update()
    observerRef.current = new MutationObserver(update)
    roots.forEach((root) =>
      observerRef.current.observe(root, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['aria-label']
      })
    )
  }, [dateLocale, t])

  useEffect(() => {
    localizePicker()
    return () => observerRef.current?.disconnect()
  }, [localizePicker])

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
    <CustomProvider locale={locale}>
      <DateRangePicker
        ref={pickerRef}
        aria-label={t('localization.shared.date.range')}
        locale={calendarLocale}
        onEntered={() => {
          overlayRef.current = pickerRef.current.overlay
          localizePicker()
        }}
        onExit={() => {
          overlayRef.current = null
          localizePicker()
        }}
        showOneCalendar
        placement={placement}
        defaultValue={defaultValue}
        format="dd-MM-yyyy"
        onChange={(newDateRange) => setChange(newDateRange)}
        ranges={Ranges}
        disabled={disabled}
      />
    </CustomProvider>
  )
}
