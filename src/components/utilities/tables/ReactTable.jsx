import { FormControlLabel, Switch } from '@mui/material'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Cookies from 'js-cookie'
import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGlobalFilter, usePagination, useResizeColumns, useSortBy, useTable } from 'react-table'
import CornerRightDownArrow from '../../../icons/CornerRightDownArrow'
import CornerRightUpArrow from '../../../icons/CornerRightUpArrow'
import MoreVertical from '../../../icons/MoreVertical'
import tsNumbers from '../../../libs/tsNumbers'
import GlobalFilter from '../GlobalFilter'
import PageOptions from './PageOptions'
import ShowingRows from './ShowingRows'
import './table.scss'

function ReactTable({ title, columns, data, footer = false }) {
  const { t } = useTranslation()
  const lang = Cookies.get('i18next')
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
  const showedTotalRows =
    pageSize !== page.length
      ? (pageIndex + 1) * pageSize - (pageSize - page.length)
      : (pageIndex + 1) * pageSize
  const totalRows = data.length
  const rowStart = showedTotalRows - page.length + 1

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="heading">{title}</h2>
            <div className="column-hiding text-end position-relative">
              <Button
                id="hide-column--button"
                className="table-btn p-0"
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
        <div className="card-body">
          <div className="row">
            <div className="col-sm-6">
              <ShowingRows pageSize={pageSize} setPageSize={setPageSize} t={t} />
            </div>
            <div className="col-sm-6 text-end">
              <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} t={t} />
            </div>
          </div>

          <div className="table-responsive">
            <table {...getTableProps()} className="table table-hover table-report">
              <thead>
                {headerGroups.map((headerGroup, i) => (
                  <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column, index) => (
                      <th
                        key={index}
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        className="text-nowrap">
                        {column.render('Header')}{' '}
                        <span>
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
              <tbody {...getTableBodyProps()}>
                {page.length > 0 ? (
                  page.map((row, i) => {
                    prepareRow(row)
                    return (
                      <tr key={i} {...row.getRowProps()}>
                        {row.cells.map((cell, index) => (
                          <td key={index} {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </td>
                        ))}
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={allColumns.length} className="text-center">
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
            <div className="row align-items-center">
              <div className="col-sm-4">
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
              <div className="col-sm-8 text-end">
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
    </>
  )
}

export default memo(ReactTable)
