import { format } from 'date-fns'
import { bn, enUS } from 'date-fns/locale'
import i18n from 'i18next'
import Cookies from 'js-cookie'

export default function dateFormat(value, dateFormat) {
  const language = i18n.resolvedLanguage || i18n.language || Cookies.get('i18next') || 'en'
  // Localize month/day/period names only. Numeric API formats (yyyy-MM-dd)
  // must stay ASCII; displayed digits are handled separately by tsNumbers.
  return format(new Date(value), dateFormat, { locale: language.startsWith('bn') ? bn : enUS })
}
