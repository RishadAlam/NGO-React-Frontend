const STORAGE_KEY_PREFIX = 'ngo_table_column_visibility'

const isStorageAvailable = () => typeof window !== 'undefined' && Boolean(window.localStorage)

const sanitizeKeyPart = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_.-]/g, '_')

export const createTableColumnVisibilityStorageKey = (...parts) =>
  [STORAGE_KEY_PREFIX, ...parts]
    .flat()
    .filter((part) => part !== undefined && part !== null && String(part).trim() !== '')
    .map((part) => sanitizeKeyPart(part))
    .join(':')

export const getColumnVisibilityId = (column, index = 0) => {
  if (typeof column?.id === 'string' && column.id.trim() !== '') return column.id
  if (typeof column?.accessor === 'string' && column.accessor.trim() !== '') return column.accessor
  return `column_${index}`
}

export const getColumnVisibilitySignature = (columns = []) =>
  columns
    .map((column, index) => getColumnVisibilityId(column, index))
    .filter(Boolean)
    .join('|')

export const getDefaultColumnVisibilityState = (columns = []) => {
  const visibilityState = {}

  columns.forEach((column, index) => {
    const columnId = getColumnVisibilityId(column, index)
    visibilityState[columnId] = column?.show !== false
  })

  return visibilityState
}

export const getHiddenColumnsFromVisibilityState = (columns = [], visibilityState = {}) => {
  const hiddenColumns = []

  columns.forEach((column, index) => {
    const columnId = getColumnVisibilityId(column, index)
    if (visibilityState[columnId] === false) {
      hiddenColumns.push(columnId)
    }
  })

  return hiddenColumns
}

export const getColumnVisibilityStateFromTableInstance = (columns = []) => {
  const visibilityState = {}

  columns.forEach((column, index) => {
    const columnId = getColumnVisibilityId(column, index)
    visibilityState[columnId] = column?.isVisible !== false
  })

  return visibilityState
}

export const getColumnVisibilityStateFromHiddenColumns = (columns = [], hiddenColumns = []) => {
  const hiddenColumnSet = new Set(hiddenColumns)
  const visibilityState = {}

  columns.forEach((column, index) => {
    const columnId = getColumnVisibilityId(column, index)
    visibilityState[columnId] = !hiddenColumnSet.has(columnId)
  })

  return visibilityState
}

export const loadColumnVisibilityState = (storageKey, fallbackState = {}) => {
  const nextState = { ...fallbackState }
  if (!storageKey || !isStorageAvailable()) return nextState

  try {
    const parsedData = JSON.parse(window.localStorage.getItem(storageKey) || '{}')
    if (!parsedData || typeof parsedData !== 'object' || Array.isArray(parsedData)) {
      return nextState
    }

    Object.keys(nextState).forEach((columnId) => {
      if (typeof parsedData[columnId] === 'boolean') {
        nextState[columnId] = parsedData[columnId]
      }
    })
  } catch (_error) {
    return nextState
  }

  return nextState
}

export const saveColumnVisibilityState = (storageKey, visibilityState = {}) => {
  if (!storageKey || !isStorageAvailable()) return

  try {
    const nextSerializedState = JSON.stringify(visibilityState)
    if (window.localStorage.getItem(storageKey) !== nextSerializedState) {
      window.localStorage.setItem(storageKey, nextSerializedState)
    }
  } catch (_error) {
    // Ignore storage errors silently (private mode, full quota, etc.).
  }
}
