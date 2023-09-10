import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import React, { Fragment } from 'react'
import PageOption from './PageOption'

export default function PageOptions({
  previousPage,
  canPreviousPage,
  nextPage,
  canNextPage,
  pageCount,
  pageOptions,
  pageIndex,
  gotoPage
}) {
  return (
    <>
      <button className="table-btn" onClick={() => previousPage()} disabled={!canPreviousPage}>
        <ChevronLeft size={30} />
      </button>
      {pageCount > 5
        ? pageOptions.map((page, key) => {
            if (page === 0) {
              return <PageOption key={key} pageIndex={pageIndex} page={page} gotoPage={gotoPage} />
            } else if (page > pageIndex - 2 && page < pageIndex + 5) {
              return <PageOption key={key} pageIndex={pageIndex} page={page} gotoPage={gotoPage} />
            } else if (page === pageCount - 1) {
              return (
                <Fragment key={key}>
                  <span className="table-btn">...</span>
                  <PageOption pageIndex={pageIndex} page={page} gotoPage={gotoPage} />
                </Fragment>
              )
            }

            return <Fragment key={key}></Fragment>
          })
        : pageOptions.map((page, key) => (
            <PageOption key={key} pageIndex={pageIndex} page={page} gotoPage={gotoPage} />
          ))}

      <button className="table-btn" onClick={() => nextPage()} disabled={!canNextPage}>
        <ChevronRight size={30} />
      </button>
    </>
  )
}
