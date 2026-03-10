import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import { passwordCheckAlert, permanentDeleteAlert } from '../../helper/deleteAlert'
import ChevronLeft from '../../icons/ChevronLeft'
import ChevronRight from '../../icons/ChevronRight'
import Folder from '../../icons/Folder'
import Grid from '../../icons/Grid'
import Home from '../../icons/Home'
import List from '../../icons/List'
import Refresh from '../../icons/Refresh'
import Trash from '../../icons/Trash'
import xFetch from '../../utilities/xFetch'
import './recycleBin.scss'

const EMPTY_ARRAY = []
const UNKNOWN_FOLDER_KEY = '__unknown__'
const VIEW_MODE_STORAGE_KEY = 'recycle_bin_view_mode'
const BROWSER_STATE_STORAGE_KEY = 'recycle_bin_browser_state'
const DEFAULT_VIEW_MODE = 'grid'
const PER_PAGE_OPTIONS = [12, 24, 50, 100]
const DEFAULT_PER_PAGE = 24
const MODULE_GROUPING_CONFIG = {
  center: ['field'],
  category: ['group'],
  client_registration: ['field', 'center'],
  saving_account: ['field', 'center', 'category'],
  loan_account: ['field', 'center', 'category'],
  income: ['account', 'category'],
  expense: ['account', 'category'],
  staff: ['role'],
  audit_report_meta: ['page']
}
const MODULE_FOLDER_ORDER = [
  'field',
  'center',
  'category',
  'client_registration',
  'saving_account',
  'loan_account',
  'account',
  'income_category',
  'expense_category',
  'income',
  'expense',
  'staff',
  'audit_report_meta'
]
const ITEM_MAIN_PAGE_ROUTES = {
  client_registration: (id) => `/client-register/${id}`,
  saving_account: (id) => `/saving-account/${id}`,
  loan_account: (id) => `/loan-account/${id}`
}
const EN_TO_BN_DIGITS = {
  0: '০',
  1: '১',
  2: '২',
  3: '৩',
  4: '৪',
  5: '৫',
  6: '৬',
  7: '৭',
  8: '৮',
  9: '৯',
  $: '৳'
}
const BN_TO_EN_DIGITS = {
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

const readStoredBrowserState = () => {
  if (typeof window === 'undefined') return null

  try {
    const rawState = window.sessionStorage.getItem(BROWSER_STATE_STORAGE_KEY)
    if (!rawState) return null

    const parsedState = JSON.parse(rawState)
    if (!parsedState || typeof parsedState !== 'object' || Array.isArray(parsedState)) {
      return null
    }

    return parsedState
  } catch (error) {
    return null
  }
}

export default function RecycleBin() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { accessToken, permissions: authPermissions = EMPTY_ARRAY } = useAuthDataValue()
  const [loading, setLoading] = useLoadingState({})
  const storedBrowserState = useMemo(() => readStoredBrowserState(), [])
  const storedPerPageLimit = useMemo(() => {
    const savedPerPage = Number(storedBrowserState?.perPageLimit)
    return PER_PAGE_OPTIONS.includes(savedPerPage) ? savedPerPage : DEFAULT_PER_PAGE
  }, [storedBrowserState])
  const [searchInput, setSearchInput] = useState(() => storedBrowserState?.searchInput || '')
  const [searchQuery, setSearchQuery] = useState(() =>
    (storedBrowserState?.searchInput || '').trim()
  )
  const [deletedFrom, setDeletedFrom] = useState(() => storedBrowserState?.deletedFrom || '')
  const [deletedTo, setDeletedTo] = useState(() => storedBrowserState?.deletedTo || '')
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_VIEW_MODE

    try {
      const storedViewMode = window.localStorage.getItem(VIEW_MODE_STORAGE_KEY)
      return storedViewMode === 'list' || storedViewMode === 'grid'
        ? storedViewMode
        : DEFAULT_VIEW_MODE
    } catch (error) {
      return DEFAULT_VIEW_MODE
    }
  })
  const [perPageLimit, setPerPageLimit] = useState(storedPerPageLimit)
  const [visibleCount, setVisibleCount] = useState(() => {
    const savedVisibleCount = Number(storedBrowserState?.visibleCount)
    return Number.isInteger(savedVisibleCount) && savedVisibleCount > 0
      ? savedVisibleCount
      : storedPerPageLimit
  })
  const [moduleType, setModuleType] = useState(() =>
    typeof storedBrowserState?.moduleType === 'string' ? storedBrowserState.moduleType : null
  )
  const [subFolderFilters, setSubFolderFilters] = useState(() => {
    const savedFilters = storedBrowserState?.subFolderFilters
    return savedFilters && typeof savedFilters === 'object' && !Array.isArray(savedFilters)
      ? savedFilters
      : {}
  })
  const userLocale = useMemo(() => {
    const languageCode = (i18n?.resolvedLanguage || i18n?.language || 'en').toLowerCase()
    return languageCode.startsWith('bn') ? 'bn-BD' : 'en-US'
  }, [i18n?.language, i18n?.resolvedLanguage])
  const isBengaliLanguage = useMemo(() => {
    const languageCode = (i18n?.resolvedLanguage || i18n?.language || 'en').toLowerCase()
    return languageCode.startsWith('bn')
  }, [i18n?.language, i18n?.resolvedLanguage])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput.trim())
    }, 350)

    return () => clearTimeout(timeoutId)
  }, [searchInput])

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode)
    } catch (error) {
      // Keep UI functional if storage is unavailable.
    }
  }, [viewMode])

  const persistBrowserState = useCallback(
    (overrideState = {}) => {
      if (typeof window === 'undefined') return

      const browserState = {
        searchInput,
        deletedFrom,
        deletedTo,
        moduleType,
        subFolderFilters,
        perPageLimit,
        visibleCount,
        ...overrideState
      }

      try {
        window.sessionStorage.setItem(BROWSER_STATE_STORAGE_KEY, JSON.stringify(browserState))
      } catch (error) {
        // Keep UI functional if storage is unavailable.
      }
    },
    [deletedFrom, deletedTo, moduleType, perPageLimit, searchInput, subFolderFilters, visibleCount]
  )

  useEffect(() => {
    persistBrowserState()
  }, [persistBrowserState])

  const normalizeFolderValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return UNKNOWN_FOLDER_KEY
    }

    return String(value)
  }

  const localizeText = (value) => {
    if (value === null || value === undefined || value === '') return value

    const stringValue = String(value)
    if (isBengaliLanguage) {
      return stringValue.replace(/[0-9$]/g, (char) => EN_TO_BN_DIGITS[char] || char)
    }

    return stringValue.replace(/[০-৯৳]/g, (char) => BN_TO_EN_DIGITS[char] || char)
  }

  const normalizeInputText = (value) => {
    if (value === null || value === undefined || value === '') return value

    return String(value).replace(/[০-৯৳]/g, (char) => BN_TO_EN_DIGITS[char] || char)
  }

  const folderValueLabel = (value) =>
    value === UNKNOWN_FOLDER_KEY ? t('recycle_bin.unknown_folder') : localizeText(value)

  const typeLabel = useCallback(
    (type, fallbackLabel = '') =>
      t(`recycle_bin.module_labels.${type}`, {
        defaultValue: fallbackLabel || type
      }),
    [t]
  )

  const folderQueryParams = useMemo(() => {
    const params = {}

    if (searchQuery) params.search = searchQuery
    if (deletedFrom) params.deleted_from = deletedFrom
    if (deletedTo) params.deleted_to = deletedTo

    return params
  }, [deletedFrom, deletedTo, searchQuery])

  const itemQueryParams = useMemo(() => {
    const params = {
      type: moduleType,
      all: true
    }

    if (searchQuery) params.search = searchQuery
    if (deletedFrom) params.deleted_from = deletedFrom
    if (deletedTo) params.deleted_to = deletedTo

    return params
  }, [deletedFrom, deletedTo, moduleType, searchQuery])

  const {
    data: foldersResponse,
    error: foldersError,
    isLoading: isFoldersLoading,
    mutate: mutateFolders
  } = useSWR(
    accessToken ? ['recycle-bin/folders', JSON.stringify(folderQueryParams), accessToken] : null,
    ([endpoint]) => xFetch(endpoint, null, null, accessToken, folderQueryParams, 'GET')
  )

  const {
    data: itemsResponse,
    error: itemsError,
    isLoading: isItemsLoading,
    mutate: mutateItems
  } = useSWR(
    accessToken && moduleType
      ? ['recycle-bin/items', moduleType, JSON.stringify(itemQueryParams), accessToken]
      : null,
    ([endpoint]) => xFetch(endpoint, null, null, accessToken, itemQueryParams, 'GET')
  )

  useEffect(() => {
    if (foldersError?.status === 403 || itemsError?.status === 403) {
      navigate('/unauthorized')
    }
  }, [foldersError, itemsError, navigate])

  const moduleFolders = useMemo(() => {
    const moduleOrderIndex = (type) => {
      const index = MODULE_FOLDER_ORDER.indexOf(type)
      return index < 0 ? Number.MAX_SAFE_INTEGER : index
    }

    return (foldersResponse?.data?.folders ?? EMPTY_ARRAY)
      .map((folder) => ({
        type: folder.type,
        typeLabel: typeLabel(folder.type, folder.label || folder.type),
        totalItems: Number(folder.total_items || 0),
        latestDeletedAtUnix:
          Number(folder.last_deleted_at_unix || 0) ||
          (folder.last_deleted_at ? new Date(folder.last_deleted_at).getTime() : 0)
      }))
      .sort((firstModule, secondModule) => {
        const orderByConfig =
          moduleOrderIndex(firstModule.type) - moduleOrderIndex(secondModule.type)
        if (orderByConfig !== 0) return orderByConfig

        return firstModule.typeLabel
          .toLowerCase()
          .localeCompare(secondModule.typeLabel.toLowerCase())
      })
  }, [foldersResponse?.data?.folders, typeLabel])

  useEffect(() => {
    if (!moduleType || isFoldersLoading) return

    const hasActiveModuleFolder = moduleFolders.some((module) => module.type === moduleType)
    if (hasActiveModuleFolder) return

    setModuleType(null)
    setSubFolderFilters({})
  }, [isFoldersLoading, moduleFolders, moduleType])

  const deletedItems = itemsResponse?.data?.items ?? EMPTY_ARRAY
  const activeModule = useMemo(
    () => moduleFolders.find((module) => module.type === moduleType) || null,
    [moduleFolders, moduleType]
  )
  const activeGroupingKeys = useMemo(
    () => (moduleType ? (MODULE_GROUPING_CONFIG[moduleType] ?? EMPTY_ARRAY) : EMPTY_ARRAY),
    [moduleType]
  )

  const subFolderOptions = useMemo(() => {
    if (!activeModule || !activeGroupingKeys.length) {
      return {}
    }

    const sortValues = (firstValue, secondValue) => {
      const normalizedFirst =
        firstValue === UNKNOWN_FOLDER_KEY ? '\uffff' : firstValue.toLowerCase()
      const normalizedSecond =
        secondValue === UNKNOWN_FOLDER_KEY ? '\uffff' : secondValue.toLowerCase()

      return normalizedFirst.localeCompare(normalizedSecond)
    }

    return activeGroupingKeys.reduce((filters, groupKey, groupIndex) => {
      const scopedItems = deletedItems.filter((item) => {
        return activeGroupingKeys.slice(0, groupIndex).every((previousGroupKey) => {
          if (!subFolderFilters[previousGroupKey]) return true

          return (
            normalizeFolderValue(item?.metadata?.[previousGroupKey]) ===
            subFolderFilters[previousGroupKey]
          )
        })
      })

      const values = Array.from(
        new Set(scopedItems.map((item) => normalizeFolderValue(item?.metadata?.[groupKey])))
      ).sort(sortValues)

      return {
        ...filters,
        [groupKey]: values
      }
    }, {})
  }, [activeGroupingKeys, activeModule, deletedItems, subFolderFilters])

  useEffect(() => {
    if (!activeGroupingKeys.length) {
      setSubFolderFilters({})
      return
    }

    setSubFolderFilters((previousFilters) => {
      let hasChange = false
      const nextFilters = { ...previousFilters }

      Object.keys(nextFilters).forEach((filterKey) => {
        if (!activeGroupingKeys.includes(filterKey)) {
          delete nextFilters[filterKey]
          hasChange = true
        }
      })

      activeGroupingKeys.forEach((groupKey) => {
        const selectedValue = nextFilters[groupKey]
        if (!selectedValue) return

        const availableValues = subFolderOptions[groupKey] || EMPTY_ARRAY
        if (!availableValues.includes(selectedValue)) {
          nextFilters[groupKey] = ''
          hasChange = true
        }
      })

      return hasChange ? nextFilters : previousFilters
    })
  }, [activeGroupingKeys, subFolderOptions])

  const filteredItems = useMemo(() => {
    if (!activeModule) return EMPTY_ARRAY

    return deletedItems.filter((item) => {
      return activeGroupingKeys.every((groupKey) => {
        if (!subFolderFilters[groupKey]) return true

        return normalizeFolderValue(item?.metadata?.[groupKey]) === subFolderFilters[groupKey]
      })
    })
  }, [activeGroupingKeys, activeModule, deletedItems, subFolderFilters])
  const sortedFilteredItems = useMemo(() => {
    if (!filteredItems?.length) return EMPTY_ARRAY

    return [...filteredItems].sort((firstItem, secondItem) => {
      const firstDeletedAt = firstItem?.deleted_at ? new Date(firstItem.deleted_at).getTime() : 0
      const secondDeletedAt = secondItem?.deleted_at ? new Date(secondItem.deleted_at).getTime() : 0
      return secondDeletedAt - firstDeletedAt
    })
  }, [filteredItems])
  const subFolderFilterKey = useMemo(() => JSON.stringify(subFolderFilters), [subFolderFilters])
  const visibilityResetSignature = useMemo(
    () =>
      JSON.stringify({
        deletedFrom,
        deletedTo,
        moduleType,
        perPageLimit,
        searchQuery,
        subFolderFilterKey
      }),
    [deletedFrom, deletedTo, moduleType, perPageLimit, searchQuery, subFolderFilterKey]
  )
  const previousVisibilityResetSignatureRef = useRef(null)

  useEffect(() => {
    if (previousVisibilityResetSignatureRef.current === null) {
      previousVisibilityResetSignatureRef.current = visibilityResetSignature
      return
    }

    if (previousVisibilityResetSignatureRef.current !== visibilityResetSignature) {
      setVisibleCount(perPageLimit)
    }

    previousVisibilityResetSignatureRef.current = visibilityResetSignature
  }, [perPageLimit, visibilityResetSignature])

  const totalFilteredItems = sortedFilteredItems.length
  const visibleItems = useMemo(
    () => sortedFilteredItems.slice(0, visibleCount),
    [sortedFilteredItems, visibleCount]
  )
  const visibleItemCount = visibleItems.length
  const hasMoreItems = visibleItemCount < totalFilteredItems

  const canRestore = authPermissions.includes('recycle_bin_restore')
  const canForceDelete = authPermissions.includes('recycle_bin_force_delete')
  const showActionButtons = canRestore || canForceDelete

  const isRowLoading = (action, item) => loading?.[`${action}_${item.type}_${item.id}`] || false
  const setRowLoading = (action, item, value) => {
    setLoading((prevLoading) => ({
      ...prevLoading,
      [`${action}_${item.type}_${item.id}`]: value
    }))
  }

  const refreshRecycleBinData = () => {
    mutateFolders()
    if (moduleType) mutateItems()
  }

  const restoreItem = (item) => {
    if (!item?.restorable || !canRestore) return

    setRowLoading('restore', item, true)
    const loadingToast = toast.loading(`${t('recycle_bin.restore')}...`)
    xFetch(`recycle-bin/${item.type}/${item.id}/restore`, null, null, accessToken, null, 'POST')
      .then((restoreResponse) => {
        toast.dismiss(loadingToast)
        setRowLoading('restore', item, false)
        if (restoreResponse?.success) {
          toast.success(restoreResponse?.message || t('recycle_bin.restore_success'))
          refreshRecycleBinData()
          return
        }
        toast.error(restoreResponse?.message || t('recycle_bin.restore_failed'))
      })
      .catch((errorResponse) => {
        toast.dismiss(loadingToast)
        setRowLoading('restore', item, false)
        if (errorResponse?.status === 403) navigate('/unauthorized')
        toast.error(errorResponse?.message || t('recycle_bin.restore_failed'))
      })
  }

  const forceDeleteItem = (item) => {
    if (!item?.force_deletable || !canForceDelete) return

    permanentDeleteAlert(t).then((result) => {
      if (result.isConfirmed) {
        passwordCheckAlert(t, accessToken).then((passwordResult) => {
          if (passwordResult.isConfirmed) {
            setRowLoading('force', item, true)
            const loadingToast = toast.loading(`${t('common.delete')}...`)
            xFetch(
              `recycle-bin/${item.type}/${item.id}/force`,
              null,
              null,
              accessToken,
              null,
              'DELETE'
            )
              .then((forceDeleteResponse) => {
                toast.dismiss(loadingToast)
                setRowLoading('force', item, false)
                if (forceDeleteResponse?.success) {
                  toast.success(
                    forceDeleteResponse?.message || t('recycle_bin.force_delete_success')
                  )
                  refreshRecycleBinData()
                  return
                }
                toast.error(forceDeleteResponse?.message || t('recycle_bin.force_delete_failed'))
              })
              .catch((errorResponse) => {
                toast.dismiss(loadingToast)
                setRowLoading('force', item, false)
                if (errorResponse?.status === 403) navigate('/unauthorized')
                toast.error(errorResponse?.message || t('recycle_bin.force_delete_failed'))
              })
          }
        })
      }
    })
  }

  const actionBtnGroup = (item) => (
    <ActionBtnGroup>
      {canRestore && (
        <Tooltip TransitionComponent={Zoom} title={t('recycle_bin.restore')} arrow followCursor>
          <span>
            <IconButton
              className="text-success"
              onClick={() => restoreItem(item)}
              disabled={!item?.restorable || isRowLoading('restore', item)}>
              <Refresh size={20} />
            </IconButton>
          </span>
        </Tooltip>
      )}
      {canForceDelete && (
        <Tooltip
          TransitionComponent={Zoom}
          title={t('recycle_bin.force_delete')}
          arrow
          followCursor>
          <span>
            <IconButton
              className="text-danger"
              onClick={() => forceDeleteItem(item)}
              disabled={!item?.force_deletable || isRowLoading('force', item)}>
              <Trash size={20} />
            </IconButton>
          </span>
        </Tooltip>
      )}
    </ActionBtnGroup>
  )

  const metadataCell = (metadata, itemType) => {
    const hiddenMetadataKeys = ['image', 'image_uri', 'client_image']
    if (itemType === 'saving_account' || itemType === 'loan_account') {
      hiddenMetadataKeys.push('client')
    }
    const entries = Object.entries(metadata || {}).filter(
      ([key, value]) =>
        !hiddenMetadataKeys.includes(key) && value !== null && value !== undefined && value !== ''
    )

    if (!entries.length) return t('recycle_bin.not_available')

    return entries
      .map(([key, value]) => {
        const label = t(`recycle_bin.metadata_labels.${key}`, {
          defaultValue: key.replace(/_/g, ' ')
        })
        const normalizedValue = (() => {
          if (typeof value === 'boolean') {
            return t(value ? 'recycle_bin.yes' : 'recycle_bin.no')
          }

          return localizeText(value)
        })()
        return `${label}: ${normalizedValue}`
      })
      .join(' | ')
  }

  const formatDateTime = (value) => {
    if (!value) return t('recycle_bin.not_available')

    const parsedDate = new Date(value)
    if (Number.isNaN(parsedDate.getTime())) return t('recycle_bin.not_available')

    return new Intl.DateTimeFormat(userLocale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(parsedDate)
  }

  const formatDeletedAt = (deletedAt) =>
    deletedAt ? localizeText(formatDateTime(deletedAt)) : t('recycle_bin.not_available')

  const formatDeletedBy = (deletedBy) =>
    deletedBy?.name ? localizeText(deletedBy.name) : t('recycle_bin.not_available')

  const formatModifiedAt = (deletedAtUnix) => {
    if (!deletedAtUnix) return t('recycle_bin.not_available')

    const unixNumber = Number(deletedAtUnix)
    if (Number.isNaN(unixNumber) || unixNumber <= 0) return t('recycle_bin.not_available')

    const timestamp = unixNumber < 1000000000000 ? unixNumber * 1000 : unixNumber
    return localizeText(formatDateTime(timestamp))
  }

  const folderSizeText = (totalItems) =>
    t('recycle_bin.items_count', { count: localizeText(Number(totalItems || 0)) })

  const isClientAccountType = (type) => type === 'saving_account' || type === 'loan_account'
  const resolveItemImage = (item) =>
    item?.image_uri ||
    item?.metadata?.image_uri ||
    item?.metadata?.image ||
    item?.metadata?.client_image ||
    null

  const renderItemIcon = (item, iconSize = 16, className = '') => {
    const itemImage = resolveItemImage(item)

    if (!itemImage) {
      return <List size={iconSize} />
    }

    return (
      <img
        src={itemImage}
        alt={t('recycle_bin.record_image_alt')}
        className={`recycle-bin-item-image ${className}`.trim()}
        loading="lazy"
      />
    )
  }

  const resolveItemMainPageRoute = (item) => {
    const routeResolver = ITEM_MAIN_PAGE_ROUTES[item?.type]
    if (!routeResolver || item?.id === null || item?.id === undefined) {
      return null
    }

    return routeResolver(item.id)
  }

  const openItemMainPage = (item) => {
    const route = resolveItemMainPageRoute(item)
    if (!route) return

    persistBrowserState()
    navigate(route)
  }

  const renderGridItem = (item) => {
    const itemMainRoute = resolveItemMainPageRoute(item)

    return (
      <div key={`${item.type}_${item.id}`} className="col-12 col-md-6 col-xl-4">
        <div className="card h-100 recycle-bin-grid-item">
          <div className="card-body d-flex flex-column">
            {isClientAccountType(item.type) ? (
              <div className="recycle-bin-grid-item__header mb-2">
                {renderItemIcon(item, 18, 'recycle-bin-item-image--grid')}
                <div className="recycle-bin-grid-item__account-head">
                  <h6 className="recycle-bin-grid-item__title mb-1">
                    {itemMainRoute ? (
                      <button
                        type="button"
                        className="recycle-bin-item-link"
                        onClick={() => openItemMainPage(item)}>
                        {localizeText(item?.metadata?.client) || t('recycle_bin.not_available')}
                      </button>
                    ) : (
                      localizeText(item?.metadata?.client) || t('recycle_bin.not_available')
                    )}
                  </h6>
                  <p className="recycle-bin-grid-item__subtitle mb-0">
                    <strong>{t('recycle_bin.metadata_labels.account_no')}:</strong>{' '}
                    {localizeText(item.display_name || t('recycle_bin.not_available'))}
                  </p>
                </div>
              </div>
            ) : (
              <div className="recycle-bin-grid-item__header mb-2">
                {renderItemIcon(item, 18, 'recycle-bin-item-image--grid')}
                <h6 className="recycle-bin-grid-item__title mb-0">
                  {itemMainRoute ? (
                    <button
                      type="button"
                      className="recycle-bin-item-link"
                      onClick={() => openItemMainPage(item)}>
                      {localizeText(item.display_name)}
                    </button>
                  ) : (
                    localizeText(item.display_name)
                  )}
                </h6>
              </div>
            )}
            <p className="text-muted small mb-1">
              <strong>{t('recycle_bin.deleted_at')}:</strong> {formatDeletedAt(item.deleted_at)}
            </p>
            <p className="text-muted small mb-1">
              <strong>{t('recycle_bin.deleted_by')}:</strong> {formatDeletedBy(item.deleted_by)}
            </p>
            <p className="text-muted small mb-3">{metadataCell(item.metadata, item.type)}</p>
            {showActionButtons && (
              <div className="mt-auto pt-2 border-top recycle-bin-grid-item__actions">
                {actionBtnGroup(item)}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderRecordList = (items) => {
    const listClassName = showActionButtons
      ? 'recycle-bin-record-list'
      : 'recycle-bin-record-list recycle-bin-record-list--no-actions'

    return (
      <div className={listClassName} role="table">
        <div className="recycle-bin-record-list__head" role="row">
          <span>{t('recycle_bin.column_name')}</span>
          <span>{t('recycle_bin.column_date_modified')}</span>
          <span>{t('recycle_bin.deleted_by')}</span>
          <span>{t('recycle_bin.column_kind')}</span>
          {showActionButtons && <span>{t('common.action')}</span>}
        </div>

        <div className="recycle-bin-record-list__body">
          {items.map((item) => {
            const metadata = metadataCell(item.metadata, item.type)
            const itemMainRoute = resolveItemMainPageRoute(item)
            const title = isClientAccountType(item.type)
              ? localizeText(item?.metadata?.client) || t('recycle_bin.not_available')
              : localizeText(item.display_name)
            const details = isClientAccountType(item.type)
              ? [
                  `${t('recycle_bin.metadata_labels.account_no')}: ${localizeText(
                    item.display_name || t('recycle_bin.not_available')
                  )}`,
                  metadata !== t('recycle_bin.not_available') ? metadata : null
                ]
                  .filter(Boolean)
                  .join(' | ')
              : metadata

            return (
              <div key={`${item.type}_${item.id}`} className="recycle-bin-record-row" role="row">
                <span className="recycle-bin-record-row__name" title={details}>
                  <span className="recycle-bin-record-row__name-main">
                    {renderItemIcon(item)}
                    {itemMainRoute ? (
                      <button
                        type="button"
                        className="recycle-bin-item-link"
                        onClick={() => openItemMainPage(item)}>
                        {title}
                      </button>
                    ) : (
                      <span>{title}</span>
                    )}
                  </span>
                  <span className="recycle-bin-record-row__meta">{details}</span>
                </span>
                <span className="recycle-bin-record-row__date">
                  {formatDeletedAt(item.deleted_at)}
                </span>
                <span className="recycle-bin-record-row__deleted-by">
                  {formatDeletedBy(item.deleted_by)}
                </span>
                <span className="recycle-bin-record-row__kind">
                  {typeLabel(item.type, item.type_label || t('recycle_bin.record_kind'))}
                </span>
                {showActionButtons && (
                  <span className="recycle-bin-record-row__actions">{actionBtnGroup(item)}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderItems = (items) => {
    if (!items?.length) return null

    return viewMode === 'grid' ? (
      <div className="row g-3">{items.map(renderGridItem)}</div>
    ) : (
      renderRecordList(items)
    )
  }

  const renderFolderGrid = (folders, openFolderHandler) => (
    <div className="recycle-bin-folder-grid" role="list">
      {folders.map((folder) => (
        <button
          key={folder.id}
          type="button"
          className="recycle-bin-folder-card"
          role="listitem"
          onClick={() => openFolderHandler(folder)}>
          <span className="recycle-bin-folder-card__icon">
            <Folder size={38} />
          </span>
          <span className="recycle-bin-folder-card__name">{localizeText(folder.name)}</span>
          <span className="recycle-bin-folder-card__count">
            {folderSizeText(folder.totalItems)}
          </span>
          {folder.meta && <span className="recycle-bin-folder-card__meta">{folder.meta}</span>}
        </button>
      ))}
    </div>
  )

  const renderFolderList = (folders, openFolderHandler) => (
    <div className="recycle-bin-folder-list" role="table">
      <div className="recycle-bin-folder-list__head" role="row">
        <span>{t('recycle_bin.column_name')}</span>
        <span>{t('recycle_bin.column_date_modified')}</span>
        <span>{t('recycle_bin.column_size')}</span>
        <span>{t('recycle_bin.column_kind')}</span>
      </div>

      <div className="recycle-bin-folder-list__body">
        {folders.map((folder) => (
          <button
            key={folder.id}
            type="button"
            className="recycle-bin-folder-row"
            role="row"
            onClick={() => openFolderHandler(folder)}>
            <span className="recycle-bin-folder-row__name">
              <ChevronRight size={15} />
              <Folder size={20} />
              <span>{localizeText(folder.name)}</span>
            </span>
            <span className="recycle-bin-folder-row__date">
              {formatModifiedAt(folder.latestDeletedAtUnix)}
            </span>
            <span className="recycle-bin-folder-row__size">
              {folderSizeText(folder.totalItems)}
            </span>
            <span className="recycle-bin-folder-row__kind">{t('recycle_bin.folder_kind')}</span>
          </button>
        ))}
      </div>
    </div>
  )

  const renderFolders = (folders, openFolderHandler) => {
    if (!folders.length) return null

    return viewMode === 'grid'
      ? renderFolderGrid(folders, openFolderHandler)
      : renderFolderList(folders, openFolderHandler)
  }

  const openModule = (module) => {
    setModuleType(module.type)
    setSubFolderFilters({})
  }

  const goBack = () => {
    setModuleType(null)
    setSubFolderFilters({})
  }

  const goToCrumb = (index) => {
    if (index === 0) {
      setModuleType(null)
      setSubFolderFilters({})
    }
  }

  const updateSubFolderFilter = (groupKey, value) => {
    setSubFolderFilters((previousFilters) => {
      const nextFilters = {
        ...previousFilters,
        [groupKey]: value || ''
      }

      const selectedKeyIndex = activeGroupingKeys.indexOf(groupKey)
      if (selectedKeyIndex >= 0) {
        activeGroupingKeys.slice(selectedKeyIndex + 1).forEach((childGroupKey) => {
          if (nextFilters[childGroupKey]) nextFilters[childGroupKey] = ''
        })
      }

      return nextFilters
    })
  }

  const resetFilters = () => {
    setSearchInput('')
    setDeletedFrom('')
    setDeletedTo('')
    setModuleType(null)
    setSubFolderFilters({})

    if (typeof window === 'undefined') return
    try {
      window.sessionStorage.removeItem(BROWSER_STATE_STORAGE_KEY)
    } catch (error) {
      // Keep UI functional if storage is unavailable.
    }
  }

  const breadcrumbs = [
    { label: t('recycle_bin.root_folder') },
    ...(activeModule ? [{ label: activeModule.typeLabel || activeModule.type }] : EMPTY_ARRAY)
  ]

  const rootFolderEntries = moduleFolders.map((module) => ({
    id: module.type,
    name: module.typeLabel || module.type,
    totalItems: module.totalItems,
    latestDeletedAtUnix: module.latestDeletedAtUnix,
    meta: null,
    module
  }))

  const rootEmpty = !isFoldersLoading && moduleFolders.length === 0
  const browserLoading = moduleType ? isItemsLoading : isFoldersLoading
  const browserError = moduleType ? itemsError : foldersError

  return (
    <>
      <section className="staff recycle-bin-page">
        <div className="row align-items-center my-3">
          <div className="col-sm-6">
            <Breadcrumb
              breadcrumbs={[
                { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
                { name: t('menu.label.recycle_bin'), icon: <Trash size={16} />, active: true }
              ]}
            />
          </div>
        </div>

        <div className="row g-2 align-items-end mb-3">
          <div className="col-md-6 col-lg-3">
            <label htmlFor="recycle-bin-search" className="form-label mb-1">
              {t('common.search')}
            </label>
            <input
              id="recycle-bin-search"
              type="text"
              className="form-control"
              aria-label={t('common.search')}
              placeholder={t('recycle_bin.search_placeholder')}
              value={localizeText(searchInput)}
              onChange={(event) => setSearchInput(normalizeInputText(event.target.value))}
            />
          </div>
          <div className="col-md-3 col-lg-2">
            <label htmlFor="recycle-bin-deleted-from" className="form-label mb-1">
              {t('recycle_bin.deleted_from')}
            </label>
            <input
              id="recycle-bin-deleted-from"
              type="date"
              className="form-control"
              aria-label={t('recycle_bin.deleted_from')}
              value={deletedFrom}
              onChange={(event) => setDeletedFrom(event.target.value)}
            />
          </div>
          <div className="col-md-3 col-lg-2">
            <label htmlFor="recycle-bin-deleted-to" className="form-label mb-1">
              {t('recycle_bin.deleted_to')}
            </label>
            <input
              id="recycle-bin-deleted-to"
              type="date"
              className="form-control"
              aria-label={t('recycle_bin.deleted_to')}
              value={deletedTo}
              onChange={(event) => setDeletedTo(event.target.value)}
            />
          </div>
          <div className="col-md-3 col-lg-2">
            <label htmlFor="recycle-bin-per-page" className="form-label mb-1">
              {t('recycle_bin.per_page_limit')}
            </label>
            <select
              id="recycle-bin-per-page"
              className="form-select"
              aria-label={t('recycle_bin.per_page_limit')}
              value={perPageLimit}
              onChange={(event) => {
                const nextLimit = Number(event.target.value)
                setPerPageLimit(nextLimit > 0 ? nextLimit : DEFAULT_PER_PAGE)
              }}>
              {PER_PAGE_OPTIONS.map((limitValue) => (
                <option key={`per-page-${limitValue}`} value={limitValue}>
                  {localizeText(limitValue)}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6 col-lg-2">
            <label className="form-label mb-1">{t('recycle_bin.view_mode')}</label>
            <div className="btn-group w-100 recycle-bin-view-toggle" role="group">
              <button
                type="button"
                className={`btn btn-sm ${
                  viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'
                }`}
                onClick={() => setViewMode('list')}>
                <List size={16} />
                <span>{t('recycle_bin.view_list')}</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'
                }`}
                onClick={() => setViewMode('grid')}>
                <Grid size={16} />
                <span>{t('recycle_bin.view_grid')}</span>
              </button>
            </div>
          </div>
          <div className="col-md-3 col-lg-1">
            <button
              type="button"
              className="btn btn-outline-secondary w-100 recycle-bin-reset-btn"
              onClick={resetFilters}>
              {t('recycle_bin.reset_filters')}
            </button>
          </div>
        </div>

        {activeModule && activeGroupingKeys.length > 0 && (
          <div className="row g-2 align-items-end mb-3">
            <div className="col-12">
              <label className="form-label mb-1">{t('recycle_bin.subfolder_filters')}</label>
            </div>
            {activeGroupingKeys.map((groupKey) => {
              const subfolderLabel = t(`recycle_bin.metadata_labels.${groupKey}`, {
                defaultValue: groupKey.replace(/_/g, ' ')
              })

              return (
                <div key={groupKey} className="col-md-4 col-lg-3">
                  <label htmlFor={`recycle-bin-subfolder-${groupKey}`} className="form-label mb-1">
                    {subfolderLabel}
                  </label>
                  <select
                    id={`recycle-bin-subfolder-${groupKey}`}
                    className="form-select"
                    aria-label={subfolderLabel}
                    value={subFolderFilters[groupKey] || ''}
                    onChange={(event) => updateSubFolderFilter(groupKey, event.target.value)}>
                    <option value="">{t('recycle_bin.all_values')}</option>
                    {(subFolderOptions[groupKey] || EMPTY_ARRAY).map((value) => (
                      <option key={`${groupKey}_${value}`} value={value}>
                        {folderValueLabel(value)}
                      </option>
                    ))}
                  </select>
                </div>
              )
            })}
          </div>
        )}

        {browserError && browserError?.status !== 403 && (
          <div className="alert alert-danger" role="alert">
            {browserError?.message || t('recycle_bin.load_failed')}
          </div>
        )}

        <h5 className="recycle-bin-title mb-3">{t('recycle_bin.title')}</h5>

        <div className="recycle-bin-browser card">
          <div className="card-body">
            {browserLoading ? (
              <ReactTableSkeleton />
            ) : rootEmpty ? (
              <div className="recycle-bin-empty-state text-center py-5">
                <Folder size={26} />
                <p className="mb-0 mt-2">{t('recycle_bin.no_deleted_records')}</p>
              </div>
            ) : (
              <>
                {activeModule && (
                  <div className="recycle-bin-path mb-3">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary recycle-bin-path__back"
                      onClick={goBack}>
                      <ChevronLeft size={14} />
                      <span>{t('recycle_bin.back')}</span>
                    </button>

                    <div className="recycle-bin-path__crumbs" role="navigation">
                      {breadcrumbs.map((crumb, index) => (
                        <div key={`crumb-${index}`} className="recycle-bin-path__crumb-item">
                          <button
                            type="button"
                            className="recycle-bin-path__crumb"
                            onClick={() => goToCrumb(index)}>
                            {crumb.label}
                          </button>
                          {index !== breadcrumbs.length - 1 && <ChevronRight size={14} />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!activeModule ? (
                  <>
                    <h6 className="recycle-bin-section-title">{t('recycle_bin.folders')}</h6>
                    {renderFolders(rootFolderEntries, (folderEntry) =>
                      openModule(folderEntry.module)
                    )}
                  </>
                ) : (
                  <>
                    {totalFilteredItems > 0 && (
                      <div className="recycle-bin-records">
                        <h6 className="recycle-bin-section-title">{t('recycle_bin.records')}</h6>
                        <div className="recycle-bin-record-summary mb-3">
                          <p className="mb-0">
                            {t('recycle_bin.total_records', {
                              count: localizeText(totalFilteredItems)
                            })}
                          </p>
                          <p className="mb-0">
                            {t('recycle_bin.showing_records', {
                              shown: localizeText(visibleItemCount),
                              total: localizeText(totalFilteredItems)
                            })}
                          </p>
                        </div>
                        {renderItems(visibleItems)}
                        {hasMoreItems && (
                          <div className="recycle-bin-load-more text-center mt-3">
                            <button
                              type="button"
                              className="btn recycle-bin-load-more__btn"
                              onClick={() =>
                                setVisibleCount((previousVisible) => previousVisible + perPageLimit)
                              }>
                              {t('recycle_bin.load_more')}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {totalFilteredItems === 0 && (
                      <div className="recycle-bin-empty-state text-center py-4">
                        <p className="mb-0">{t('recycle_bin.empty_location')}</p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
