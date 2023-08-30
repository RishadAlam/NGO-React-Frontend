import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { memo } from 'react'
import { useGlobalFilter, usePagination, useResizeColumns, useSortBy, useTable } from 'react-table'
import CornerRightDownArrow from '../../../icons/CornerRightDownArrow'
import CornerRightUpArrow from '../../../icons/CornerRightUpArrow'
import MoreVertical from '../../../icons/MoreVertical'
import GlobalFilter from '../GlobalFilter'
import './table.scss'

function ReactTable({ columns, data }) {
  console.log('rendered')
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
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
      }
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
      <div className="d-flex justify-content-between mb-3">
        <h2 className="heading">React table</h2>
        <div className="column-hiding text-end position-relative">
          <button className="table-btn">
            <MoreVertical size={26} />
          </button>

          <div>
            {allColumns.map((column, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  {...column.getToggleHiddenProps()}
                  disabled={column?.disable || false}
                />
                {column.Header}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">Showing</InputLabel>
            <Select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              label="Page Size">
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={500}>500</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="col-sm-6 text-end">
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        </div>
      </div>

      <div className="table-responsive">
        <table {...getTableProps()} className="table table-hover table-report">
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => (
                  <th key={index} {...column.getHeaderProps(column.getSortByToggleProps())}>
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
            {page.map((row, i) => {
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
            })}
          </tbody>
        </table>
      </div>

      <div className="row align-items-center">
        <div className="col-sm-4">
          <span>
            Showing {rowStart} to {showedTotalRows} of {totalRows} results
          </span>
        </div>
        <div className="col-sm-8 text-end">
          <button className="table-btn" onClick={() => previousPage()} disabled={!canPreviousPage}>
            <ChevronLeft size={30} />
          </button>
          {pageCount > 5
            ? pageOptions.map((page, key) => {
                if (page === 0) {
                  return (
                    <button
                      className="table-btn active"
                      key={`1st-${key}`}
                      onClick={() => gotoPage(page)}
                      disabled={!canNextPage}>
                      {++page}
                    </button>
                  )
                } else if (page > pageIndex - 2 && page < pageIndex + 5) {
                  return (
                    <button
                      className="table-btn"
                      key={`2nd-${key}`}
                      onClick={() => gotoPage(page)}
                      disabled={!canNextPage}>
                      {++page}
                    </button>
                  )
                } else if (page === pageCount - 1) {
                  return (
                    <>
                      <span className="table-btn" key={`${key}-x`}>
                        ...
                      </span>
                      <button
                        className="table-btn"
                        key={`last-${key}`}
                        onClick={() => gotoPage(page)}
                        disabled={!canNextPage}>
                        {++page}
                      </button>
                    </>
                  )
                }
              })
            : pageOptions.map((page, key) => (
                <button
                  className="table-btn"
                  key={key}
                  onClick={() => gotoPage(page)}
                  disabled={!canNextPage}>
                  {++page}
                </button>
              ))}

          <button className="table-btn" onClick={() => nextPage()} disabled={!canNextPage}>
            <ChevronRight size={30} />
          </button>
        </div>
      </div>
    </>
  )
}

export default memo(ReactTable)
