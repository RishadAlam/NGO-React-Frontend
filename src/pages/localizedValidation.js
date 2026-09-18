// Keep local validation keys in state so existing errors follow language changes.
// Server-provided errors remain data and are displayed without modification.
export default function localizedValidation(error, t, field) {
  return typeof error === 'string' && error.startsWith('localization.pages.validation.')
    ? t(error, { field })
    : error
}
