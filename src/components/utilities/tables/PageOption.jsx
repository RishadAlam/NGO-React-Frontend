export default function PageOption({ pageIndex, page, gotoPage }) {
  return (
    <>
      <button
        className={`table-btn ${pageIndex === page ? 'active' : ''}`}
        onClick={() => gotoPage(page)}>
        {page + 1}
      </button>
    </>
  )
}
