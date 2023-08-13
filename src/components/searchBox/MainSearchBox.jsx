import Search from '../../icons/Search'
import Button from '../util/Button'
import './searchBox.scss'

export default function MainSearchBox({ t }) {
  return (
    <>
      <div className="mainSearchBox">
        <form>
          <input
            type="text"
            className="form-control form-input"
            placeholder={t('common.search_placeholder')}
          />
          <span className="left-pan">
            <Button name={<Search size={20} />} disabled={false} loading={false} type="submit" />
          </span>
        </form>
      </div>
    </>
  )
}
