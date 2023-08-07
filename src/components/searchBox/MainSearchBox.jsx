import Search from '../../icons/Search'
import './searchBox.scss'

export default function MainSearchBox() {
  return (
    <>
      <div className="mainSearchBox">
        <form>
          <input type="text" className="form-control form-input" placeholder="Search..." />
          <span className="left-pan">
            <button className="btn btn-primary btn-block" type="submit">
              <div className="d-flex">
                <Search size={20} />
              </div>
            </button>
          </span>
        </form>
      </div>
    </>
  )
}
