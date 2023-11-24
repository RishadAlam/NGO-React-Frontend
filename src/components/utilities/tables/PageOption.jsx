import tsNumbers from '../../../libs/tsNumbers'

export default function PageOption({ pageIndex, page, gotoPage }) {
  return (
    <>
      <button
        className={`table-btn ${pageIndex === page ? 'active' : ''}`}
        onClick={() => gotoPage(page)}>
        {tsNumbers(page + 1)}
      </button>
    </>
  )
}
