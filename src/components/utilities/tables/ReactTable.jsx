import { FormControlLabel, Switch, useMediaQuery } from '@mui/material'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { memo, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useGlobalFilter, usePagination, useResizeColumns, useSortBy, useTable } from 'react-table'
import {
  createTableColumnVisibilityStorageKey,
  getColumnVisibilityId,
  getColumnVisibilitySignature,
  getColumnVisibilityStateFromHiddenColumns,
  getDefaultColumnVisibilityState,
  getHiddenColumnsFromVisibilityState,
  loadColumnVisibilityState,
  saveColumnVisibilityState
} from '../../../helper/tableColumnVisibility'
import ChevronDown from '../../../icons/ChevronDown'
import CornerRightDownArrow from '../../../icons/CornerRightDownArrow'
import CornerRightUpArrow from '../../../icons/CornerRightUpArrow'
import MoreVertical from '../../../icons/MoreVertical'
import tsNumbers from '../../../libs/tsNumbers'
import { MobileTableActionContext } from '../ActionBtnGroup'
import GlobalFilter from '../GlobalFilter'
import PageOptions from './PageOptions'
import ShowingRows from './ShowingRows'
import useVirtualRows from './useVirtualRows'
import './table.scss'

const withoutReactKey = (props) => {
  const nextProps = { ...props }
  delete nextProps.key
  return nextProps
}

const MOBILE_PRIMARY_COLUMN_PRIORITY = [
  'name',
  'display_name',
  'client_name',
  'member_name',
  'role_name',
  'acc_no',
  'account',
  'transaction_account',
  'transaction_category',
  'category',
  'field',
  'center',
  'group',
  'description',
  'type_label',
  'type',
  'email',
  'phone'
]

const MOBILE_EMPHASIS_COLUMN_PRIORITY = [
  'amount',
  'total',
  'balance',
  'total_balance',
  'balance_remaining',
  'deposit',
  'saving_collection',
  'loan_collection',
  'loan',
  'saving',
  'income',
  'expense',
  'status',
  'is_approved'
]

const MOBILE_PRIMARY_EXCLUDED_COLUMNS = [
  'action',
  'image_uri',
  'image',
  'avatar',
  'photo',
  'status',
  'is_approved',
  'approval',
  'amount',
  'total',
  'balance',
  'deposit',
  'loan',
  'saving',
  'income',
  'expense',
  'date',
  'time',
  'created_at',
  'updated_at',
  'deleted_at',
  'approved_at',
  'verified_at'
]

const MOBILE_SERIAL_COLUMN_LABELS = new Set([
  '#',
  'no',
  'no.',
  's/n',
  'sl',
  'sl.',
  's/l',
  'serial',
  'serial no',
  'serial no.',
  'serial number',
  'ক্রমিক',
  'ক্রমিক নং',
  'ক্র/নং'
])

const getCellColumnId = (cell) => String(cell?.column?.id || '').toLowerCase()

const columnIdMatches = (columnId, candidate) =>
  columnId === candidate || columnId.endsWith(`.${candidate}`) || columnId.endsWith(`_${candidate}`)

const findCellIndexByPriority = (cells, priorities) => {
  for (const priority of priorities) {
    const index = cells.findIndex((cell) => columnIdMatches(getCellColumnId(cell), priority))
    if (index >= 0) return index
  }

  return -1
}

const getMobilePrimaryCellIndex = (cells) => {
  const explicitIndex = cells.findIndex((cell) => cell?.column?.mobilePrimary === true)
  if (explicitIndex >= 0) return explicitIndex

  const semanticIndex = findCellIndexByPriority(cells, MOBILE_PRIMARY_COLUMN_PRIORITY)
  if (semanticIndex >= 0) return semanticIndex

  const fallbackIndex = cells.findIndex((cell) => {
    const columnId = getCellColumnId(cell)
    return (
      cell?.column?.isActionHide !== false &&
      !MOBILE_PRIMARY_EXCLUDED_COLUMNS.some((excluded) => columnIdMatches(columnId, excluded))
    )
  })

  if (fallbackIndex >= 0) return fallbackIndex

  const nonActionIndex = cells.findIndex((cell) => cell?.column?.isActionHide !== false)
  return nonActionIndex >= 0 ? nonActionIndex : 0
}

