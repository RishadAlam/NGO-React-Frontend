import { FormControlLabel, Switch } from '@mui/material'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Cookies from 'js-cookie'
import { memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useGlobalFilter, usePagination, useResizeColumns, useSortBy, useTable } from 'react-table'
import CornerRightDownArrow from '../../../icons/CornerRightDownArrow'
import CornerRightUpArrow from '../../../icons/CornerRightUpArrow'
import MoreVertical from '../../../icons/MoreVertical'
import tsNumbers from '../../../libs/tsNumbers'
import GlobalFilter from '../GlobalFilter'
import PageOptions from './PageOptions'
import ShowingRows from './ShowingRows'
import useVirtualRows from './useVirtualRows'
import './table.scss'

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
  const lang = Cookies.get('i18next')
  const isRowClickable = rowLinkPath !== '#'
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
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
    allColumns
  } = useTable(
    {
      columns,
      data,
      initialState: {
        hiddenColumns: columns.map((column) => {
          if (column.show === false) return column.accessor || column.id
        })
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

  const { globalFilter, pageIndex, pageSize } = state
  const visibleColumnCount = headerGroups?.[0]?.headers?.length || allColumns.length || 1
  const pageRows = useMemo(() => page, [page])
  const { bodyRef, isVirtualized, visibleRows, topPadding, bottomPadding } = useVirtualRows(
    pageRows,
    { enabled: pageRows.length > 50, rowHeight: 56, overscan: 8 }
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

        <div className="table-responsive react-table-scroll">
          <table {...getTableProps()} className="table table-hover table-report react-data-table">
            <thead>
              {headerGroups.map((headerGroup, i) => (
                <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, index) => (
                    <th
                      key={index}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
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
                    return (
                      <tr
                        key={row.id}
                        {...row.getRowProps()}
                        onClick={() =>
                          isRowClickable &&
                          navigate(`${rowLinkPath}/${row.original[rowLinkPrefix]}`)
                        }
                        className={isRowClickable ? 'react-table-row--clickable' : ''}>
                        {row.cells.map((cell, index) => (
                          <td key={index} {...cell.getCellProps()}>
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
                  <tr key={groupIndex} {...footerGroup.getFooterGroupProps()}>
                    {footerGroup.headers.map((column, columnIndex) => (
                      <td
                        key={columnIndex}
                        {...column.getFooterProps()}
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

        {pageCount > 0 && (
          <div className="react-table-footer">
            <div className="react-table-footer-summary">
              {lang !== 'bn' ? (
                <span>
                  Showing {rowStart} to {showedTotalRows} of {totalRows} results.
                </span>
              ) : (
                <span>
                  {tsNumbers(totalRows)}টি ফলাফলের মধ্যে {tsNumbers(rowStart)} থেকে{' '}
                  {tsNumbers(showedTotalRows)} পর্যন্ত দেখানো হয়েছে।
                </span>
              )}
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
