const BANGLA_TO_ENGLISH_DIGITS = {
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9',
  '৳': '$'
}

export const ALL_COLLECTION_SHEET_CENTERS = 'all'

export function normalizeCollectionSheetSearch(value) {
  return String(value ?? '')
    .replace(/[০১২৩৪৫৬৭৮৯৳]/g, (character) => BANGLA_TO_ENGLISH_DIGITS[character])
    .replace(/<[^>]*>/g, ' ')
    .normalize('NFKC')
    .toLocaleLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

export function filterCollectionSheetData({
  data = [],
  accountKey,
  query,
  selectedCenter = ALL_COLLECTION_SHEET_CENTERS,
  context = [],
  translate = (key) => key
}) {
  const normalizedQuery = normalizeCollectionSheetSearch(query)

  if (!normalizedQuery && selectedCenter === ALL_COLLECTION_SHEET_CENTERS) return data

  const collectionKey = accountKey === 'loan_account' ? 'loan_collection' : 'saving_collection'

  return data.reduce((filteredCenters, center) => {
    if (
      selectedCenter !== ALL_COLLECTION_SHEET_CENTERS &&
      getCenterFilterValue(center) !== selectedCenter
    ) {
      return filteredCenters
    }

    if (!normalizedQuery) {
      filteredCenters.push(center)
      return filteredCenters
    }

    const centerSearchText = createSearchText(center?.name, center?.field?.name, context)
    const filteredAccounts = (center?.[accountKey] || []).filter((account) => {
      const collections = account?.[collectionKey] || []
      const accountSearchText = createSearchText(
        account?.acc_no,
        account?.name,
        account?.client_registration?.name,
        account?.category?.name,
        getLocalizedDefaultName(account?.category, 'category.default.', translate),
        account?.category_name,
        account?.field?.name,
        account?.center?.name,
        account?.payable_deposit,
        account?.loan_installment,
        account?.interest_installment,
        collections.flatMap((collection) => [
          collection?.account?.name,
          getLocalizedDefaultName(collection?.account, 'account.default.', translate),
          collection?.author?.name,
          collection?.description,
          collection?.installment,
          collection?.deposit,
          collection?.loan,
          collection?.interest,
          collection?.total,
          getDateSearchValues(collection?.created_at)
        ])
      )

      return `${centerSearchText} ${accountSearchText}`.includes(normalizedQuery)
    })

    if (filteredAccounts.length) {
      filteredCenters.push({ ...center, [accountKey]: filteredAccounts })
    }

    return filteredCenters
  }, [])
}

export function createCollectionSheetCenterOptions(data = []) {
  const centerMap = new Map()

  data.forEach((center) => {
    const value = getCenterFilterValue(center)
    if (!value) return

    centerMap.set(value, {
      value,
      label: center?.name || String(center?.id ?? '')
    })
  })

  return Array.from(centerMap.values()).sort((first, second) =>
    first.label.localeCompare(second.label)
  )
}

function createSearchText(...values) {
  return normalizeCollectionSheetSearch(values.flat(Infinity).filter(hasValue).join(' '))
}

function getLocalizedDefaultName(item, translationPath, translate) {
  if (!item?.name) return ''
  return Number(item?.is_default) ? translate(`${translationPath}${item.name}`) : item.name
}

function getDateSearchValues(value) {
  if (!value) return []

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return [value]

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours() % 12 || 12).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const meridiem = date.getHours() >= 12 ? 'PM' : 'AM'
  const displayDate = `${day}/${month}/${year}`

  return [value, displayDate, `${displayDate} ${hours}:${minutes} ${meridiem}`]
}

function getCenterFilterValue(center) {
  const centerId = [
    center?.id,
    center?.loan_account?.[0]?.center_id,
    center?.saving_account?.[0]?.center_id
  ].find(hasValue)

  if (hasValue(centerId)) return `id:${centerId}`
  if (hasValue(center?.name)) return `name:${normalizeCollectionSheetSearch(center.name)}`
  return ''
}

function hasValue(value) {
  return value !== undefined && value !== null && value !== ''
}