const getMobileEmphasisCellIndex = (cells, primaryIndex) => {
  const explicitIndex = cells.findIndex((cell) => cell?.column?.mobileEmphasis === true)
  if (explicitIndex >= 0 && explicitIndex !== primaryIndex) return explicitIndex

  const semanticIndex = findCellIndexByPriority(cells, MOBILE_EMPHASIS_COLUMN_PRIORITY)
  return semanticIndex !== primaryIndex ? semanticIndex : -1
}

const isMobileLeadingCell = (cell) =>
  ['image_uri', 'image', 'avatar', 'photo'].some((candidate) =>
    columnIdMatches(getCellColumnId(cell), candidate)
  )

const getCellLabel = (cell) =>
  typeof cell?.column?.Header === 'string' ? cell.column.Header : cell?.column?.id || ''

const isMobileSerialColumn = (column) => {
  if (column?.mobileSerial === true) return true
  if (typeof column?.Header !== 'string') return false

  return MOBILE_SERIAL_COLUMN_LABELS.has(column.Header.trim().toLowerCase())
}

const isLargeMobileDetailSet = (cells) =>
  cells.length >= 3 ||
  cells.some((cell) => typeof cell.value === 'string' && cell.value.trim().length > 72)

const isInteractiveTarget = (target) =>
  target instanceof Element &&
  Boolean(
    target.closest('a, button, input, select, summary, textarea, [role="button"], [role="link"]')
  )

