import { FormControlLabel, Switch } from '@mui/material'
import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGlobalFilter, usePagination, useResizeColumns, useSortBy, useTable } from 'react-table'
import CornerRightDownArrow from '../../../icons/CornerRightDownArrow'
import CornerRightUpArrow from '../../../icons/CornerRightUpArrow'
import MoreVertical from '../../../icons/MoreVertical'
import GlobalFilter from '../GlobalFilter'
import PageOptions from './PageOptions'
import ShowingRows from './ShowingRows'
import './table.scss'

function ReactTable({ title, columns, data }) {
  const { t } = useTranslation()
  const [showToggleColumn, setShowToggleColumn] = useState(false)

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
      },
      autoResetPage: false,
      autoResetFilters: false,
      autoResetSortBy: false,
      autoResetExpanded: false,
      autoResetGlobalFilter: false
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
      <div className="d-flex justify-content-between">
        <h2 className="heading">{title}</h2>
        <div className="column-hiding text-end position-relative">
          <button
            className="table-btn"
            onClick={() => setShowToggleColumn((prevState) => !prevState)}>
            <MoreVertical size={26} />
          </button>

          <div className={`column-dropdown position-absolute ${showToggleColumn ? 'active' : ''}`}>
            <ul className="p-3 pe-4 m-0 shadow text-start">
              <li className="pb-2 mb-3 text-center">
                <b>Toggle Column</b>
              </li>
              {allColumns.map((column, index) => (
                <li key={index} className="pb-2">
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
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
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
        </table>
      </div>

      {pageCount > 0 && (
        <div className="row align-items-center">
          <div className="col-sm-4">
            <span>
              Showing {rowStart} to {showedTotalRows} of {totalRows} results
            </span>
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
    </>
  )
}

export default memo(ReactTable)
