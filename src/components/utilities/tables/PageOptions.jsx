import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import PageOption from './PageOption'
import tsNumbers from '../../../libs/tsNumbers'

export default function PageOptions({
  previousPage,
  canPreviousPage,
  nextPage,
  canNextPage,
  pageCount,
  pageOptions,
  pageIndex,
  gotoPage,
  compact = false
}) {
  const { t } = useTranslation()
  if (compact) {
    return (
      <nav className="mobile-table-pagination" aria-label={t('mobile.pagination')}>
        <button
          type="button"
          className="table-btn"
          aria-label={t('localization.shared.previous')}
          onClick={previousPage}
          disabled={!canPreviousPage}>
          <ChevronLeft />
        </button>
        <span role="status" aria-live="polite">
          {t('mobile.page_of', { page: tsNumbers(pageIndex + 1), total: tsNumbers(pageCount) })}
        </span>
        <button
          type="button"
          className="table-btn"
          aria-label={t('localization.shared.next')}
          onClick={nextPage}
          disabled={!canNextPage}>
          <ChevronRight />
        </button>
      </nav>
    )
  }
  return (
    <>
      <button
        aria-label={t('localization.shared.previous')}
        className="table-btn"
        onClick={() => previousPage()}
        disabled={!canPreviousPage}>
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

      <button
        aria-label={t('localization.shared.next')}
        className="table-btn"
        onClick={() => nextPage()}
        disabled={!canNextPage}>
        <ChevronRight size={30} />
      </button>
    </>
  )
}