function MobileTableList({
  rows,
  prepareRow,
  isRowClickable,
  navigate,
  rowLinkPath,
  rowLinkPrefix,
  emptyLabel,
  footerGroups,
  showFooter,
  moreLabel,
  lessLabel
}) {
  if (!rows.length) {
    return (
      <div className="mobile-data-list mobile-data-list--empty" role="status">
        {emptyLabel}
      </div>
    )
  }

  const openRow = (row) => {
    if (!isRowClickable) return
    navigate(`${rowLinkPath}/${row.original[rowLinkPrefix]}`)
  }

  return (
    <div className="mobile-data-list" role="table">
      <div className="mobile-data-list__body" role="rowgroup">
        {rows.map((row) => {
          prepareRow(row)

          const mobileCells = row.cells.filter((cell) => !isMobileSerialColumn(cell.column))
          const primaryIndex = getMobilePrimaryCellIndex(mobileCells)
          const emphasisIndex = getMobileEmphasisCellIndex(mobileCells, primaryIndex)
          const leadingIndex = mobileCells.findIndex(isMobileLeadingCell)
          const actionIndex = mobileCells.findIndex((cell) => cell.column?.isActionHide === false)
          const primaryCell = mobileCells[primaryIndex]
          const emphasisCell = emphasisIndex >= 0 ? mobileCells[emphasisIndex] : null
          const leadingCell = leadingIndex >= 0 ? mobileCells[leadingIndex] : null
          const actionCell = actionIndex >= 0 ? mobileCells[actionIndex] : null
          const detailCells = mobileCells.filter(
            (cell, index) =>
              ![primaryIndex, emphasisIndex, leadingIndex, actionIndex].includes(index) &&
              cell.value !== null &&
              cell.value !== undefined &&
              cell.value !== ''
          )
          const hasExpandableDetails = isLargeMobileDetailSet(detailCells)
          const renderedDetails = (
            <div className="mobile-data-row__details">
              {detailCells.map((cell) => (
                <div className="mobile-data-row__field" key={cell.column.id}>
                  <span>{getCellLabel(cell)}</span>
                  <div>{cell.render('Cell')}</div>
                </div>
              ))}
            </div>
          )

          return (
            <div
              key={row.id}
              className={`mobile-data-row ${actionCell ? 'mobile-data-row--has-actions' : ''} ${
                isRowClickable ? 'mobile-data-row--clickable' : ''
              }`.trim()}
              role="row"
              tabIndex={isRowClickable ? 0 : undefined}
              onClick={(event) => {
                if (!isInteractiveTarget(event.target)) openRow(row)
              }}
              onKeyDown={(event) => {
                if (
                  !isRowClickable ||
                  isInteractiveTarget(event.target) ||
                  !['Enter', ' '].includes(event.key)
                )
                  return
                event.preventDefault()
                openRow(row)
              }}>
              <div
                className={`mobile-data-row__topline ${
                  leadingCell ? 'mobile-data-row__topline--with-leading' : ''
                } ${emphasisCell ? '' : 'mobile-data-row__topline--single-value'}`.trim()}>
                {leadingCell && (
                  <div className="mobile-data-row__leading">{leadingCell.render('Cell')}</div>
                )}
                {primaryCell && (
                  <div className="mobile-data-row__primary">
                    <span>{getCellLabel(primaryCell)}</span>
                    <div className="mobile-data-row__value">{primaryCell.render('Cell')}</div>
                  </div>
                )}
                {emphasisCell && (
                  <div className="mobile-data-row__emphasis">
                    <span>{getCellLabel(emphasisCell)}</span>
                    <div className="mobile-data-row__value">{emphasisCell.render('Cell')}</div>
                  </div>
                )}
              </div>

              {detailCells.length > 0 &&
                (hasExpandableDetails ? (
                  <details
                    className="mobile-data-row__disclosure"
                    onClick={(event) => event.stopPropagation()}>
                    <summary>
                      <span className="mobile-data-row__disclosure-more">{moreLabel}</span>
                      <span className="mobile-data-row__disclosure-less">{lessLabel}</span>
                      <span className="mobile-data-row__disclosure-count">
                        {detailCells.length}
                      </span>
                      <ChevronDown size={16} />
                    </summary>
                    {renderedDetails}
                  </details>
                ) : (
                  renderedDetails
                ))}

              {actionCell && (
                <div
                  className="mobile-data-row__actions"
                  onClick={(event) => event.stopPropagation()}>
                  <MobileTableActionContext.Provider value>
                    {actionCell.render('Cell')}
                  </MobileTableActionContext.Provider>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {showFooter && (
        <div className="mobile-data-list__summary" role="rowgroup">
          {footerGroups.flatMap((footerGroup, footerGroupIndex) =>
            footerGroup.headers
              .filter(
                (column) =>
                  !isMobileSerialColumn(column) &&
                  column.Footer !== undefined &&
                  column.Footer !== null
              )
              .map((column) => (
                <div
                  className="mobile-data-list__summary-item"
                  key={`${footerGroupIndex}-${column.id}`}
                  role="row">
                  <span>{typeof column.Header === 'string' ? column.Header : column.id}</span>
                  <div>{column.render('Footer')}</div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  )
}

function ReactTable({
  title,
  columns,
  data = [],
  footer = false,
  classnames = '',
  rowLinkPath = '#',
  rowLinkPrefix = '#'
}) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const isRowClickable = rowLinkPath !== '#'
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const isMobileTable = useMediaQuery('(max-width:767.98px)', { noSsr: true })
  const columnVisibilitySignature = useMemo(() => getColumnVisibilitySignature(columns), [columns])
  const columnVisibilityStorageKey = useMemo(
    () =>
      createTableColumnVisibilityStorageKey(
        'react_table',
        rowLinkPath,
        rowLinkPrefix,
        columnVisibilitySignature
      ),
    [columnVisibilitySignature, rowLinkPath, rowLinkPrefix]
  )
  const initialHiddenColumns = useMemo(() => {
    const defaultVisibilityState = getDefaultColumnVisibilityState(columns)
    const visibilityState = loadColumnVisibilityState(
      columnVisibilityStorageKey,
      defaultVisibilityState
    )

    if (window.matchMedia('(max-width: 767.98px)').matches) {
      columns.forEach((column, index) => {
        if (column?.isActionHide === false) {
          visibilityState[getColumnVisibilityId(column, index)] = true
        }
      })
    }

    return getHiddenColumnsFromVisibilityState(columns, visibilityState)
  }, [columnVisibilityStorageKey, columns])
  const [isVisibilityHydrated, setIsVisibilityHydrated] = useState(false)
  const setFooterColSpan = (totalCol, colIndex, colSpan = null, isAfterSpan = false) => {
    return colSpan ? colSpan : isAfterSpan ? totalCol - colIndex : 1
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    setPageSize,
    gotoPage,
    pageCount,
    setHiddenColumns,
    allColumns
  } = useTable(
    {
      columns,
      data,
      initialState: {
        hiddenColumns: initialHiddenColumns
      },
      autoResetPage: false,
      autoResetFilters: false,
      autoResetSortBy: false,
      autoResetExpanded: false,
      autoResetGlobalFilter: false,
      autoResetHiddenColumns: false
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useResizeColumns
  )
  const { globalFilter, pageIndex, pageSize, hiddenColumns = [] } = state
  const currentColumnVisibilityState = useMemo(
    () => getColumnVisibilityStateFromHiddenColumns(allColumns, hiddenColumns),
    [allColumns, hiddenColumns]
  )

  useEffect(() => {
    setIsVisibilityHydrated(false)
  }, [columnVisibilityStorageKey])

  useEffect(() => {
    if (!allColumns.length) return
    setHiddenColumns(initialHiddenColumns)
    setIsVisibilityHydrated(true)
  }, [allColumns.length, initialHiddenColumns, setHiddenColumns])

  useEffect(() => {
    if (!isVisibilityHydrated) return
    saveColumnVisibilityState(columnVisibilityStorageKey, currentColumnVisibilityState)
  }, [columnVisibilityStorageKey, currentColumnVisibilityState, isVisibilityHydrated])
  const visibleColumnCount = headerGroups?.[0]?.headers?.length || allColumns.length || 1
  const pageRows = useMemo(() => page, [page])
  const { bodyRef, isVirtualized, visibleRows, topPadding, bottomPadding } = useVirtualRows(
    pageRows,
    { enabled: pageRows.length > 100 && !isMobileTable, rowHeight: 56, overscan: 12 }
  )
  const showedTotalRows =
    pageSize !== page.length
      ? (pageIndex + 1) * pageSize - (pageSize - page.length)
      : (pageIndex + 1) * pageSize
  const totalRows = data.length
  const rowStart = showedTotalRows - page.length + 1

  return (
    <div className={`card react-table-card ${classnames}`}>
      <div className="card-header react-table-header">
        <div className="react-table-header-content">
          <h2 className="heading">{title}</h2>
          <div className="column-hiding text-end position-relative">
            <Button
              id="hide-column--button"
              className="table-btn table-btn--icon"
              aria-controls={open ? 'hide-column-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}>
              <MoreVertical size={24} />
            </Button>
            <Menu
              id="hide-column-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'hide-column--button'
              }}>
              {allColumns
                .filter((column) => !column?.isActionHide)
                .map((column, index) => (
                  <MenuItem key={index}>
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          {...column.getToggleHiddenProps()}
                          disabled={column?.disable || false}
                        />
                      }
                      label={column.Header}
                    />
                  </MenuItem>
                ))}
            </Menu>
          </div>
        </div>
      </div>
      <div className="card-body react-table-body">
        <div className="react-table-toolbar">
          <div className="react-table-toolbar-item">
            <ShowingRows pageSize={pageSize} setPageSize={setPageSize} t={t} />
          </div>
          <div className="react-table-toolbar-item react-table-toolbar-item--right">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} t={t} />
          </div>
        </div>

        {isMobileTable ? (
          <MobileTableList
            rows={pageRows}
            prepareRow={prepareRow}
            isRowClickable={isRowClickable}
            navigate={navigate}
            rowLinkPath={rowLinkPath}
            rowLinkPrefix={rowLinkPrefix}
            emptyLabel={t('common.No_Records_Found')}
            footerGroups={footerGroups}
            showFooter={footer}
            moreLabel={t('mobile.see_more')}
            lessLabel={t('mobile.see_less')}
          />
        ) : (
          <div className="table-responsive table-scroll-both react-table-scroll">
            <table
              {...getTableProps()}
              className={`table table-hover table-report react-data-table ${
                isVirtualized ? 'react-data-table--virtualized' : ''
              }`}>
              <thead>
                {headerGroups.map((headerGroup, i) => (
                  <tr key={i} {...withoutReactKey(headerGroup.getHeaderGroupProps())}>
                    {headerGroup.headers.map((column, index) => (
                      <th
                        key={index}
                        {...withoutReactKey(column.getHeaderProps(column.getSortByToggleProps()))}
                        className={`text-nowrap react-table-head-cell ${
                          column.isSorted ? 'is-sorted' : ''
                        }`}>
                        <span className="react-table-head-text">{column.render('Header')}</span>
                        <span className="react-table-sort-icon">
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <CornerRightDownArrow size={12} />
                            ) : (
                              <CornerRightUpArrow size={12} />
                            )
                          ) : (
                            ''
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()} ref={bodyRef}>
                {pageRows.length > 0 ? (
                  <>
                    {isVirtualized && topPadding > 0 && (
                      <tr aria-hidden="true" className="react-table-spacer-row">
                        <td
                          colSpan={visibleColumnCount}
                          className="react-table-spacer-cell"
                          style={{ height: topPadding }}
                        />
                      </tr>
                    )}
                    {visibleRows.map((row) => {
                      prepareRow(row)
                      const rowStripeClass =
                        row.index % 2 === 0 ? 'react-table-row--even' : 'react-table-row--odd'

                      return (
                        <tr
                          key={row.id}
                          {...withoutReactKey(row.getRowProps())}
                          data-virtual-row="true"
                          onClick={() =>
                            isRowClickable &&
                            navigate(`${rowLinkPath}/${row.original[rowLinkPrefix]}`)
                          }
                          className={`${rowStripeClass} ${
                            isRowClickable ? 'react-table-row--clickable' : ''
                          }`.trim()}>
                          {row.cells.map((cell, index) => (
                            <td key={index} {...withoutReactKey(cell.getCellProps())}>
                              {cell.render('Cell')}
                            </td>
                          ))}
                        </tr>
                      )
                    })}
                    {isVirtualized && bottomPadding > 0 && (
                      <tr aria-hidden="true" className="react-table-spacer-row">
                        <td
                          colSpan={visibleColumnCount}
                          className="react-table-spacer-cell"
                          style={{ height: bottomPadding }}
                        />
                      </tr>
                    )}
                  </>
                ) : (
                  <tr className="react-table-empty-row">
                    <td colSpan={visibleColumnCount} className="text-center react-table-empty-cell">
                      {t('common.No_Records_Found')}
                    </td>
                  </tr>
                )}
              </tbody>
              {footer && (
                <tfoot>
                  {footerGroups.map((footerGroup, groupIndex) => (
                    <tr key={groupIndex} {...withoutReactKey(footerGroup.getFooterGroupProps())}>
                      {footerGroup.headers.map((column, columnIndex) => (
                        <td
                          key={columnIndex}
                          {...withoutReactKey(column.getFooterProps())}
                          colSpan={
                            setFooterColSpan(
                              footerGroup.headers.length,
                              columnIndex,
                              column?.footerColSpan,
                              column?.isAfterFooterSpan
                            ) || 1
                          }>
                          {column.render('Footer')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tfoot>
              )}
            </table>
          </div>
        )}

        {pageCount > 0 && (
          <div className="react-table-footer">
            <div className="react-table-footer-summary">
              <span>
                {t('common.table_showing_results', {
                  total: tsNumbers(totalRows),
                  start: tsNumbers(rowStart),
                  end: tsNumbers(showedTotalRows)
                })}
              </span>
            </div>
            <div className="react-table-footer-pagination">
              {pageCount > 1 && (
                <PageOptions
                  previousPage={previousPage}
                  canPreviousPage={canPreviousPage}
                  nextPage={nextPage}
                  canNextPage={canNextPage}
                  pageCount={pageCount}
                  pageOptions={pageOptions}
                  pageIndex={pageIndex}
                  gotoPage={gotoPage}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ReactTable)
